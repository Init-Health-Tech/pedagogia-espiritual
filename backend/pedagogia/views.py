from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsModeratorOrAdmin
from .models import (
    AvanceEspiritual,
    FichaAreaEvaluacion,
    FichaEntradaSemanal,
    FichaPedagogica,
    FichaPraxisItem,
    FichaPraxisRegistro,
    Modulo,
    PreguntaChecklist,
    RespuestaChecklist,
)
from .avance import (
    confirmar_avance,
    posponer_avance,
    recalcular_listo_para_avanzar,
)
from .signals import asegurar_ficha
from .serializers import (
    AvanceEspiritualSerializer,
    FichaAreaEvaluacionSerializer,
    FichaEntradaSemanalSerializer,
    FichaPedagogicaSerializer,
    FichaPedagogicaUpdateSerializer,
    FichaPerfilUpdateSerializer,
    FichaPraxisItemSerializer,
    FichaPraxisRegistroSerializer,
    GuardarSemanaFichaSerializer,
    ModuloSerializer,
    PreguntaChecklistSerializer,
    ResponderChecklistSerializer,
)

User = get_user_model()


class ModuloViewSet(viewsets.ModelViewSet):
    queryset = Modulo.objects.all()
    serializer_class = ModuloSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_formador:
            return Modulo.objects.all()
        return Modulo.objects.filter(activo=True)

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return super().get_permissions()


class PreguntaChecklistViewSet(viewsets.ModelViewSet):
    queryset = PreguntaChecklist.objects.select_related('modulo')
    serializer_class = PreguntaChecklistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_formador:
            return self.queryset
        return self.queryset.filter(activa=True)

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return super().get_permissions()


