import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0004_tutorialvideo'),
        ('pedagogia', '0010_etapa_modulo_manual_hierarchy'),
    ]

    operations = [
        migrations.RenameField(
            model_name='contenido',
            old_name='modulo',
            new_name='etapa',
        ),
        migrations.AlterField(
            model_name='contenido',
            name='etapa',
            field=models.ForeignKey(
                blank=True,
                help_text='Etapa pedagógica a la que pertenece este contenido (opcional)',
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='contenidos',
                to='pedagogia.etapa',
            ),
        ),
    ]
