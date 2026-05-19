from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from communications.models import Anuncio
from content.models import CategoriaContenido, Contenido
from groups.models import GrupoPastoreo
from pedagogia.models import EtapaEspiritual
from payments.models import PlanSuscripcion

User = get_user_model()


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
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('Usuario admin creado (admin / admin123)'))

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
            member.set_password('miembro123')
            member.save()
            self.stdout.write(self.style.SUCCESS('Usuario miembro creado (miembro / miembro123)'))

        etapas = [
            ('Búsqueda', 'Inicio del camino de fe', 1, '#8B7355'),
            ('Discipulado', 'Formación en la fe', 2, '#6B7B6E'),
            ('Consagración', 'Entrega total a Dios', 3, '#6B3A3A'),
            ('Misión', 'Servicio y testimonio', 4, '#B8860B'),
        ]
        for nombre, desc, orden, color in etapas:
            EtapaEspiritual.objects.get_or_create(
                nombre=nombre,
                defaults={'descripcion': desc, 'orden': orden, 'color': color},
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
                'contenido': 'Les damos la bienvenida a la plataforma de Pedagogía Espiritual de la Santísima Trinidad. Que este camino los acerque más a Dios.',
                'autor': admin,
                'es_global': True,
                'importante': True,
            },
        )

        if hasattr(member, 'ficha_pedagogica'):
            ficha = member.ficha_pedagogica
            ficha.progreso_general = 35
            ficha.etapa_actual = EtapaEspiritual.objects.filter(orden=2).first()
            ficha.save()

        self.stdout.write(self.style.SUCCESS('Datos de demostración cargados correctamente.'))
