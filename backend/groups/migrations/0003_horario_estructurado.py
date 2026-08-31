# Generated manually for structured group schedule

from django.db import migrations, models


def migrar_horarios(apps, schema_editor):
    from groups.models import parse_horario_libre

    GrupoPastoreo = apps.get_model('groups', 'GrupoPastoreo')
    for grupo in GrupoPastoreo.objects.all():
        texto = (grupo.horario_reunion or '').strip()
        if not texto:
            continue
        dia, hora = parse_horario_libre(texto)
        if dia and hora:
            grupo.dia_reunion = dia
            grupo.hora_reunion = hora
            grupo.horario_reunion = ''
            grupo.save(update_fields=['dia_reunion', 'hora_reunion', 'horario_reunion'])


def revertir_horarios(apps, schema_editor):
    GrupoPastoreo = apps.get_model('groups', 'GrupoPastoreo')
    labels = {
        'lunes': 'Lunes',
        'martes': 'Martes',
        'miercoles': 'Miércoles',
        'jueves': 'Jueves',
        'viernes': 'Viernes',
        'sabado': 'Sábado',
        'domingo': 'Domingo',
    }
    for grupo in GrupoPastoreo.objects.all():
        if not grupo.dia_reunion and not grupo.hora_reunion:
            continue
        partes = []
        if grupo.dia_reunion:
            partes.append(labels.get(grupo.dia_reunion, grupo.dia_reunion.capitalize()) + 's')
        if grupo.hora_reunion:
            h = grupo.hora_reunion
            hour12 = h.hour % 12 or 12
            sufijo = 'AM' if h.hour < 12 else 'PM'
            partes.append(f'{hour12}:{h.minute:02d} {sufijo}')
        grupo.horario_reunion = ' '.join(partes)
        grupo.dia_reunion = ''
        grupo.hora_reunion = None
        grupo.save(update_fields=['horario_reunion', 'dia_reunion', 'hora_reunion'])


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0002_coordinadores_m2m'),
    ]

    operations = [
        migrations.AddField(
            model_name='grupopastoreo',
            name='dia_reunion',
            field=models.CharField(
                blank=True,
                choices=[
                    ('lunes', 'Lunes'),
                    ('martes', 'Martes'),
                    ('miercoles', 'Miércoles'),
                    ('jueves', 'Jueves'),
                    ('viernes', 'Viernes'),
                    ('sabado', 'Sábado'),
                    ('domingo', 'Domingo'),
                ],
                default='',
                max_length=12,
            ),
        ),
        migrations.AddField(
            model_name='grupopastoreo',
            name='hora_reunion',
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='grupopastoreo',
            name='horario_reunion',
            field=models.CharField(
                blank=True,
                help_text='Texto libre legado. Usar solo si no hay día/hora estructurados.',
                max_length=200,
            ),
        ),
        migrations.RunPython(migrar_horarios, revertir_horarios),
    ]