class FichaPedagogicaViewSet(viewsets.ModelViewSet):
    queryset = FichaPedagogica.objects.select_related(
        'usuario', 'modulo_actual', 'perfil',
    ).prefetch_related('avances', 'respuestas_checklist')
    serializer_class = FichaPedagogicaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_formador:
            return self.queryset
        return self.queryset.filter(usuario=user)

    def get_permissions(self):
        if self.action in ('update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ('update', 'partial_update'):
            return FichaPedagogicaUpdateSerializer
        return FichaPedagogicaSerializer

    @action(detail=False, methods=['get'])
    def mi_ficha(self, request):
        ficha = asegurar_ficha(request.user)
        return Response(FichaPedagogicaSerializer(ficha).data)

    @action(detail=False, methods=['post', 'patch'])
    def actualizar_perfil(self, request):
        ficha = asegurar_ficha(request.user)
        perfil = ficha.perfil
        ser = FichaPerfilUpdateSerializer(perfil, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        if not perfil.perfil_completado:
            perfil.perfil_completado = True
            perfil.save(update_fields=['perfil_completado', 'updated_at'])
        ficha.refresh_from_db()
        return Response(FichaPedagogicaSerializer(ficha).data)

    @action(detail=False, methods=['post'])
    def guardar_semana_ficha(self, request):
        ser = GuardarSemanaFichaSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data
        semana = data['semana_global']
        ficha = asegurar_ficha(request.user)
        disp = ficha.disponibilidad_semana(semana)
        if not disp['disponible']:
            return Response(
                {'detail': 'Esta semana de la ficha aún no está disponible.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Semana actual = máxima disponible; semanas anteriores ya guardadas = solo lectura
        preguntas = PreguntaChecklist.objects.filter(activa=True)
        disponibles = []
        for p in preguntas:
            s = p.semana or p.orden
            if ficha.disponibilidad_semana(s)['disponible']:
                disponibles.append(s)
        semana_actual = max(disponibles) if disponibles else None
        ya_guardada = (
            FichaEntradaSemanal.objects.filter(usuario=request.user, semana_global=semana).exists()
            or FichaPraxisRegistro.objects.filter(usuario=request.user, semana_global=semana).exists()
        )
        if semana_actual is not None and semana < semana_actual and ya_guardada:
            return Response(
                {'detail': 'Las semanas anteriores quedan en solo lectura.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        areas_map = {
            a.id: a for a in FichaAreaEvaluacion.objects.filter(activa=True)
        }
        items_ids = set(
            FichaPraxisItem.objects.filter(activo=True).values_list('id', flat=True)
        )

        with transaction.atomic():
            for p in data.get('praxis') or []:
                item_id = p['item_id']
                if item_id not in items_ids:
                    continue
                FichaPraxisRegistro.objects.update_or_create(
                    usuario=request.user,
                    semana_global=semana,
                    item_id=item_id,
                    defaults={'cumplido': bool(p.get('cumplido', False))},
                )

            for e in data.get('entradas') or []:
                area_id = e['area_id']
                area = areas_map.get(area_id)
                if not area:
                    continue
                puntaje = e.get('puntaje')
                if puntaje is None:
                    FichaEntradaSemanal.objects.filter(
                        usuario=request.user,
                        semana_global=semana,
                        area_id=area_id,
                    ).delete()
                    continue
                if puntaje < area.escala_min or puntaje > area.escala_max:
                    return Response(
                        {
                            'detail': (
                                f'El valor de "{area.nombre}" debe estar entre '
                                f'{area.escala_min} y {area.escala_max}.'
                            ),
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                FichaEntradaSemanal.objects.update_or_create(
                    usuario=request.user,
                    semana_global=semana,
                    area_id=area_id,
                    defaults={'puntaje': puntaje},
                )

        ficha = asegurar_ficha(request.user)
        recalcular_listo_para_avanzar(ficha)
        ficha.refresh_from_db()
        return Response(FichaPedagogicaSerializer(ficha).data)

    @action(detail=False, methods=['post'])
    def responder_checklist(self, request):
        ser = ResponderChecklistSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ficha = asegurar_ficha(request.user)
        pregunta = PreguntaChecklist.objects.get(
            pk=ser.validated_data['pregunta_id'],
            activa=True,
        )
        disp = ficha.disponibilidad_semana(pregunta.semana or pregunta.orden)
        if not disp['disponible']:
            return Response(
                {'detail': 'Esta semana del diario aún no está disponible.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        respuesta, _ = RespuestaChecklist.objects.get_or_create(
            ficha=ficha,
            pregunta=pregunta,
        )
        respuesta.completada = ser.validated_data.get('completada', True)
        respuesta.nota = ser.validated_data['nota'].strip()
        if respuesta.nota:
            respuesta.completada = True
        respuesta.save()
        progreso = ficha.recalcular_progreso()
        recalcular_listo_para_avanzar(ficha)
        ficha.refresh_from_db()
        return Response({
            'progreso_general': progreso,
            'ficha': FichaPedagogicaSerializer(ficha).data,
        })

    @action(detail=True, methods=['post'], permission_classes=[IsModeratorOrAdmin])
    def confirmar_avance(self, request, pk=None):
        ficha = self.get_object()
        ficha, ok = confirmar_avance(ficha)
        if not ok:
            return Response(
                {'detail': 'No hay una etapa siguiente disponible.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(FichaPedagogicaSerializer(ficha).data)

    @action(detail=True, methods=['post'], permission_classes=[IsModeratorOrAdmin])
    def posponer_avance(self, request, pk=None):
        ficha = self.get_object()
        ficha = posponer_avance(ficha)
        return Response(FichaPedagogicaSerializer(ficha).data)


class AvanceEspiritualViewSet(viewsets.ModelViewSet):
    queryset = AvanceEspiritual.objects.all()
    serializer_class = AvanceEspiritualSerializer
    permission_classes = [IsModeratorOrAdmin]

    def perform_create(self, serializer):
        serializer.save(registrado_por=self.request.user)


class FichaAreaEvaluacionViewSet(viewsets.ModelViewSet):
    queryset = FichaAreaEvaluacion.objects.all()
    serializer_class = FichaAreaEvaluacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_formador:
            return self.queryset
        return self.queryset.filter(activa=True)

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return super().get_permissions()


class FichaPraxisItemViewSet(viewsets.ModelViewSet):
    queryset = FichaPraxisItem.objects.all()
    serializer_class = FichaPraxisItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_formador:
            return self.queryset
        return self.queryset.filter(activo=True)

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return super().get_permissions()


class FichaEntradaSemanalViewSet(viewsets.ModelViewSet):
    queryset = FichaEntradaSemanal.objects.select_related('usuario', 'area')
    serializer_class = FichaEntradaSemanalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = self.queryset
        if user.is_formador:
            usuario_id = self.request.query_params.get('usuario')
            if usuario_id:
                qs = qs.filter(usuario_id=usuario_id)
            return qs
        return qs.filter(usuario=user)

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return super().get_permissions()


class FichaPraxisRegistroViewSet(viewsets.ModelViewSet):
    queryset = FichaPraxisRegistro.objects.select_related('usuario', 'item')
    serializer_class = FichaPraxisRegistroSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = self.queryset
        if user.is_formador:
            usuario_id = self.request.query_params.get('usuario')
            if usuario_id:
                qs = qs.filter(usuario_id=usuario_id)
            return qs
        return qs.filter(usuario=user)

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return super().get_permissions()
