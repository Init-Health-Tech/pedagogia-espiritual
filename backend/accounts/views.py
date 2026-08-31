from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsAdminUser
from .serializers import (
    ChangePasswordSerializer,
    RegisterSerializer,
    UserAdminSerializer,
    UserSerializer,
)

User = get_user_model()

TIPOS_CONTENIDO = ('documento', 'presentacion', 'video')


def _stats_por_tipo(contenidos):
    por_tipo = {}
    for tipo in TIPOS_CONTENIDO:
        items = [c for c in contenidos if c['tipo'] == tipo]
        total = len(items)
        vistos = sum(1 for c in items if c.get('visto'))
        por_tipo[tipo] = {
            'total': total,
            'vistos': vistos,
            'percent': 0 if total == 0 else round((vistos / total) * 100),
        }
    relevant = [c for c in contenidos if c['tipo'] in TIPOS_CONTENIDO]
    total = len(relevant)
    vistos = sum(1 for c in relevant if c.get('visto'))
    return {
        'total': total,
        'vistos': vistos,
        'percent': 0 if total == 0 else round((vistos / total) * 100),
        'por_tipo': por_tipo,
    }


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Contraseña actualizada.'})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related('ficha_pedagogica', 'ficha_pedagogica__modulo_actual').order_by('-date_joined')
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['role', 'is_active_member', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        if user.is_admin_user or user.role == User.Role.ADMIN:
            return Response(
                {'detail': 'No se pueden editar cuentas de administrador desde este panel.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return Response(
            {'detail': 'No se permite eliminar usuarios. Usa desactivar acceso.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_active_member = not user.is_active_member
        user.save(update_fields=['is_active_member'])
        return Response(UserAdminSerializer(user).data)

    @action(detail=True, methods=['get'])
    def progreso(self, request, pk=None):
        """Progreso pedagógico y de contenidos de un usuario (vista admin)."""
        from content.models import Contenido, ContenidoVista
        from content.serializers import ContenidoSerializer
        from pedagogia.models import FichaPedagogica
        from pedagogia.serializers import FichaPedagogicaSerializer

        usuario = self.get_object()

        ficha = (
            FichaPedagogica.objects
            .filter(usuario=usuario)
            .select_related('usuario', 'modulo_actual', 'perfil')
            .prefetch_related('avances', 'respuestas_checklist__pregunta')
            .first()
        )

        contenidos_qs = Contenido.objects.filter(tipo__in=TIPOS_CONTENIDO).select_related(
            'categoria', 'creado_por'
        )
        viewed_ids = set(
            ContenidoVista.objects.filter(
                usuario=usuario,
                contenido_id__in=contenidos_qs.values_list('id', flat=True),
            ).values_list('contenido_id', flat=True)
        )
        vistas_fechas = dict(
            ContenidoVista.objects.filter(
                usuario=usuario,
                contenido_id__in=viewed_ids,
            ).values_list('contenido_id', 'visto_en')
        )

        contenidos_data = ContenidoSerializer(
            contenidos_qs,
            many=True,
            context={'request': request, 'viewed_ids': viewed_ids},
        ).data
        for item in contenidos_data:
            visto_en = vistas_fechas.get(item['id'])
            item['visto_en'] = visto_en.isoformat() if visto_en else None

        return Response({
            'usuario': UserAdminSerializer(usuario).data,
            'ficha': FichaPedagogicaSerializer(ficha).data if ficha else None,
            'contenidos': contenidos_data,
            'resumen_contenidos': _stats_por_tipo(contenidos_data),
        })
