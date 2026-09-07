from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsModeratorOrAdmin
from .models import Evento, EventoRSVP
from .serializers import (
    EventoRSVPSerializer,
    EventoRSVPWriteSerializer,
    EventoSerializer,
)


class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.select_related('creado_por').prefetch_related('grupos')
    serializer_class = EventoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsModeratorOrAdmin()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        qs = self.queryset.annotate(
            _conteo_voy=Count(
                'rsvps',
                filter=Q(rsvps__respuesta=EventoRSVP.Respuesta.VOY),
                distinct=True,
            ),
            _conteo_no=Count(
                'rsvps',
                filter=Q(rsvps__respuesta=EventoRSVP.Respuesta.NO),
                distinct=True,
            ),
        )
        if user.is_moderator:
            return qs
        grupos_ids = user.grupos_pastoreo.values_list('id', flat=True)
        return qs.filter(
            Q(es_global=True) | Q(grupos__in=grupos_ids)
        ).distinct()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        user = self.request.user
        if user.is_authenticated and self.action in ('list', 'proximos', 'retrieve'):
            context['mi_rsvp_map'] = dict(
                EventoRSVP.objects.filter(usuario=user).values_list('evento_id', 'respuesta')
            )
        return context

    def perform_create(self, serializer):
        evento = serializer.save(creado_por=self.request.user)
        if evento.es_global:
            evento.grupos.clear()

    def perform_update(self, serializer):
        evento = serializer.save()
        if evento.es_global:
            evento.grupos.clear()

    @action(detail=False, methods=['get'])
    def proximos(self, request):
        """Eventos con fecha >= hoy, ordenados por fecha/hora, filtrados por destinatario."""
        hoy = timezone.localdate()
        qs = self.filter_queryset(self.get_queryset()).filter(fecha__gte=hoy).order_by('fecha', 'hora')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def rsvp(self, request, pk=None):
        evento = self.get_object()
        writer = EventoRSVPWriteSerializer(data=request.data)
        writer.is_valid(raise_exception=True)
        rsvp, _created = EventoRSVP.objects.update_or_create(
            evento=evento,
            usuario=request.user,
            defaults={'respuesta': writer.validated_data['respuesta']},
        )
        return Response(EventoRSVPSerializer(rsvp).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def respuestas(self, request, pk=None):
        if not request.user.is_moderator:
            return Response({'detail': 'No autorizado.'}, status=status.HTTP_403_FORBIDDEN)
        evento = self.get_object()
        rsvps = evento.rsvps.select_related('usuario').order_by('respuesta', 'usuario__first_name')
        voy = EventoRSVPSerializer(
            rsvps.filter(respuesta=EventoRSVP.Respuesta.VOY),
            many=True,
        ).data
        no = EventoRSVPSerializer(
            rsvps.filter(respuesta=EventoRSVP.Respuesta.NO),
            many=True,
        ).data
        return Response({
            'evento_id': evento.id,
            'titulo': evento.titulo,
            'voy': voy,
            'no': no,
            'conteo_voy': len(voy),
            'conteo_no': len(no),
        })
