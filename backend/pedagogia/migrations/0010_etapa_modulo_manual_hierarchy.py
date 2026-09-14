import django.db.models.deletion
from django.db import migrations, models


def migrar_manual_url(apps, schema_editor):
    Etapa = apps.get_model('pedagogia', 'Etapa')
    Modulo = apps.get_model('pedagogia', 'Modulo')
    Manual = apps.get_model('pedagogia', 'Manual')

    for etapa in Etapa.objects.all():
        url = (getattr(etapa, 'manual_url', None) or '').strip()
        if not url:
            continue
        modulo = Modulo.objects.create(
            nombre='Materiales de la etapa',
            descripcion='Manual migrado desde el enlace histórico de la etapa.',
            orden=1,
            etapa=etapa,
            activo=True,
        )
        Manual.objects.create(
            titulo=etapa.nombre,
            enlace=url,
            orden=1,
            modulo=modulo,
            activo=True,
        )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('pedagogia', '0009_seed_tareas_bienvenida'),
        ('content', '0004_tutorialvideo'),
    ]

    operations = [
        migrations.RenameModel(old_name='Modulo', new_name='Etapa'),
        migrations.AlterModelOptions(
            name='etapa',
            options={'ordering': ['orden'], 'verbose_name': 'Etapa', 'verbose_name_plural': 'Etapas'},
        ),
        migrations.RenameField(
            model_name='preguntachecklist',
            old_name='modulo',
            new_name='etapa',
        ),
        migrations.AlterField(
            model_name='preguntachecklist',
            name='etapa',
            field=models.ForeignKey(
                blank=True,
                help_text='Etapa a la que pertenece esta pregunta (opcional)',
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='preguntas',
                to='pedagogia.etapa',
            ),
        ),
        migrations.RenameField(
            model_name='fichapedagogica',
            old_name='modulo_actual',
            new_name='etapa_actual',
        ),
        migrations.RenameField(
            model_name='fichapedagogica',
            old_name='avance_pospuesto_para_modulo',
            new_name='avance_pospuesto_para_etapa',
        ),
        migrations.AlterField(
            model_name='etapa',
            name='contenido_manual',
            field=models.JSONField(
                blank=True,
                default=list,
                help_text='Secciones del manual digital interactivo (legado; se conserva temporalmente).',
            ),
        ),
        # Nuevo Modulo (hijo de Etapa) — tabla distinta a la antigua pedagogia_modulo ya renombrada.
        migrations.CreateModel(
            name='Modulo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=150)),
                ('descripcion', models.TextField(blank=True)),
                ('orden', models.PositiveIntegerField(default=1)),
                ('activo', models.BooleanField(default=True)),
                ('etapa', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='modulos',
                    to='pedagogia.etapa',
                )),
            ],
            options={
                'verbose_name': 'Módulo',
                'verbose_name_plural': 'Módulos',
                'ordering': ['etapa__orden', 'orden', 'id'],
            },
        ),
        migrations.CreateModel(
            name='Manual',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=255)),
                ('enlace', models.URLField()),
                ('orden', models.PositiveIntegerField(default=1)),
                ('activo', models.BooleanField(default=True)),
                ('modulo', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='manuales',
                    to='pedagogia.modulo',
                )),
            ],
            options={
                'verbose_name': 'Manual',
                'verbose_name_plural': 'Manuales',
                'ordering': ['modulo__orden', 'orden', 'id'],
            },
        ),
        migrations.RunPython(migrar_manual_url, noop_reverse),
        migrations.RemoveField(model_name='etapa', name='manual_url'),
        migrations.RemoveField(model_name='etapa', name='manual_archivo'),
    ]
