from rest_framework import serializers

from accounts.serializers import UserSerializer
from .models import (
    AvanceEspiritual,
    FichaAreaEvaluacion,
    FichaEntradaSemanal,
    FichaPedagogica,
    FichaPerfil,
    FichaPraxisItem,
    FichaPraxisRegistro,
    Modulo,
    PreguntaChecklist,
    RespuestaChecklist,
)

# Campos de seguimiento pedagógico (label visible para el miembro)
PERFIL_NOTA_FIELDS = (
    ('nota_horario_vida', 'Horario de vida'),
    ('nota_proyecto_vida', 'Proyecto de vida'),
    ('nota_retiro_diagnostico', 'Retiro de diagnóstico'),
    ('nota_graficas_alma', 'Gráficas sobre el estado del alma'),
    ('nota_graficas_espiritu', 'Gráficas sobre estado del espíritu'),
    ('nota_terapia_semanal', 'Terapia semanal'),
    ('nota_trabajo_tema_mensual', 'Trabajo por tema mensual'),
    ('nota_apertura_gracia', 'Concientización sobre la apertura de la gracia'),
    ('nota_discernimiento_conversion', 'Discernimiento sobre proceso de conversión'),
    ('nota_discernimiento_santificacion', 'Discernimiento sobre el proceso de santificación'),
    ('nota_formacion_integral', 'Formación integral'),
    ('nota_formacion_pneumatologica', 'Formación pneumatológica'),
    ('nota_formacion_pedagogica_espiritual', 'Formación pedagógica-espiritual'),
    ('nota_formacion_teologico_mistico', 'Formación teológico místico'),
)


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


class FichaPerfilSerializer(serializers.ModelSerializer):
    seguimiento = serializers.SerializerMethodField()

    class Meta:
        model = FichaPerfil
        fields = (
            'id', 'edad', 'estado_civil', 'proceso_de_fe', 'perfil_completado',
            'updated_at', 'seguimiento',
            *(campo for campo, _ in PERFIL_NOTA_FIELDS),
        )
        read_only_fields = ('perfil_completado', 'updated_at')

    def get_seguimiento(self, obj):
        return [
            {
                'campo': campo,
                'label': label,
                'valor': getattr(obj, campo) or '',
            }
            for campo, label in PERFIL_NOTA_FIELDS
        ]


class FichaPerfilUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FichaPerfil
        fields = (
            'edad', 'estado_civil', 'proceso_de_fe',
            *(campo for campo, _ in PERFIL_NOTA_FIELDS),
        )


class FichaPedagogicaSerializer(serializers.ModelSerializer):
    usuario_detalle = UserSerializer(source='usuario', read_only=True)
    modulo_actual_detalle = ModuloSerializer(source='modulo_actual', read_only=True)
    avances = AvanceEspiritualSerializer(many=True, read_only=True)
    checklist = serializers.SerializerMethodField()
    perfil = FichaPerfilSerializer(read_only=True)
    ficha_semanal = serializers.SerializerMethodField()
    ficha_progreso = serializers.SerializerMethodField()
    sugerencia_avance = serializers.SerializerMethodField()

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
            disp = obj.disponibilidad_semana(p.semana or p.orden)
            items.append({
                'pregunta_id': p.id,
                'orden': p.orden,
                'semana': p.semana,
                'texto': p.texto,
                'ayuda': p.ayuda,
                'modulo_id': p.modulo_id,
                'modulo_nombre': p.modulo.nombre if p.modulo else None,
                'completada': (r.completada if r else False) or bool(r and r.nota and len(r.nota.strip()) >= 15),
                'nota': r.nota if r else '',
                'respuesta_id': r.id if r else None,
                **disp,
            })
        return items

    def get_ficha_semanal(self, obj):
        return build_ficha_semanal(obj)

    def get_ficha_progreso(self, obj):
        return build_ficha_progreso(obj, checklist=self.get_checklist(obj))

    def get_sugerencia_avance(self, obj):
        from .avance import payload_sugerencia_avance
        return payload_sugerencia_avance(obj)


