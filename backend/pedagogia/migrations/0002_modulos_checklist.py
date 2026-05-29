import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pedagogia', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='EtapaEspiritual',
            new_name='Modulo',
        ),
        migrations.AlterModelOptions(
            name='modulo',
            options={
                'ordering': ['orden'],
                'verbose_name': 'Módulo',
                'verbose_name_plural': 'Módulos',
            },
        ),
        migrations.AddField(
            model_name='modulo',
            name='activo',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='modulo',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='modulo',
            name='manual_archivo',
            field=models.FileField(blank=True, null=True, upload_to='manuales/'),
        ),
        migrations.AddField(
            model_name='modulo',
            name='manual_url',
            field=models.URLField(blank=True, help_text='Enlace al manual en PDF o recurso externo'),
        ),
        migrations.AlterField(
            model_name='modulo',
            name='color',
            field=models.CharField(default='#6B8CAE', max_length=7),
        ),
        migrations.AlterField(
            model_name='modulo',
            name='nombre',
            field=models.CharField(max_length=150),
        ),
        migrations.RenameField(
            model_name='fichapedagogica',
            old_name='etapa_actual',
            new_name='modulo_actual',
        ),
        migrations.CreateModel(
            name='PreguntaChecklist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('texto', models.CharField(max_length=500)),
                ('orden', models.PositiveIntegerField(default=1)),
                ('activa', models.BooleanField(default=True)),
                ('ayuda', models.TextField(blank=True, help_text='Texto orientador para responder')),
                ('modulo', models.ForeignKey(
                    blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL,
                    related_name='preguntas', to='pedagogia.modulo',
                    help_text='Módulo al que pertenece esta pregunta (opcional)',
                )),
            ],
            options={
                'verbose_name': 'Pregunta del checklist',
                'verbose_name_plural': 'Preguntas del checklist',
                'ordering': ['orden'],
            },
        ),
        migrations.CreateModel(
            name='RespuestaChecklist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('completada', models.BooleanField(default=False)),
                ('nota', models.TextField(blank=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('ficha', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='respuestas_checklist', to='pedagogia.fichapedagogica',
                )),
                ('pregunta', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='respuestas', to='pedagogia.preguntachecklist',
                )),
            ],
            options={
                'verbose_name': 'Respuesta checklist',
                'verbose_name_plural': 'Respuestas checklist',
                'unique_together': {('ficha', 'pregunta')},
            },
        ),
    ]
