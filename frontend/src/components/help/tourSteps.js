/** Recorrido general de navegación (PillNav) */
export const NAV_TOUR_STEPS = [
  {
    id: 'inicio',
    titulo: 'Inicio',
    descripcion: 'Tu punto de partida: aquí ves un resumen de tu avance y accesos rápidos a lo más importante.',
  },
  {
    id: 'camino',
    titulo: 'Camino',
    descripcion: 'Aquí escribes tu diario semanal y ves tu avance por etapas.',
  },
  {
    id: 'contenidos',
    titulo: 'Contenidos',
    descripcion: 'Biblioteca de documentos, presentaciones y videos de formación para consultar a tu ritmo.',
  },
  {
    id: 'grupos',
    titulo: 'Grupos',
    descripcion: 'Tu comunidad de pastoreo y las personas que te acompañan en el camino.',
  },
  {
    id: 'mensajes',
    titulo: 'Mensajes',
    descripcion: 'Anuncios del movimiento y mensajes entre miembros.',
  },
]

/** @deprecated usar NAV_TOUR_STEPS */
export const TOUR_STEPS = NAV_TOUR_STEPS

export const INICIO_TOUR_STEPS = [
  {
    id: 'inicio-progreso',
    titulo: 'Tu progreso',
    descripcion:
      'Aquí ves cómo vas en tu camino. Si acabas de empezar, te invita a dar el primer paso; si ya avanzaste, muestra tu porcentaje y tu etapa actual.',
    radius: 16,
  },
  {
    id: 'inicio-continuar',
    titulo: 'Por dónde seguir',
    descripcion:
      'Este espacio te sugiere la siguiente acción para no perder el hilo de tu formación. Tócalo cuando quieras retomar donde lo dejaste.',
    radius: 16,
  },
  {
    id: 'inicio-atajos',
    titulo: 'Atajos del portal',
    descripcion:
      'Desde aquí entras rápido a Camino, Contenidos, Grupos y Mensajes — las mismas secciones del menú, a un toque.',
    radius: 16,
  },
]

export const CAMINO_TOUR_STEPS = [
  {
    id: 'camino-etapas',
    titulo: 'Tus etapas',
    descripcion:
      'Son las cuatro etapas del camino. “Estás aquí” marca en cuál te encuentras hoy; las anteriores ya las recorriste.',
    radius: 16,
  },
  {
    id: 'camino-recorrido',
    titulo: 'Tu recorrido',
    descripcion:
      'El porcentaje resume tu avance general. No es una carrera: es una guía para ver cuánto has caminado.',
    radius: 16,
  },
  {
    id: 'camino-pestanas',
    titulo: 'Tres espacios en uno',
    descripcion:
      'Diario: tu reflexión semanal. Ficha: praxis y cómo te percibes. Mi progreso: gráficas y resumen de tu avance.',
    radius: 12,
  },
  {
    id: 'camino-semanas',
    titulo: 'Semanas que se abren poco a poco',
    descripcion:
      'Las semanas se desbloquean de a una. Si ves “bloqueada”, aún no es momento; cuando se abre, puedes escribir y guardar.',
    radius: 16,
  },
  {
    id: 'camino-manuales',
    titulo: 'Manuales por etapa',
    descripcion:
      'Aquí están los manuales de cada etapa. Solo puedes abrir los de etapas ya desbloqueadas; el resto aparece como “Próximamente”.',
    radius: 16,
  },
]

export const CONTENIDOS_TOUR_STEPS = [
  {
    id: 'contenidos-progreso',
    titulo: 'Tu progreso en la biblioteca',
    descripcion:
      'Te muestra cuántos materiales has consultado y el porcentaje. Sirve para ver de un vistazo qué tanto has recorrido.',
    radius: 16,
  },
  {
    id: 'contenidos-categorias',
    titulo: 'Categorías',
    descripcion:
      'Toca una categoría para abrirla o cerrarla. Dentro encontrarás los materiales de ese tipo, con su estado (pendiente o ya consultado).',
    radius: 16,
  },
  {
    id: 'contenidos-abrir',
    titulo: 'Abrir y repasar',
    descripcion:
      '“Abrir” marca el material como consultado. Si ya lo viste, “Volver a abrir” te permite repasarlo cuando quieras.',
    radius: 12,
  },
]

export const GRUPOS_TOUR_STEPS = [
  {
    id: 'grupos-tarjeta',
    titulo: 'Tu grupo de pastoreo',
    descripcion:
      'Aquí ves el grupo al que perteneces: su nombre y una breve descripción. Toca la tarjeta para ver más detalle.',
    radius: 16,
  },
  {
    id: 'grupos-comunidad',
    titulo: 'Quiénes caminan contigo',
    descripcion:
      'Son los miembros de tu grupo. En el detalle del grupo puedes ver la lista completa de nombres.',
    radius: 12,
  },
  {
    id: 'grupos-coordinador',
    titulo: 'Contactar a tu coordinador',
    descripcion:
      'En el detalle del grupo encuentras a tu coordinador y un botón para escribirle un mensaje sin salir de esta sección.',
    radius: 12,
  },
]

export const MENSAJES_TOUR_STEPS = [
  {
    id: 'mensajes-anuncios',
    titulo: 'Anuncios',
    descripcion:
      'Aquí llegan los avisos del movimiento o de tu comunidad: son mensajes institucionales, no conversaciones personales.',
    radius: 12,
  },
  {
    id: 'mensajes-recibidos',
    titulo: 'Mensajes recibidos',
    descripcion:
      'Aquí están los mensajes que te escriben tu coordinador u otros miembros de tu grupo.',
    radius: 12,
  },
  {
    id: 'mensajes-escribir',
    titulo: 'Escribir un mensaje',
    descripcion:
      'Con este botón envías un mensaje nuevo. Puedes escribir a tu coordinador o a compañeros de tu mismo grupo de pastoreo.',
    radius: 12,
  },
]
