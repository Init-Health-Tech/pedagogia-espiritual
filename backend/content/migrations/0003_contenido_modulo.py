import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0002_contenidovista'),
        ('pedagogia', '0004_alter_modulo_manual_url_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='contenido',
            name='modulo',
            field=models.ForeignKey(
                blank=True,
                help_text='Etapa / módulo pedagógico al que pertenece este contenido (opcional)',
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='contenidos',
                to='pedagogia.modulo',
            ),
        ),
    ]
