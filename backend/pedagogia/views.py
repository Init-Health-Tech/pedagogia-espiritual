from django.contrib.auth import get_user_model
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsModeratorOrAdmin
from .models import AvanceEspiritual, EtapaEspiritual, FichaPedagogica
from .serializers import (
    AvanceEspiritualSerializer,
    EtapaEspiritualSerializer,
    FichaPedagogicaSerializer,
    FichaPedagogicaUpdateSerializer,
)

User = get_user_model()


class EtapaEspiritualViewSet(viewsets.ModelViewSet):
    queryset = EtapaEspiritual.objects.all()
    serializer_class = EtapaEspiritualSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return super().get_permissions()


class FichaPedagogicaViewSet(viewsets.ModelViewSet):
    queryset = FichaPedagogica.objects.select_related('usuario', 'etapa_actual').prefetch_related('avances')
    serializer_class = FichaPedagogicaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_moderator:
            return self.queryset
        return self.queryset.filter(usuario=user)

    def get_serializer_class(self):
        if self.action in ('update', 'partial_update'):
            return FichaPedagogicaUpdateSerializer
        return FichaPedagogicaSerializer

    @action(detail=False, methods=['get'])
    def mi_ficha(self, request):
        ficha, _ = FichaPedagogica.objects.get_or_create(usuario=request.user)
        return Response(FichaPedagogicaSerializer(ficha).data)


class AvanceEspiritualViewSet(viewsets.ModelViewSet):
    queryset = AvanceEspiritual.objects.all()
    serializer_class = AvanceEspiritualSerializer
    permission_classes = [IsModeratorOrAdmin]

    def perform_create(self, serializer):
        serializer.save(registrado_por=self.request.user)
