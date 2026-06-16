from django.contrib.auth import get_user_model
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsModeratorOrAdmin
from .models import AvanceEspiritual, FichaPedagogica, Modulo, PreguntaChecklist, RespuestaChecklist
from .serializers import (
    AvanceEspiritualSerializer,
    FichaPedagogicaSerializer,
    FichaPedagogicaUpdateSerializer,
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
        'usuario', 'modulo_actual'
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
        ficha, _ = FichaPedagogica.objects.get_or_create(usuario=request.user)
        return Response(FichaPedagogicaSerializer(ficha).data)

    @action(detail=False, methods=['post'])
    def responder_checklist(self, request):
        ser = ResponderChecklistSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ficha, _ = FichaPedagogica.objects.get_or_create(usuario=request.user)
        pregunta = PreguntaChecklist.objects.get(
            pk=ser.validated_data['pregunta_id'],
            activa=True,
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
        return Response({
            'progreso_general': progreso,
            'ficha': FichaPedagogicaSerializer(ficha).data,
        })


class AvanceEspiritualViewSet(viewsets.ModelViewSet):
    queryset = AvanceEspiritual.objects.all()
    serializer_class = AvanceEspiritualSerializer
    permission_classes = [IsModeratorOrAdmin]

    def perform_create(self, serializer):
        serializer.save(registrado_por=self.request.user)
