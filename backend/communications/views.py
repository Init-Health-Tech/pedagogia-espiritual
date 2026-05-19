from django.db.models import Q
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsModeratorOrAdmin
from .models import Anuncio, Mensaje
from .serializers import AnuncioSerializer, MensajeSerializer


class AnuncioViewSet(viewsets.ModelViewSet):
    queryset = Anuncio.objects.select_related('autor', 'grupo')
    serializer_class = AnuncioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        grupos_ids = user.grupos_pastoreo.values_list('id', flat=True)
        return self.queryset.filter(
            Q(es_global=True) | Q(grupo__in=grupos_ids) | Q(grupo__isnull=True, es_global=True)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(autor=self.request.user)


class MensajeViewSet(viewsets.ModelViewSet):
    queryset = Mensaje.objects.select_related('remitente', 'destinatario')
    serializer_class = MensajeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return self.queryset.filter(Q(remitente=user) | Q(destinatario=user))

    def perform_create(self, serializer):
        serializer.save(remitente=self.request.user)

    @action(detail=False, methods=['get'])
    def recibidos(self, request):
        qs = self.get_queryset().filter(destinatario=request.user)
        return Response(MensajeSerializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def enviados(self, request):
        qs = self.get_queryset().filter(remitente=request.user)
        return Response(MensajeSerializer(qs, many=True).data)

    @action(detail=True, methods=['post'])
    def marcar_leido(self, request, pk=None):
        mensaje = self.get_object()
        if mensaje.destinatario != request.user:
            return Response({'detail': 'No autorizado'}, status=403)
        mensaje.leido = True
        mensaje.save(update_fields=['leido'])
        return Response(MensajeSerializer(mensaje).data)

    @action(detail=False, methods=['get'])
    def no_leidos(self, request):
        count = self.get_queryset().filter(destinatario=request.user, leido=False).count()
        return Response({'count': count})
