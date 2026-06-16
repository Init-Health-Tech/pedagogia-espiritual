export const NAV_ITEMS = [
  {
    label: 'El Movimiento',
    children: [
      { label: 'Quiénes somos', href: '#quienes-somos' },
      { label: 'Nuestra historia', href: '#historia' },
      { label: 'Espiritualidad franciscana', href: '#espiritualidad' },
    ],
  },
  {
    label: 'Pedagogía Espiritual',
    children: [
      { label: '¿Qué es la pedagogía espiritual?', href: '#que-es-pedagogia' },
      { label: 'La Santísima Trinidad', href: '#santisima-trinidad' },
      { label: 'Camino por etapas', href: '#camino-formativo' },
    ],
  },
  {
    label: 'Formación',
    children: [
      { label: 'Etapas del camino', href: '#modulos' },
      { label: 'Grupos de pastoreo', href: '#grupos-pastoreo' },
      { label: 'Diario semanal', href: '#ficha-pedagogica' },
    ],
  },
  {
    label: 'Contacto',
    href: '#contacto',
  },
]

export const FOOTER_COLUMNS = [
  {
    title: 'El Movimiento',
    links: [
      { label: 'Quiénes somos', href: '#quienes-somos' },
      { label: 'Historia', href: '#historia' },
      { label: 'Espiritualidad', href: '#espiritualidad' },
    ],
  },
  {
    title: 'Formación',
    links: [
      { label: 'Pedagogía espiritual', href: '#que-es-pedagogia' },
      { label: 'Etapas', href: '#modulos' },
      { label: 'Grupos de pastoreo', href: '#grupos-pastoreo' },
    ],
  },
  {
    title: 'Plataforma',
    links: [
      { label: 'Iniciar sesión', href: '/login', route: true },
      { label: 'Registrarse', href: '/registro', route: true },
      { label: 'Diario semanal', href: '#ficha-pedagogica' },
    ],
  },
]

export const MODULOS_PREVIEW = [
  {
    num: 'I',
    title: 'Búsqueda',
    desc: 'Apertura al encuentro con Dios. Manual interactivo con tips y reflexiones.',
    imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  },
  {
    num: 'II',
    title: 'Discipulado',
    desc: 'Profundizar en la fe con guías digitales, no solo documentos.',
    imagen: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80',
  },
  {
    num: 'III',
    title: 'Consagración',
    desc: 'Entrega y compromiso. Tu coordinador acompaña cada paso.',
    imagen: 'https://images.unsplash.com/photo-1518495973542-4542c06a9323?w=600&q=80',
  },
  {
    num: 'IV',
    title: 'Misión',
    desc: 'Servicio y testimonio. El camino continúa en comunidad.',
    imagen: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
  },
]

export const LANDING_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
  comunidad: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  camino: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  oracion: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
}
