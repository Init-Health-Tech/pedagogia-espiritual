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
    label: 'Itinerario Informativo',
    href: '#itinerario-informativo',
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

export const ITINERARIO_FORMATIVO = [
  {
    title: 'Formación antropológica',
    desc: 'Ante los desafíos de la Iglesia en el mundo, el Papa Francisco señala que la raíz está en la antropología asumida. Estudiamos las antropologías hebrea y griega en la reflexión eclesial, con especial énfasis en la hebrea por su integridad.',
  },
  {
    title: 'Formación teológica espiritual',
    desc: 'Una de las formaciones más urgentes es la teológica espiritual, por la gran ignorancia en torno a la pneumatología. Profundizamos en la acción del Espíritu Santo en el bautizado y en los dones y carismas de las cartas paulinas.',
  },
  {
    title: 'Formación pedagógica – humana – espiritual',
    desc: 'La médula del proyecto formativo: integrar, como pide el Santo Padre, la formación humana y espiritual mediante la pedagogía espiritual y la reflexión sobre su continua referencia mutua.',
  },
  {
    title: 'Formación teológica – mística',
    desc: 'Siguiendo a Santo Tomás de Aquino, reflexionamos sobre los dos pilares del camino santo: la gracia de Dios en dones y carismas, y la respuesta teologal que damos en el diario vivir.',
  },
  {
    title: 'Formación pastoral – catequética',
    desc: 'Como movimiento eclesial en salida, nos formamos en pastoral y catequesis, con la iluminación que la pedagogía espiritual aporta a estas áreas esenciales para la Iglesia.',
  },
  {
    title: 'Formación doctrinal',
    desc: 'Formamos al pueblo de Dios en sana doctrina eclesial, con misericordia y claridad, cuidando el Depósito de la Fe transmitido por la Sagrada Escritura y la Santa Tradición.',
  },
  {
    title: 'Formación en las Sagradas Escrituras',
    desc: 'La Sagrada Escritura es la norma normans de la Iglesia. Una sólida formación bíblica orienta los contenidos temáticos del Movimiento de Pedagogía Espiritual.',
  },
  {
    title: 'Formación y praxis en la caridad',
    desc: 'Formación y praxis directa de caridad hacia las periferias físicas y existenciales: ministerio de escucha, atención psicológica y donación de víveres a los más vulnerables.',
  },
  {
    title: 'Espiritualidad franciscana',
    desc: 'Acogemos el legado de San Francisco — amor a Cristo, a los pobres, a la Iglesia y a la creación — para que toda praxis formativa y caritativa abrace el sensus fidei y salga al encuentro de quien más lo necesita.',
  },
  {
    title: 'Liturgía',
    desc: 'Formación litúrgica correcta, sólida y profunda, en línea con los documentos conciliares, para acompañar al pueblo santo y prevenir abusos litúrgicos nacidos de la ignorancia.',
  },
]

export const LANDING_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
  comunidad: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  camino: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  oracion: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
}
