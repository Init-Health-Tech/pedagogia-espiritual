from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Notificacion
from .serializers import NotificacionSerializer


class NotificacionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notificacion.objects.filter(
            usuario=self.request.user,
            activa=True,
        ).order_by('-created_at')

    @action(detail=False, methods=['get'])
    def no_leidas(self, request):
        count = self.get_queryset().filter(leida=False).count()
        return Response({'count': count})

    @action(detail=True, methods=['post'])
    def marcar_leida(self, request, pk=None):
        notif = self.get_object()
        notif.marcar_leida()
        return Response(NotificacionSerializer(notif).data)

    @action(detail=False, methods=['post'])
    def marcar_todas_leidas(self, request):
        qs = self.get_queryset().filter(leida=False)
        ahora = timezone.now()
        updated = qs.update(leida=True, leida_en=ahora)
        return Response({'marcadas': updated})
