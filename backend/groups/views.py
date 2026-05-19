from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsModeratorOrAdmin
from .models import EsquemaGrupo, GrupoPastoreo
from .serializers import EsquemaGrupoSerializer, GrupoPastoreoListSerializer, GrupoPastoreoSerializer


class GrupoPastoreoViewSet(viewsets.ModelViewSet):
    queryset = GrupoPastoreo.objects.prefetch_related('miembros', 'contenidos', 'esquemas')
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return GrupoPastoreoListSerializer
        return GrupoPastoreoSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.is_moderator:
            return self.queryset
        return self.queryset.filter(miembros=user, activo=True)

    @action(detail=False, methods=['get'])
    def mis_grupos(self, request):
        qs = self.get_queryset()
        return Response(GrupoPastoreoListSerializer(qs, many=True).data)


class EsquemaGrupoViewSet(viewsets.ModelViewSet):
    queryset = EsquemaGrupo.objects.select_related('grupo')
    serializer_class = EsquemaGrupoSerializer
    filterset_fields = ['grupo']

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_moderator:
            return self.queryset
        return self.queryset.filter(grupo__miembros=user, grupo__activo=True)
