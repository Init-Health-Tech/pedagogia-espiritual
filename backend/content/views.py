from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsModeratorOrAdmin
from payments.models import Suscripcion
from .models import CategoriaContenido, Contenido
from .serializers import CategoriaContenidoSerializer, ContenidoSerializer


class CategoriaContenidoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaContenido.objects.all()
    serializer_class = CategoriaContenidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return super().get_permissions()


class ContenidoViewSet(viewsets.ModelViewSet):
    queryset = Contenido.objects.select_related('categoria', 'creado_por')
    serializer_class = ContenidoSerializer
    filterset_fields = ['tipo', 'categoria', 'es_publico']
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

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    @action(detail=False, methods=['get'])
    def videos(self, request):
        qs = self.get_queryset().filter(tipo=Contenido.Tipo.VIDEO)
        return Response(ContenidoSerializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def presentaciones(self, request):
        qs = self.get_queryset().filter(tipo=Contenido.Tipo.PRESENTACION)
        return Response(ContenidoSerializer(qs, many=True).data)
