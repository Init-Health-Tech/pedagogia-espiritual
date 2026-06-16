from datetime import date

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from communications.models import Anuncio
from content.models import CategoriaContenido, Contenido
from groups.models import GrupoPastoreo
from pedagogia.models import Modulo, PreguntaChecklist
from pedagogia.manual_demo import MANUAL_BUSQUEDA, PREGUNTAS_DIARIO
from payments.models import PlanSuscripcion

User = get_user_model()

PREGUNTAS_DEFAULT = []  # legacy; usamos PREGUNTAS_DIARIO


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

        coordinator, created = User.objects.get_or_create(
            username='coordinador',
            defaults={
                'email': 'coord@mfst.org',
                'first_name': 'María',
                'last_name': 'López',
                'role': User.Role.COORDINATOR,
            },
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Usuario coordinador creado (coordinador / coordinador123)'))
        coordinator.set_password('coordinador123')
        coordinator.role = User.Role.COORDINATOR
        coordinator.save()

        modulos_data = [
            ('Etapa I — Búsqueda', 'Apertura al encuentro con Dios en lo cotidiano', 1, '#5B7C99'),
            ('Etapa II — Discipulado', 'Formación en la fe y la vida cristiana', 2, '#7B8FA8'),
            ('Etapa III — Consagración', 'Entrega y compromiso con el Señor', 3, '#9BA8C4'),
            ('Etapa IV — Misión', 'Servicio, testimonio y envío', 4, '#B8956B'),
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

        etapa1 = modulos.get(1)
        if etapa1:
            etapa1.contenido_manual = MANUAL_BUSQUEDA
            etapa1.save(update_fields=['contenido_manual'])

        mapa_corto = {
            'Búsqueda': modulos.get(1),
            'Discipulado': modulos.get(2),
            'Consagración': modulos.get(3),
            'Misión': modulos.get(4),
        }

        for i, (semana, texto, modulo_key, ayuda) in enumerate(PREGUNTAS_DIARIO, start=1):
            PreguntaChecklist.objects.update_or_create(
                orden=i,
                defaults={
                    'texto': texto,
                    'semana': semana,
                    'modulo': mapa_corto.get(modulo_key),
                    'activa': True,
                    'ayuda': ayuda,
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
                'coordinador': coordinator,
                'horario_reunion': 'Sábados 10:00 AM',
            },
        )
        grupo.coordinador = coordinator
        grupo.save(update_fields=['coordinador'])
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
