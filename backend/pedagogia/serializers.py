from rest_framework import serializers

from accounts.serializers import UserSerializer
from .models import AvanceEspiritual, FichaPedagogica, Modulo, PreguntaChecklist, RespuestaChecklist


class ModuloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modulo
        fields = '__all__'


class PreguntaChecklistSerializer(serializers.ModelSerializer):
    modulo_nombre = serializers.CharField(source='modulo.nombre', read_only=True)

    class Meta:
        model = PreguntaChecklist
        fields = '__all__'


class RespuestaChecklistSerializer(serializers.ModelSerializer):
    pregunta_detalle = PreguntaChecklistSerializer(source='pregunta', read_only=True)

    class Meta:
        model = RespuestaChecklist
        fields = '__all__'
        read_only_fields = ('ficha',)


class AvanceEspiritualSerializer(serializers.ModelSerializer):
    registrado_por_nombre = serializers.CharField(
        source='registrado_por.get_full_name',
        read_only=True,
    )

    class Meta:
        model = AvanceEspiritual
        fields = '__all__'
        read_only_fields = ('registrado_por',)


class FichaPedagogicaSerializer(serializers.ModelSerializer):
    usuario_detalle = UserSerializer(source='usuario', read_only=True)
    modulo_actual_detalle = ModuloSerializer(source='modulo_actual', read_only=True)
    avances = AvanceEspiritualSerializer(many=True, read_only=True)
    checklist = serializers.SerializerMethodField()

    class Meta:
        model = FichaPedagogica
        fields = '__all__'

    def get_checklist(self, obj):
        preguntas = PreguntaChecklist.objects.filter(activa=True).order_by('orden')
        respuestas = {
            r.pregunta_id: r
            for r in obj.respuestas_checklist.select_related('pregunta').all()
        }
        items = []
        for p in preguntas:
            r = respuestas.get(p.id)
            items.append({
                'pregunta_id': p.id,
                'orden': p.orden,
                'texto': p.texto,
                'ayuda': p.ayuda,
                'modulo_id': p.modulo_id,
                'modulo_nombre': p.modulo.nombre if p.modulo else None,
                'completada': r.completada if r else False,
                'nota': r.nota if r else '',
                'respuesta_id': r.id if r else None,
            })
        return items


class FichaPedagogicaUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FichaPedagogica
        fields = (
            'modulo_actual', 'progreso_general', 'sacramentos_recibidos',
            'compromisos_espirituales', 'notas_formador', 'fecha_inicio_camino',
        )


class ResponderChecklistSerializer(serializers.Serializer):
    pregunta_id = serializers.IntegerField()
    completada = serializers.BooleanField()
    nota = serializers.CharField(required=False, allow_blank=True)
