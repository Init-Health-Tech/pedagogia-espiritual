# Generated manually for must_change_password

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_alter_user_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='must_change_password',
            field=models.BooleanField(
                default=False,
                help_text='Si es verdadero, el usuario debe cambiar su contraseña al iniciar sesión.',
            ),
        ),
    ]
