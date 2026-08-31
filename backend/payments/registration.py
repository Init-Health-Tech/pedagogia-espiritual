from calendar import monthrange
from datetime import date, datetime, time

from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from .models import Pago, PlanSuscripcion, Suscripcion

User = get_user_model()


def add_months(d, months):
    month = d.month - 1 + int(months)
    year = d.year + month // 12
    month = month % 12 + 1
    day = min(d.day, monthrange(year, month)[1])
    return date(year, month, day)


class RegistrarPagoSerializer(serializers.Serializer):
    usuario = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.Role.MEMBER, is_active=True),
    )
    plan = serializers.PrimaryKeyRelatedField(
        queryset=PlanSuscripcion.objects.filter(activo=True),
    )
    monto = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)
    fecha_pago = serializers.DateField(required=False)

    def validate_fecha_pago(self, value):
        return value or timezone.localdate()

    def create(self, validated_data):
        request = self.context['request']
        usuario = validated_data['usuario']
        plan = validated_data['plan']
        monto = validated_data['monto']
        fecha = validated_data.get('fecha_pago') or timezone.localdate()
        fecha_fin = add_months(fecha, plan.duracion_meses)
        fecha_pago_dt = timezone.make_aware(datetime.combine(fecha, time(12, 0)))

        with transaction.atomic():
            Suscripcion.objects.filter(
                usuario=usuario,
                estado=Suscripcion.Estado.ACTIVA,
            ).update(estado=Suscripcion.Estado.VENCIDA)

            suscripcion = Suscripcion.objects.create(
                usuario=usuario,
                plan=plan,
                estado=Suscripcion.Estado.ACTIVA,
                fecha_inicio=fecha,
                fecha_fin=fecha_fin,
            )

            pago = Pago.objects.create(
                usuario=usuario,
                suscripcion=suscripcion,
                monto=monto,
                metodo=Pago.Metodo.TRANSFERENCIA,
                estado=Pago.Estado.COMPLETADO,
                fecha_pago=fecha_pago_dt,
                registrado_por=request.user,
                notas=f'Registro manual — {plan.nombre}',
            )

            if not usuario.is_active_member:
                usuario.is_active_member = True
                usuario.save(update_fields=['is_active_member'])

        return {
            'pago': pago,
            'suscripcion': suscripcion,
            'proximo_pago': fecha_fin,
        }
