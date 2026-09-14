from django.db import migrations, models


PRAXIS_ICONOS = {
    'Santa Eucaristía': 'Wine',
    'Visitas al Santísimo': 'Church',
    'Sacramento de la Reconciliación': 'Handshake',
    'Rezo del Santo Rosario': 'Gem',
    'Oficio de Lectura': 'BookOpen',
    'Laúdes': 'Sunrise',
    'Hora intermedia': 'Sun',
    'Vísperas': 'Sunset',
    'Completas': 'Moon',
    'Oración personal': 'HandHeart',
    'Meditación': 'Brain',
    'Adoración / Hora Santa': 'Sparkles',
}

AREAS_ICONOS = {
    'Alma': 'Heart',
    'Cuerpo': 'PersonStanding',
    'Espíritu': 'Wind',
    'Corazón / voluntad': 'Flame',
    'Estado anímico': 'Smile',
    'Relaciones interpersonales': 'Users',
    'Teológica': 'GraduationCap',
    'Filosófica': 'Lightbulb',
    'Bíblica': 'BookMarked',
    'Doctrinal': 'ScrollText',
    'Pedagogía': 'School',
    'Acompañamiento humano': 'HeartHandshake',
}


def seed_iconos(apps, schema_editor):
    FichaPraxisItem = apps.get_model('pedagogia', 'FichaPraxisItem')
    FichaAreaEvaluacion = apps.get_model('pedagogia', 'FichaAreaEvaluacion')
    for item in FichaPraxisItem.objects.all():
        icono = PRAXIS_ICONOS.get(item.nombre, 'Circle')
        if item.icono != icono:
            item.icono = icono
            item.save(update_fields=['icono'])
    for area in FichaAreaEvaluacion.objects.all():
        icono = AREAS_ICONOS.get(area.nombre, 'Circle')
        if area.icono != icono:
            area.icono = icono
            area.save(update_fields=['icono'])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('pedagogia', '0010_etapa_modulo_manual_hierarchy'),
    ]

    operations = [
        migrations.AddField(
            model_name='fichaareaevaluacion',
            name='icono',
            field=models.CharField(
                blank=True,
                default='Circle',
                help_text='Nombre del ícono lucide-react (ej. Heart, BookOpen).',
                max_length=60,
            ),
        ),
        migrations.AddField(
            model_name='fichapraxisitem',
            name='icono',
            field=models.CharField(
                blank=True,
                default='Circle',
                help_text='Nombre del ícono lucide-react (ej. Wine, BookOpen).',
                max_length=60,
            ),
        ),
        migrations.RunPython(seed_iconos, noop_reverse),
    ]
