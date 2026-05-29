from datetime import date

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from communications.models import Anuncio
from content.models import CategoriaContenido, Contenido
from groups.models import GrupoPastoreo
from pedagogia.models import Modulo, PreguntaChecklist
from payments.models import PlanSuscripcion

User = get_user_model()

PREGUNTAS_DEFAULT = [
    ('¿He establecido un tiempo diario de oración personal?', 'Búsqueda'),
    ('¿Conozco y practico el examen de conciencia?', 'Búsqueda'),
    ('¿Participo activamente en la Eucaristía dominical?', 'Discipulado'),
    ('¿Lee o medita la Palabra de Dios con regularidad?', 'Discipulado'),
    ('¿Tengo un acompañante espiritual o director?', 'Discipulado'),
    ('¿Practico la caridad con los más necesitados?', 'Consagración'),
    ('¿Vivo en simplicidad y agradecimiento (espíritu franciscano)?', 'Consagración'),
    ('¿He renovado mis promesas o compromisos de fe este año?', 'Consagración'),
    ('¿Comparto mi fe con otros de forma natural?', 'Misión'),
    ('¿Sirvo en algún ministerio o grupo del movimiento?', 'Misión'),
]


class Command(BaseCommand):
    help = 'Carga datos iniciales de demostración para MFST'

    def handle(self, *args, **options):
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@mfst.org',
                'first_name': 'Administrador',
                'last_name': 'MFST',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True,
            },
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Usuario admin creado (admin / admin123)'))
        admin.set_password('admin123')
        admin.is_staff = True
        admin.is_superuser = True
        admin.role = User.Role.ADMIN
        admin.save()

        member, created = User.objects.get_or_create(
            username='miembro',
            defaults={
                'email': 'miembro@mfst.org',
                'first_name': 'Juan',
                'last_name': 'Pérez',
                'role': User.Role.MEMBER,
                'date_joined_movement': date(2024, 1, 15),
            },
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Usuario miembro creado (miembro / miembro123)'))
        member.set_password('miembro123')
        member.save()

        modulos_data = [
            ('Módulo I — Búsqueda', 'Manual de inicio del camino de fe', 1, '#5B7C99'),
            ('Módulo II — Discipulado', 'Manual de formación en la fe', 2, '#7B8FA8'),
            ('Módulo III — Consagración', 'Manual de entrega y consagración', 3, '#9BA8C4'),
            ('Módulo IV — Misión', 'Manual de servicio y testimonio', 4, '#B8956B'),
        ]
        modulos = {}
        for nombre, desc, orden, color in modulos_data:
            m, _ = Modulo.objects.update_or_create(
                orden=orden,
                defaults={'nombre': nombre, 'descripcion': desc, 'color': color, 'activo': True},
            )
            modulos[nombre.split('—')[1].strip().split()[0] if '—' in nombre else nombre] = m
            # simpler map by orden
            modulos[orden] = m

        modulos_por_nombre = {m.nombre: m for m in Modulo.objects.all()}
        mapa_corto = {
            'Búsqueda': modulos.get(1),
            'Discipulado': modulos.get(2),
            'Consagración': modulos.get(3),
            'Misión': modulos.get(4),
        }

        for i, (texto, modulo_key) in enumerate(PREGUNTAS_DEFAULT, start=1):
            PreguntaChecklist.objects.update_or_create(
                orden=i,
                defaults={
                    'texto': texto,
                    'modulo': mapa_corto.get(modulo_key),
                    'activa': True,
                    'ayuda': 'Reflexiona con honestidad antes de marcar como completada.',
                },
            )

        categorias = [
            ('Formación Espiritual', 'Cursos y materiales de formación', 'book', 1),
            ('Liturgia', 'Celebraciones y oración', 'church', 2),
            ('Franciscano', 'Espiritualidad franciscana', 'leaf', 3),
        ]
        for nombre, desc, icono, orden in categorias:
            CategoriaContenido.objects.get_or_create(
                nombre=nombre,
                defaults={'descripcion': desc, 'icono': icono, 'orden': orden},
            )

        cat = CategoriaContenido.objects.first()
        contenidos_demo = [
            ('Introducción a la Pedagogía Espiritual', Contenido.Tipo.VIDEO, True),
            ('La Santísima Trinidad en nuestra vida', Contenido.Tipo.PRESENTACION, True),
            ('Esquema: Camino de conversión', Contenido.Tipo.ESQUEMA, False),
            ('Documento: Regla de vida franciscana', Contenido.Tipo.DOCUMENTO, True),
        ]
        for titulo, tipo, publico in contenidos_demo:
            Contenido.objects.get_or_create(
                titulo=titulo,
                defaults={
                    'descripcion': f'Contenido formativo: {titulo}',
                    'tipo': tipo,
                    'categoria': cat,
                    'es_publico': publico,
                    'requiere_suscripcion': not publico,
                    'creado_por': admin,
                    'url_externa': 'https://www.youtube.com/embed/dQw4w9WgXcQ' if tipo == Contenido.Tipo.VIDEO else '',
                },
            )

        grupo, _ = GrupoPastoreo.objects.get_or_create(
            nombre='Grupo San Francisco',
            defaults={
                'descripcion': 'Grupo de pastoreo para formación inicial',
                'coordinador': admin,
                'horario_reunion': 'Sábados 10:00 AM',
            },
        )
        grupo.miembros.add(member)

        PlanSuscripcion.objects.get_or_create(
            nombre='Membresía Anual',
            defaults={
                'descripcion': 'Acceso completo a contenidos y plataforma',
                'precio': 500.00,
                'duracion_meses': 12,
            },
        )

        Anuncio.objects.get_or_create(
            titulo='Bienvenidos al Movimiento Franciscano',
            defaults={
                'contenido': 'Les damos la bienvenida a la plataforma de Pedagogía Espiritual de la Santísima Trinidad.',
                'autor': admin,
                'es_global': True,
                'importante': True,
            },
        )

        if hasattr(member, 'ficha_pedagogica'):
            ficha = member.ficha_pedagogica
            ficha.modulo_actual = modulos.get(2)
            ficha.recalcular_progreso()

        self.stdout.write(self.style.SUCCESS('Datos de demostración cargados correctamente.'))
