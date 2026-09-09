from django.db import migrations


TAREAS_INICIALES = [
    (1, 'Ver video de bienvenida al movimiento', 'Conoce el corazón y la misión del movimiento.'),
    (2, 'Completar tu perfil', 'Revisa y completa tus datos personales en tu perfil.'),
    (3, 'Conocer a tu grupo de pastoreo', 'Identifica tu grupo y a tus compañeros de camino.'),
    (4, 'Asistir a tu primera reunión de grupo', 'Participa en tu primer encuentro de pastoreo.'),
    (5, 'Leer el manual introductorio de Pedagogía Espiritual', 'Lee el material introductorio del camino formativo.'),
]


def seed_and_migrate_users(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    TareaBienvenida = apps.get_model('pedagogia', 'TareaBienvenida')

    # Miembros y cuentas ya existentes pasan a camino formal (no reabrir bienvenida).
    User.objects.all().update(estado_camino='formal')

    if TareaBienvenida.objects.exists():
        return
    for orden, nombre, descripcion in TAREAS_INICIALES:
        TareaBienvenida.objects.create(
            nombre=nombre,
            descripcion=descripcion,
            orden=orden,
            activa=True,
        )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('pedagogia', '0008_tareabienvenida_tareabienvenidaregistro'),
        ('accounts', '0004_user_bienvenida_inicio_pospuesto_user_estado_camino'),
    ]

    operations = [
        migrations.RunPython(seed_and_migrate_users, noop_reverse),
    ]
