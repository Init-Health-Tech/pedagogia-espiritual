from django.db import migrations, models


DEFAULT_TUTORIALS = [
    {
        'seccion': 'inicio',
        'titulo': 'Inicio',
        'descripcion': 'Tu punto de partida: resumen de avance y accesos rápidos a lo más importante.',
        'orden': 1,
    },
    {
        'seccion': 'camino',
        'titulo': 'Camino',
        'descripcion': 'Aquí escribes tu diario semanal, completas tu ficha y ves tu avance por etapas.',
        'orden': 2,
    },
    {
        'seccion': 'contenidos',
        'titulo': 'Contenidos',
        'descripcion': 'Biblioteca de documentos, presentaciones y videos de formación.',
        'orden': 3,
    },
    {
        'seccion': 'grupos',
        'titulo': 'Grupos',
        'descripcion': 'Tu comunidad de pastoreo y las personas que te acompañan en el camino.',
        'orden': 4,
    },
    {
        'seccion': 'mensajes',
        'titulo': 'Mensajes',
        'descripcion': 'Anuncios del movimiento y mensajes entre miembros.',
        'orden': 5,
    },
]


def seed_tutorials(apps, schema_editor):
    TutorialVideo = apps.get_model('content', 'TutorialVideo')
    for item in DEFAULT_TUTORIALS:
        TutorialVideo.objects.update_or_create(
            seccion=item['seccion'],
            defaults={
                'titulo': item['titulo'],
                'descripcion': item['descripcion'],
                'orden': item['orden'],
                'url_video': '',
            },
        )


def unseed_tutorials(apps, schema_editor):
    TutorialVideo = apps.get_model('content', 'TutorialVideo')
    TutorialVideo.objects.filter(seccion__in=[t['seccion'] for t in DEFAULT_TUTORIALS]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0003_contenido_modulo'),
    ]

    operations = [
        migrations.CreateModel(
            name='TutorialVideo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('seccion', models.CharField(
                    choices=[
                        ('inicio', 'Inicio'),
                        ('camino', 'Camino'),
                        ('contenidos', 'Contenidos'),
                        ('grupos', 'Grupos'),
                        ('mensajes', 'Mensajes'),
                    ],
                    max_length=20,
                    unique=True,
                )),
                ('titulo', models.CharField(max_length=100)),
                ('descripcion', models.TextField(blank=True)),
                ('url_video', models.URLField(blank=True, help_text='Enlace externo del video (YouTube, Vimeo, etc.)')),
                ('orden', models.PositiveIntegerField(default=0)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Tutorial en video',
                'verbose_name_plural': 'Tutoriales en video',
                'ordering': ['orden', 'seccion'],
            },
        ),
        migrations.RunPython(seed_tutorials, unseed_tutorials),
    ]
