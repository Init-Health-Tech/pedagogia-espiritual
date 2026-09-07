from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsModeratorOrAdmin
from payments.models import Suscripcion
from .models import CategoriaContenido, Contenido, ContenidoVista, TutorialVideo
from .serializers import CategoriaContenidoSerializer, ContenidoSerializer, TutorialVideoSerializer


class CategoriaContenidoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaContenido.objects.all()
    serializer_class = CategoriaContenidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return super().get_permissions()


class TutorialVideoViewSet(viewsets.ModelViewSet):
    """Entradas fijas de tutoriales: listado para miembros; edición para admin."""

    queryset = TutorialVideo.objects.all()
    serializer_class = TutorialVideoSerializer
    http_method_names = ['get', 'patch', 'head', 'options']
    lookup_field = 'seccion'

    def get_permissions(self):
        if self.action in ('update', 'partial_update'):
            return [IsModeratorOrAdmin()]
        return [permissions.IsAuthenticated()]


class ContenidoViewSet(viewsets.ModelViewSet):
    queryset = Contenido.objects.select_related('categoria', 'modulo', 'creado_por')
    serializer_class = ContenidoSerializer
    filterset_fields = ['tipo', 'categoria', 'modulo', 'es_publico']
    search_fields = ['titulo', 'descripcion']

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_moderator:
            return self.queryset
        tiene_suscripcion = Suscripcion.objects.filter(
            usuario=user, estado=Suscripcion.Estado.ACTIVA
        ).exists()
        qs = self.queryset.filter(es_publico=True)
        if tiene_suscripcion:
            qs = self.queryset
        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        user = self.request.user
        if user.is_authenticated:
            qs = self.get_queryset()
            context['viewed_ids'] = set(
                ContenidoVista.objects.filter(
                    usuario=user,
                    contenido_id__in=qs.values_list('id', flat=True),
                ).values_list('contenido_id', flat=True)
            )
        return context

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    @action(detail=False, methods=['get'])
    def videos(self, request):
        qs = self.get_queryset().filter(tipo=Contenido.Tipo.VIDEO)
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def presentaciones(self, request):
        qs = self.get_queryset().filter(tipo=Contenido.Tipo.PRESENTACION)
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=True, methods=['post'])
    def marcar_visto(self, request, pk=None):
        contenido = self.get_object()
        vista, created = ContenidoVista.objects.get_or_create(
            usuario=request.user,
            contenido=contenido,
        )
        if not created:
            vista.save()
        return Response(
            {'visto': True, 'visto_en': vista.visto_en},
            status=status.HTTP_200_OK,
        )
