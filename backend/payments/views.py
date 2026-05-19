from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsAdminUser, IsModeratorOrAdmin
from .models import Pago, PlanSuscripcion, Suscripcion
from .serializers import PagoSerializer, PlanSuscripcionSerializer, SuscripcionSerializer


class PlanSuscripcionViewSet(viewsets.ModelViewSet):
    queryset = PlanSuscripcion.objects.filter(activo=True)
    serializer_class = PlanSuscripcionSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.is_admin_user:
            return PlanSuscripcion.objects.all()
        return PlanSuscripcion.objects.filter(activo=True)


class SuscripcionViewSet(viewsets.ModelViewSet):
    queryset = Suscripcion.objects.select_related('usuario', 'plan')
    serializer_class = SuscripcionSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_moderator:
            return self.queryset
        return self.queryset.filter(usuario=user)

    @action(detail=False, methods=['get'])
    def mi_suscripcion(self, request):
        sub = self.get_queryset().filter(
            usuario=request.user,
            estado=Suscripcion.Estado.ACTIVA,
        ).first()
        if not sub:
            return Response({'activa': False, 'mensaje': 'Sin suscripción activa'})
        return Response(SuscripcionSerializer(sub).data)


class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.select_related('usuario', 'suscripcion')
    serializer_class = PagoSerializer
    permission_classes = [IsModeratorOrAdmin]
    filterset_fields = ['estado', 'metodo', 'usuario']

    def perform_create(self, serializer):
        serializer.save(registrado_por=self.request.user)

    @action(detail=True, methods=['post'])
    def confirmar(self, request, pk=None):
        pago = self.get_object()
        pago.estado = Pago.Estado.COMPLETADO
        pago.fecha_pago = timezone.now()
        pago.save(update_fields=['estado', 'fecha_pago'])

        if pago.suscripcion:
            sub = pago.suscripcion
            sub.estado = Suscripcion.Estado.ACTIVA
            if not sub.fecha_inicio:
                sub.fecha_inicio = timezone.now().date()
            sub.save(update_fields=['estado', 'fecha_inicio'])

        return Response(PagoSerializer(pago).data)
