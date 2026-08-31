from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def seed_catalogos_y_perfiles(apps, schema_editor):
    FichaAreaEvaluacion = apps.get_model('pedagogia', 'FichaAreaEvaluacion')
    FichaPraxisItem = apps.get_model('pedagogia', 'FichaPraxisItem')
    FichaPedagogica = apps.get_model('pedagogia', 'FichaPedagogica')
    FichaPerfil = apps.get_model('pedagogia', 'FichaPerfil')

    areas = [
        ('Alma', 'Antropología Triádica Relacional', 0, 10, 1),
        ('Cuerpo', 'Antropología Triádica Relacional', 0, 10, 2),
        ('Espíritu', 'Antropología Triádica Relacional', 0, 10, 3),
        ('Corazón / voluntad', 'Antropología Triádica Relacional', 0, 10, 4),
        ('Estado anímico', 'Nivel Psicológico', 0, 10, 10),
        ('Relaciones interpersonales', 'Nivel Psicológico', 0, 10, 11),
        ('Teológica', 'Formación Epistemológica Integral', 0, 12, 20),
        ('Filosófica', 'Formación Epistemológica Integral', 0, 12, 21),
        ('Bíblica', 'Formación Epistemológica Integral', 0, 12, 22),
        ('Doctrinal', 'Formación Epistemológica Integral', 0, 12, 23),
        ('Pedagogía', 'Formación Profesional en Ciencias Humanas', 0, 10, 30),
        ('Acompañamiento humano', 'Formación Profesional en Ciencias Humanas', 0, 10, 31),
    ]
    if not FichaAreaEvaluacion.objects.exists():
        FichaAreaEvaluacion.objects.bulk_create([
            FichaAreaEvaluacion(
                nombre=nombre,
                grupo_grafica=grupo,
                escala_min=emin,
                escala_max=emax,
                orden=orden,
                activa=True,
            )
            for nombre, grupo, emin, emax, orden in areas
        ])

    praxis = [
        'Santa Eucaristía',
        'Visitas al Santísimo',
        'Sacramento de la Reconciliación',
        'Rezo del Santo Rosario',
        'Oficio de Lectura',
        'Laúdes',
        'Hora intermedia',
        'Vísperas',
        'Completas',
        'Oración personal',
        'Meditación',
        'Adoración / Hora Santa',
    ]
    if not FichaPraxisItem.objects.exists():
        FichaPraxisItem.objects.bulk_create([
            FichaPraxisItem(nombre=nombre, orden=i, activo=True)
            for i, nombre in enumerate(praxis, start=1)
        ])

    existentes = set(FichaPerfil.objects.values_list('ficha_id', flat=True))
    faltantes = [
        FichaPerfil(ficha_id=fid)
        for fid in FichaPedagogica.objects.values_list('id', flat=True)
        if fid not in existentes
    ]
    if faltantes:
        FichaPerfil.objects.bulk_create(faltantes)


def unseed_catalogos(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('pedagogia', '0004_alter_modulo_manual_url_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='FichaAreaEvaluacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=120)),
                ('grupo_grafica', models.CharField(help_text='Agrupa áreas para graficar juntas (ej. Antropología Triádica Relacional)', max_length=150)),
                ('escala_min', models.PositiveSmallIntegerField(default=0)),
                ('escala_max', models.PositiveSmallIntegerField(default=10)),
                ('orden', models.PositiveIntegerField(default=0)),
                ('activa', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'Área de evaluación',
                'verbose_name_plural': 'Áreas de evaluación',
                'ordering': ['orden', 'id'],
            },
        ),
        migrations.CreateModel(
            name='FichaPraxisItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=200)),
                ('orden', models.PositiveIntegerField(default=0)),
                ('activo', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'Ítem de praxis',
                'verbose_name_plural': 'Ítems de praxis',
                'ordering': ['orden', 'id'],
            },
        ),
        migrations.CreateModel(
            name='FichaPerfil',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('edad', models.PositiveSmallIntegerField(blank=True, null=True)),
                ('estado_civil', models.CharField(blank=True, max_length=80)),
                ('proceso_de_fe', models.TextField(blank=True)),
                ('nota_horario_vida', models.TextField(blank=True, help_text='Horario de vida')),
                ('nota_proyecto_vida', models.TextField(blank=True, help_text='Proyecto de vida')),
                ('nota_retiro_diagnostico', models.TextField(blank=True, help_text='Retiro de diagnóstico')),
                ('nota_graficas_alma', models.TextField(blank=True, help_text='Gráficas sobre el estado del alma')),
                ('nota_graficas_espiritu', models.TextField(blank=True, help_text='Gráficas sobre estado del espíritu')),
                ('nota_terapia_semanal', models.TextField(blank=True, help_text='Terapia semanal')),
                ('nota_trabajo_tema_mensual', models.TextField(blank=True, help_text='Trabajo por tema mensual')),
                ('nota_apertura_gracia', models.TextField(blank=True, help_text='Concientización sobre la apertura de la gracia')),
                ('nota_discernimiento_conversion', models.TextField(blank=True, help_text='Discernimiento sobre proceso de conversión')),
                ('nota_discernimiento_santificacion', models.TextField(blank=True, help_text='Discernimiento sobre el proceso de santificación')),
                ('nota_formacion_integral', models.TextField(blank=True, help_text='Formación integral')),
                ('nota_formacion_pneumatologica', models.TextField(blank=True, help_text='Formación pneumatológica')),
                ('nota_formacion_pedagogica_espiritual', models.TextField(blank=True, help_text='Formación pedagógica-espiritual')),
                ('nota_formacion_teologico_mistico', models.TextField(blank=True, help_text='Formación teológico místico')),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('ficha', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='perfil', to='pedagogia.fichapedagogica')),
            ],
            options={
                'verbose_name': 'Perfil de ficha',
                'verbose_name_plural': 'Perfiles de ficha',
            },
        ),
        migrations.CreateModel(
            name='FichaEntradaSemanal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('semana_global', models.PositiveIntegerField(help_text='Número de semana acumulativo del camino formativo')),
                ('puntaje', models.DecimalField(decimal_places=2, max_digits=5)),
                ('fecha_registro', models.DateTimeField(auto_now_add=True)),
                ('area', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='entradas', to='pedagogia.fichaareaevaluacion')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ficha_entradas_semanales', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Entrada semanal de ficha',
                'verbose_name_plural': 'Entradas semanales de ficha',
                'ordering': ['-semana_global', 'area__orden'],
                'unique_together': {('usuario', 'semana_global', 'area')},
            },
        ),
        migrations.CreateModel(
            name='FichaPraxisRegistro',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('semana_global', models.PositiveIntegerField(help_text='Número de semana acumulativo del camino formativo')),
                ('cumplido', models.BooleanField(default=False)),
                ('fecha_registro', models.DateTimeField(auto_now_add=True)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='registros', to='pedagogia.fichapraxisitem')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ficha_praxis_registros', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Registro de praxis',
                'verbose_name_plural': 'Registros de praxis',
                'ordering': ['-semana_global', 'item__orden'],
                'unique_together': {('usuario', 'semana_global', 'item')},
            },
        ),
        migrations.RunPython(seed_catalogos_y_perfiles, unseed_catalogos),
    ]
