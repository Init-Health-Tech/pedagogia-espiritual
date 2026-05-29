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
      { label: 'Camino formativo', href: '#camino-formativo' },
    ],
  },
  {
    label: 'Formación',
    children: [
      { label: 'Módulos de formación', href: '#modulos' },
      { label: 'Grupos de pastoreo', href: '#grupos-pastoreo' },
      { label: 'Ficha pedagógica', href: '#ficha-pedagogica' },
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
      { label: 'Módulos', href: '#modulos' },
      { label: 'Grupos de pastoreo', href: '#grupos-pastoreo' },
    ],
  },
  {
    title: 'Plataforma',
    links: [
      { label: 'Iniciar sesión', href: '/login', route: true },
      { label: 'Registrarse', href: '/registro', route: true },
      { label: 'Ficha pedagógica', href: '#ficha-pedagogica' },
    ],
  },
]

export const MODULOS_PREVIEW = [
  { num: 'I', title: 'Búsqueda', desc: 'Inicio del camino de fe y apertura al encuentro con Dios.' },
  { num: 'II', title: 'Discipulado', desc: 'Formación sólida en la fe y la vida cristiana.' },
  { num: 'III', title: 'Consagración', desc: 'Entrega profunda y compromiso con el Señor.' },
  { num: 'IV', title: 'Misión', desc: 'Servicio, testimonio y envío al mundo.' },
]