def build_ficha_semanal(ficha):
    """Payload de la ficha cuantitativa alineado a las semanas del diario."""
    usuario = ficha.usuario
    preguntas = list(
        PreguntaChecklist.objects.filter(activa=True).order_by('orden', 'semana')
    )
    areas = list(FichaAreaEvaluacion.objects.filter(activa=True).order_by('orden', 'id'))
    praxis_items = list(FichaPraxisItem.objects.filter(activo=True).order_by('orden', 'id'))

    entradas = FichaEntradaSemanal.objects.filter(usuario=usuario).select_related('area')
    praxis_regs = FichaPraxisRegistro.objects.filter(usuario=usuario).select_related('item')

    entradas_por_semana = {}
    for e in entradas:
        entradas_por_semana.setdefault(e.semana_global, {})[e.area_id] = float(e.puntaje)

    praxis_por_semana = {}
    for r in praxis_regs:
        praxis_por_semana.setdefault(r.semana_global, {})[r.item_id] = r.cumplido

    semanas_nums = []
    seen = set()
    for p in preguntas:
        s = p.semana or p.orden
        if s not in seen:
            seen.add(s)
            semanas_nums.append(s)

    semanas = []
    for s in semanas_nums:
        disp = ficha.disponibilidad_semana(s)
        entradas_s = entradas_por_semana.get(s, {})
        praxis_s = praxis_por_semana.get(s, {})
        guardada = bool(entradas_s) or bool(praxis_s)
        semanas.append({
            'semana': s,
            'guardada': guardada,
            'praxis': [
                {
                    'item_id': item.id,
                    'nombre': item.nombre,
                    'orden': item.orden,
                    'cumplido': bool(praxis_s.get(item.id, False)),
                }
                for item in praxis_items
            ],
            'entradas': [
                {
                    'area_id': area.id,
                    'nombre': area.nombre,
                    'grupo_grafica': area.grupo_grafica,
                    'escala_min': area.escala_min,
                    'escala_max': area.escala_max,
                    'orden': area.orden,
                    'puntaje': entradas_s.get(area.id),
                }
                for area in areas
            ],
            **disp,
        })

    semanas_completadas = sum(1 for s in semanas if s['guardada'])
    disponibles = [s['semana'] for s in semanas if s['disponible']]
    semana_actual = max(disponibles) if disponibles else None

    areas_payload = [
        {
            'id': a.id,
            'nombre': a.nombre,
            'grupo_grafica': a.grupo_grafica,
            'escala_min': a.escala_min,
            'escala_max': a.escala_max,
            'orden': a.orden,
        }
        for a in areas
    ]
    praxis_payload = [
        {'id': p.id, 'nombre': p.nombre, 'orden': p.orden}
        for p in praxis_items
    ]

    return {
        'semanas': semanas,
        'semanas_completadas': semanas_completadas,
        'total_semanas': len(semanas),
        'semana_actual': semana_actual,
        'semanas_disponibles': len(disponibles),
        'areas': areas_payload,
        'praxis_items': praxis_payload,
    }


def build_ficha_progreso(ficha, checklist=None):
    """Estadísticas privadas: racha, gráficas por grupo y consistencia de praxis."""
    if checklist is None:
        # Evitar dependencia circular; el serializer suele pasar checklist ya calculado.
        ser = FichaPedagogicaSerializer()
        checklist = ser.get_checklist(ficha)

    semanal = build_ficha_semanal(ficha)
    semanas = semanal['semanas']
    semana_actual = semanal['semana_actual']

    diario_ok = {}
    for item in checklist:
        s = item.get('semana') or item.get('orden')
        prev = diario_ok.get(s, True)
        diario_ok[s] = prev and bool(item.get('completada'))

    # Estado por semana (orden ascendente)
    estados = []
    for s in semanas:
        num = s['semana']
        ambos = bool(diario_ok.get(num)) and bool(s.get('guardada'))
        estados.append({
            'semana': num,
            'disponible': s['disponible'],
            'diario': bool(diario_ok.get(num)),
            'ficha': bool(s.get('guardada')),
            'ambos': ambos,
        })

    # Mejor racha histórica (sobre todas las semanas del camino)
    mejor = 0
    run = 0
    for e in estados:
        if e['ambos']:
            run += 1
            mejor = max(mejor, run)
        else:
            run = 0

    # Racha actual: hacia atrás desde semana_actual
    racha = 0
    if semana_actual is not None:
        por_num = {e['semana']: e for e in estados}
        semana = semana_actual
        while semana in por_num:
            e = por_num[semana]
            if not e['disponible']:
                break
            if e['ambos']:
                racha += 1
                semana -= 1
            else:
                break

    # Gráficas por grupo
    areas = list(FichaAreaEvaluacion.objects.filter(activa=True).order_by('orden', 'id'))
    grupos_map = {}
    for a in areas:
        grupos_map.setdefault(a.grupo_grafica, []).append(a)

    graficas = []
    for grupo_nombre, areas_g in grupos_map.items():
        escala_min = min(a.escala_min for a in areas_g)
        escala_max = max(a.escala_max for a in areas_g)
        area_ids = {a.id for a in areas_g}
        area_nombres = {a.id: a.nombre for a in areas_g}

        # puntos por semana
        series = []
        semanas_con_dato = 0
        for s in semanas:
            row = {'semana': s['semana']}
            tiene = False
            for entrada in s['entradas']:
                if entrada['area_id'] not in area_ids:
                    continue
                val = entrada.get('puntaje')
                row[area_nombres[entrada['area_id']]] = val
                if val is not None:
                    tiene = True
            if tiene:
                semanas_con_dato += 1
                series.append(row)

        graficas.append({
            'grupo': grupo_nombre,
            'escala_min': escala_min,
            'escala_max': escala_max,
            'areas': [
                {'id': a.id, 'nombre': a.nombre, 'orden': a.orden}
                for a in areas_g
            ],
            'series': series,
            'listo': semanas_con_dato >= 2,
            'semanas_con_dato': semanas_con_dato,
        })

    # Praxis consistency (orden admin)
    disponibles = [s for s in semanas if s['disponible']]
    n_disp = len(disponibles) or 0
    praxis_stats = []
    for item in FichaPraxisItem.objects.filter(activo=True).order_by('orden', 'id'):
        marcadas = 0
        for s in disponibles:
            for p in s['praxis']:
                if p['item_id'] == item.id and p['cumplido']:
                    marcadas += 1
                    break
        pct = int(round((marcadas / n_disp) * 100)) if n_disp else 0
        praxis_stats.append({
            'item_id': item.id,
            'nombre': item.nombre,
            'orden': item.orden,
            'semanas_marcadas': marcadas,
            'semanas_disponibles': n_disp,
            'porcentaje': pct,
        })

    etapa = None
    if ficha.modulo_actual_id:
        etapa = {
            'id': ficha.modulo_actual_id,
            'nombre': ficha.modulo_actual.nombre if ficha.modulo_actual else '',
            'color': getattr(ficha.modulo_actual, 'color', None),
        }

    return {
        'racha_actual': racha,
        'mejor_racha': mejor,
        'etapa_actual': etapa,
        'semanas_ficha_completadas': semanal['semanas_completadas'],
        'semanas_disponibles': semanal['semanas_disponibles'],
        'total_semanas': semanal['total_semanas'],
        'graficas': graficas,
        'praxis': praxis_stats,
    }


class FichaPedagogicaUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FichaPedagogica
        fields = (
            'modulo_actual', 'progreso_general', 'sacramentos_recibidos',
            'compromisos_espirituales', 'notas_formador', 'fecha_inicio_camino',
        )


class ResponderChecklistSerializer(serializers.Serializer):
    pregunta_id = serializers.IntegerField()
    nota = serializers.CharField(required=True, allow_blank=False)
    completada = serializers.BooleanField(required=False, default=True)


class PraxisItemInputSerializer(serializers.Serializer):
    item_id = serializers.IntegerField()
    cumplido = serializers.BooleanField(default=False)


class EntradaAreaInputSerializer(serializers.Serializer):
    area_id = serializers.IntegerField()
    puntaje = serializers.DecimalField(max_digits=5, decimal_places=2, allow_null=True, required=False)


class GuardarSemanaFichaSerializer(serializers.Serializer):
    semana_global = serializers.IntegerField(min_value=1)
    praxis = PraxisItemInputSerializer(many=True, required=False, default=list)
    entradas = EntradaAreaInputSerializer(many=True, required=False, default=list)


class FichaAreaEvaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FichaAreaEvaluacion
        fields = '__all__'

    def validate(self, attrs):
        escala_min = attrs.get(
            'escala_min',
            getattr(self.instance, 'escala_min', 0) if self.instance else 0,
        )
        escala_max = attrs.get(
            'escala_max',
            getattr(self.instance, 'escala_max', 10) if self.instance else 10,
        )
        if escala_max < escala_min:
            raise serializers.ValidationError({
                'escala_max': 'El máximo debe ser mayor o igual al mínimo.',
            })
        return attrs


class FichaPraxisItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FichaPraxisItem
        fields = '__all__'


class FichaEntradaSemanalSerializer(serializers.ModelSerializer):
    area_nombre = serializers.CharField(source='area.nombre', read_only=True)
    grupo_grafica = serializers.CharField(source='area.grupo_grafica', read_only=True)

    class Meta:
        model = FichaEntradaSemanal
        fields = '__all__'
        read_only_fields = ('fecha_registro',)

    def validate(self, attrs):
        area = attrs.get('area') or getattr(self.instance, 'area', None)
        puntaje = attrs.get('puntaje', getattr(self.instance, 'puntaje', None))
        if area is not None and puntaje is not None:
            if puntaje < area.escala_min or puntaje > area.escala_max:
                raise serializers.ValidationError({
                    'puntaje': (
                        f'El puntaje debe estar entre {area.escala_min} y {area.escala_max}.'
                    ),
                })
        return attrs


class FichaPraxisRegistroSerializer(serializers.ModelSerializer):
    item_nombre = serializers.CharField(source='item.nombre', read_only=True)

    class Meta:
        model = FichaPraxisRegistro
        fields = '__all__'
        read_only_fields = ('fecha_registro',)
