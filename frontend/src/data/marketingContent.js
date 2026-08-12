export const NAV_ITEMS = [
  {
    label: 'Pedagogía Espiritual',
    route: '/pedagogia-espiritual',
    children: [
      { label: '¿Qué es la pedagogía espiritual?', href: '/pedagogia-espiritual#que-es-pedagogia' },
      { label: 'La Santísima Trinidad', href: '/pedagogia-espiritual#santisima-trinidad' },
      { label: 'Desarrollo de la sesión', href: '/pedagogia-espiritual#desarrollo-sesion' },
    ],
  },
  {
    label: 'Formación',
    route: '/formacion',
    children: [
      { label: '¿Por qué con nosotros?', href: '/formacion#porque-con-nosotros' },
      { label: 'Etapas del camino', href: '/formacion#modulos' },
      { label: 'Avisos y calendario', href: '/formacion#avisos' },
    ],
  },
  {
    label: 'Itinerario formativo',
    route: '/itinerario',
    children: [
      { label: 'Diez ejes de formación', href: '/itinerario#itinerario-formativo' },
    ],
  },
]

export const FOOTER_COLUMNS = [
  {
    title: 'El Movimiento',
    links: [
      { label: 'Quiénes somos', href: '/#quienes-somos' },
      { label: '¿Por qué lo hacemos?', href: '/#historia' },
      { label: 'Historia franciscana', href: '/#historia-franciscana' },
      { label: 'Nuestro equipo', href: '/#nuestro-equipo' },
    ],
  },
  {
    title: 'Pedagogía Espiritual',
    links: [
      { label: '¿Qué es la pedagogía?', href: '/pedagogia-espiritual#que-es-pedagogia' },
      { label: 'La Santísima Trinidad', href: '/pedagogia-espiritual#santisima-trinidad' },
      { label: 'Desarrollo de la sesión', href: '/pedagogia-espiritual#desarrollo-sesion' },
    ],
  },
  {
    title: 'Formación',
    links: [
      { label: '¿Por qué con nosotros?', href: '/formacion#porque-con-nosotros' },
      { label: 'Etapas del camino', href: '/formacion#modulos' },
      { label: 'Avisos y calendario', href: '/formacion#avisos' },
    ],
  },
  {
    title: 'Plataforma',
    links: [
      { label: 'Iniciar sesión', href: '/login', route: true },
      { label: 'Registrarse', href: '/registro', route: true },
      { label: 'Itinerario formativo', href: '/itinerario' },
    ],
  },
]

export const NUESTRO_EQUIPO = {
  intro:
    'Contamos con un equipo especializado de escucha de 30 hermanos, de los cuales 10 somos psicólogos. Realizamos nuestra misión como obra de caridad y, a la vez, como camino de evangelización.',
  obrasCaridad: [
    'Atención psicológica gratuita',
    'Despensa',
    'Medicamentos',
  ],
  apoyo: 'Contamos con un par de doctoras que nos apoyan en este servicio.',
}

export const JUSTIFICACION_PROYECTO = [
  'La humanidad enfrenta grandes desafíos históricos que afectan lo religioso, político, social y cultural, cuyas causas superan la comprensión que el ser humano tiene de sí mismo.',
  'El Papa Francisco identifica dos realidades actuales: la «cultura del descarte» (instrumentalización y desecho de personas) y la «cultura de cristal» (fragilidad antropológica en jóvenes que genera vacíos existenciales).',
  'Siguiendo el llamado evangélico y el espíritu de la Iglesia en salida, surge un movimiento de formación integral orientado a las periferias existenciales, no solo físicas.',
  'Se reconoce que es en los límites y momentos de vulnerabilidad donde mejor se acoge el Evangelio, en línea con la frase de San Pablo: «Cuando soy débil, entonces soy fuerte».',
  'Sin atender el área humana desde lo pedagógico-espiritual, no es posible una evangelización efectiva.',
  'El proyecto se sostiene en dos realidades: un pueblo de Dios que sufre confusiones antropológicas (vacíos, depresión, ansiedad, falta de sentido) y, al mismo tiempo, esas realidades dolorosas como una oportunidad de evangelización.',
]

export const MISION =
  'Ofrecer una formación pedagógica integral que, desde una sólida fundamentación bíblica, teológica, doctrinal y humano–espiritual, acompañe el proceso de conversión y santificación del Pueblo Santo de Dios, formando evangelizadores comprometidos con la vivencia del Evangelio, la comunión eclesial y el servicio caritativo.'

export const VISION =
  'Consolidarnos como una comunidad formativa de excelencia al servicio de la Iglesia, reconocida por la integración de la antropología cristiana, la espiritualidad, la formación doctrinal y la acción pastoral, formando hombres y mujeres capaces de responder a los desafíos de la nueva evangelización con madurez humana, profundidad espiritual y compromiso misionero.'

export const VALORES = [
  {
    name: 'Fe',
    description: 'Vivir una relación profunda con Dios que oriente todas las dimensiones de la vida y la misión evangelizadora.',
  },
  {
    name: 'Caridad y servicio',
    description: 'Amar y servir al prójimo con generosidad, especialmente a los más vulnerables, mediante una atención integral humana, espiritual y material, siguiendo el ejemplo de Cristo.',
  },
  {
    name: 'Comunión eclesial',
    description: 'Permanecer unidos al Magisterio y a la vida de la Iglesia, promoviendo la participación activa en la comunidad cristiana.',
  },
  {
    name: 'Conversión permanente',
    description: 'Buscar continuamente la santificación y el crecimiento espiritual mediante un proceso constante de transformación personal.',
  },
  {
    name: 'Formación integral',
    description: 'Desarrollar armónicamente las dimensiones humana, espiritual, intelectual, pastoral y comunitaria de cada persona.',
  },
  {
    name: 'Discernimiento',
    description: 'Actuar con sabiduría a la luz de la Sagrada Escritura, la oración y la acción del Espíritu Santo para responder a la voluntad de Dios.',
  },
  {
    name: 'Fraternidad',
    description: 'Construir relaciones basadas en el respeto, la acogida, la solidaridad y el amor mutuo, inspirados en el ejemplo de San Francisco.',
  },
  {
    name: 'Esperanza',
    description: 'Confiar en la acción de Dios y transmitir un mensaje de renovación, reconciliación y salvación para todas las personas.',
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

/** Avisos y eventos públicos de Formación (fechas YYYY-MM-DD). */
export const AVISOS_EVENTOS = [
  {
    date: '2026-08-08',
    time: '9:00 – 14:00',
    title: 'Sesión semanal de Pedagogía Espiritual',
    description: 'Jornada completa de oración, formación y fraternidad. Te esperamos con el corazón abierto.',
    place: 'Casa de formación',
    type: 'formacion',
  },
  {
    date: '2026-08-15',
    time: '9:00 – 14:00',
    title: 'Sesión semanal · Solemnidad de la Asunción',
    description: 'Celebramos a María Santísima en el ritmo habitual de la sesión semanal.',
    place: 'Casa de formación',
    type: 'oracion',
  },
  {
    date: '2026-08-22',
    time: '9:00 – 14:00',
    title: 'Sesión semanal de Pedagogía Espiritual',
    description: 'Oración, E.P.F., tema formativo, Hora Santa y Eucaristía.',
    place: 'Casa de formación',
    type: 'formacion',
  },
  {
    date: '2026-08-29',
    time: '10:00 – 13:00',
    title: 'Obra de caridad · Despensa comunitaria',
    description: 'Servicio a familias vulnerables: entrega de víveres y escucha fraterna.',
    place: 'Centro de caridad',
    type: 'caridad',
  },
  {
    date: '2026-09-05',
    time: '9:00 – 14:00',
    title: 'Sesión semanal de Pedagogía Espiritual',
    description: 'Retomamos el camino formativo del mes con la comunidad.',
    place: 'Casa de formación',
    type: 'formacion',
  },
  {
    date: '2026-09-12',
    time: '17:00 – 20:00',
    title: 'Retiro de escucha y silencio',
    description: 'Espacio contemplativo para renovar el corazón y discernir el siguiente paso en el camino.',
    place: 'Casa de retiro',
    type: 'oracion',
  },
  {
    date: '2026-09-19',
    time: '9:00 – 14:00',
    title: 'Sesión semanal de Pedagogía Espiritual',
    description: 'Formación integral: oración, estudio y comunión fraterna.',
    place: 'Casa de formación',
    type: 'formacion',
  },
  {
    date: '2026-09-26',
    time: '14:00 – 17:00',
    title: 'Ágape de bienvenida a nuevos hermanos',
    description: 'Encuentro fraterno para quienes inician el camino de formación.',
    place: 'Casa de formación',
    type: 'comunidad',
  },
  {
    date: '2026-10-04',
    time: '10:00 – 13:00',
    title: 'Fiesta de San Francisco de Asís',
    description: 'Celebración del Poverello: Eucaristía, acción de gracias y renovación del compromiso franciscano.',
    place: 'Capilla de la comunidad',
    type: 'celebracion',
  },
  {
    date: '2026-10-10',
    time: '9:00 – 14:00',
    title: 'Sesión semanal de Pedagogía Espiritual',
    description: 'Continuamos el itinerario formativo en el espíritu de Asís.',
    place: 'Casa de formación',
    type: 'formacion',
  },
]

export const DESARROLLO_SESION = [
  {
    time: '9:00',
    title: 'Fraternidad en oración (F.O.)',
    shortTitle: 'Oración (F.O.)',
    summary: 'Alabanza, agradecimiento y petición del objetivo del día.',
    detail:
      'Momento de oración espontánea de alabanza y agradecimiento a la Santísima Trinidad, con un espacio para presentar a Dios el objetivo central de la reunión.',
  },
  {
    time: '9:30',
    title: 'Rezo del Santo Rosario',
    shortTitle: 'Santo Rosario',
    summary: 'Intercesión de nuestra Madre María Santísima.',
    detail:
      'Rezamos el misterio correspondiente al día de la reunión. Rogamos por las intenciones del Santo Padre, del Señor Cardenal, de sus obispos y por algún acontecimiento del día.',
  },
  {
    time: '10:00',
    title: 'Lectura y meditación del Oficio Divino',
    shortTitle: 'Oficio Divino',
    summary: 'Oficio de Lectura con la Iglesia.',
    detail:
      'Leemos y meditamos con la Iglesia el Oficio Divino. Por la dinámica de la reunión, nos centramos en el Oficio de Lectura.',
  },
  {
    time: '10:45',
    title: 'E.P.F. — Equipos de Pastoreo y Fraternidad',
    shortTitle: 'E.P.F.',
    summary: 'Comunión y fraternidad al estilo de las primeras comunidades.',
    detail:
      'Recogemos la experiencia de las primeras comunidades narrada en los Hechos de los Apóstoles como signo de comunión y fraternidad. Se comparten siete preguntas clave:',
    questions: [
      '¿Cómo atendí mi vida sacramental esta semana: Santa Eucaristía, visitas al Santísimo Sacramento, confesión, etc.?',
      '¿Cómo atendí mi vida de oración: Oficio de Lectura, Laúdes, hora intermedia, vísperas, completas, Santo Rosario, momentos de oración, meditación y adoración?',
      '¿Cómo atendí el proceso de estudio en la semana: tema de formación, lectura adicional?',
      '¿Qué acercamiento tuve a las Sagradas Escrituras: meditación del Evangelio, Lectio Divina, comentario bíblico, etc.?',
      '¿Qué grado de conciencia espiritual en la conducción de mi alma tuve en la semana? (apertura o dureza del alma ante la voz del Espíritu).',
      '¿Qué grado de lectura hago de la gracia de Dios en mi vida durante la semana pasada? (apertura del alma ante alguna sanación, liberación o ayuda divina).',
      '¿Qué grado de pedagogía espiritual logro ver en mi vida durante esta semana? ¿Logro detectar algún avance pedagógico humano–espiritual o no?',
    ],
  },
  {
    time: '11:15',
    title: 'Tema',
    shortTitle: 'Tema',
    summary: 'Formación según el proceso de la comunidad.',
    detail: 'El tema será dado según el proceso de la comunidad en torno a los manuales.',
  },
  {
    time: '12:15',
    title: 'Hora Santa',
    shortTitle: 'Hora Santa',
    summary: 'Adoración total al Santísimo.',
    detail:
      'Guardamos este espacio de adoración con mucho cuidado evangélico. Se pide con caridad abstenerse del uso de medios electrónicos que puedan distraernos de este encuentro con Jesús Sacramentado.',
  },
  {
    time: '13:15',
    title: 'Santa Eucaristía',
    shortTitle: 'Eucaristía',
    summary: 'Centro de nuestra vida espiritual.',
    detail:
      'A una voz con la Iglesia, la celebración eucarística es el centro de nuestra vida espiritual. Exhortamos a todos los miembros a vivir este encuentro con el máximo recogimiento y devoción posible.',
  },
  {
    time: '14:00',
    title: 'Ágape fraterno',
    shortTitle: 'Ágape',
    summary: 'Alimento compartido como signo de fraternidad.',
    detail:
      'Siguiendo el ejemplo de las primeras comunidades, compartimos semanalmente el alimento como signo de fraternidad y comunión.',
  },
]

export const ITINERARIO_FORMATIVO = [
  {
    title: 'Formación antropológica',
    shortTitle: 'Antropología',
    desc: 'Ante los desafíos de la Iglesia en el mundo, el Papa Francisco señala que la raíz está en la antropología asumida. Estudiamos las antropologías hebrea y griega en la reflexión eclesial, con especial énfasis en la hebrea por su integridad.',
  },
  {
    title: 'Formación teológica espiritual',
    shortTitle: 'Teología espiritual',
    desc: 'Una de las formaciones más urgentes es la teológica espiritual, por la gran ignorancia en torno a la pneumatología. Profundizamos en la acción del Espíritu Santo en el bautizado y en los dones y carismas de las cartas paulinas.',
  },
  {
    title: 'Formación pedagógica – humana – espiritual',
    shortTitle: 'Pedagogía integral',
    desc: 'La médula del proyecto formativo: integrar, como pide el Santo Padre, la formación humana y espiritual mediante la pedagogía espiritual y la reflexión sobre su continua referencia mutua.',
  },
  {
    title: 'Formación teológica – mística',
    shortTitle: 'Teología mística',
    desc: 'Siguiendo a Santo Tomás de Aquino, reflexionamos sobre los dos pilares del camino santo: la gracia de Dios en dones y carismas, y la respuesta teologal que damos en el diario vivir.',
  },
  {
    title: 'Formación pastoral – catequética',
    shortTitle: 'Pastoral',
    desc: 'Como movimiento eclesial en salida, nos formamos en pastoral y catequesis, con la iluminación que la pedagogía espiritual aporta a estas áreas esenciales para la Iglesia.',
  },
  {
    title: 'Formación doctrinal',
    shortTitle: 'Doctrina',
    desc: 'Formamos al pueblo de Dios en sana doctrina eclesial, con misericordia y claridad, cuidando el Depósito de la Fe transmitido por la Sagrada Escritura y la Santa Tradición.',
  },
  {
    title: 'Formación en las Sagradas Escrituras',
    shortTitle: 'Sagradas Escrituras',
    desc: 'La Sagrada Escritura es la norma normans de la Iglesia. Una sólida formación bíblica orienta los contenidos temáticos del Movimiento de Pedagogía Espiritual.',
  },
  {
    title: 'Formación y praxis en la caridad',
    shortTitle: 'Caridad',
    desc: 'Formación y praxis directa de caridad hacia las periferias físicas y existenciales: ministerio de escucha, atención psicológica y donación de víveres a los más vulnerables.',
  },
  {
    title: 'Espiritualidad franciscana',
    shortTitle: 'Espiritualidad franciscana',
    desc: 'Acogemos el legado de San Francisco — amor a Cristo, a los pobres, a la Iglesia y a la creación — para que toda praxis formativa y caritativa abrace el sensus fidei y salga al encuentro de quien más lo necesita.',
  },
  {
    title: 'Liturgía',
    shortTitle: 'Liturgia',
    desc: 'Formación litúrgica correcta, sólida y profunda, en línea con los documentos conciliares, para acompañar al pueblo santo y prevenir abusos litúrgicos nacidos de la ignorancia.',
  },
]

export const HISTORIA_FRANCISCANA = {
  chapters: [
    {
      title: 'Orígenes con San Francisco de Asís (siglo XIII)',
      paragraphs: [
        'Francisco de Bernardone (1182–1226) nace en Asís, Italia, hijo de un próspero comerciante de telas.',
        'Tras una conversión marcada por experiencias como el abrazo al leproso y la voz del crucifijo de San Damián («Francisco, ve y repara mi casa»), renuncia a su herencia y abraza la pobreza radical.',
        'En 1209 obtiene la aprobación oral del Papa Inocencio III para su forma de vida, dando origen a la Orden de Hermanos Menores (Primera Orden).',
      ],
    },
    {
      title: 'Nacimiento de las tres Órdenes',
      paragraphs: [
        'Primera Orden: los frailes (Hermanos Menores), fundada por el propio Francisco.',
        'Segunda Orden: las Clarisas, fundada junto a Santa Clara de Asís en 1212, para mujeres consagradas a la vida contemplativa.',
        'Tercera Orden: pensada para laicos —hombres y mujeres casados o solteros que no podían dejar sus obligaciones familiares o civiles— que deseaban vivir el espíritu franciscano en medio del mundo. Se le atribuye una «Regla» hacia 1221, conocida como el Memoriale propositi.',
      ],
    },
    {
      title: 'De la Tercera Orden Seglar a la Tercera Orden Regular (TOR)',
      paragraphs: [
        'Con el tiempo, algunos grupos de terciarios comenzaron a vivir en comunidad, con votos públicos y vida común, dando origen a la Tercera Orden Regular (frente a la Tercera Orden Seglar, que permanece laical y sin votos religiosos formales).',
        'La TOR fue aprobada formalmente por el Papa Nicolás IV en 1289 mediante la bula Supra Montem, que le dio una regla propia.',
        'A lo largo de los siglos, distintas congregaciones y ramas (masculinas y femeninas) adoptaron esta regla, dando lugar a múltiples institutos religiosos que hoy se reconocen bajo la familia de la TOR.',
      ],
    },
    {
      title: 'Consolidación y expansión (siglos XIV–XX)',
      paragraphs: [
        'La TOR se expandió por Europa y luego por América tras la evangelización.',
        'En 1927, el Papa Pío XI aprobó una regla renovada específica para los religiosos de la TOR (bula Rerum Conditio), separándola definitivamente en su forma jurídica de la Orden Franciscana Seglar.',
        'En el siglo XX, tras el Concilio Vaticano II, muchas congregaciones de la TOR renovaron sus constituciones y regla de vida conforme al espíritu conciliar, manteniendo el carisma original de fraternidad, minoridad y penitencia.',
      ],
    },
  ],
  identidad: [
    {
      title: 'Carisma',
      desc: 'Vida fraterna, penitencia (conversión continua), minoridad (humildad) y servicio a los pobres.',
    },
    {
      title: 'Espiritualidad',
      desc: 'Seguimiento radical del Evangelio «sine glossa» (sin glosas), tal como lo entendió Francisco.',
    },
    {
      title: 'Figuras clave',
      desc: 'San Francisco, Santa Clara, y santos y beatos propios de la tradición TOR — por ejemplo, San Elzeario y Santa Delfina como terciarios laicos históricos, o figuras fundadoras de congregaciones TOR según cada rama.',
    },
  ],
  timeline: [
    { year: '1182', text: 'Nace Francisco de Bernardone en Asís, Italia.' },
    { year: '1206', text: 'Conversión de Francisco; renuncia públicamente a la herencia de su padre y comienza su vida de penitencia.' },
    { year: '1208–1209', text: 'Se le unen los primeros compañeros; nace la fraternidad de los Hermanos Menores.' },
    { year: '1209', text: 'El Papa Inocencio III aprueba oralmente la forma de vida de Francisco (origen de la Primera Orden).' },
    { year: '1212', text: 'Santa Clara de Asís se une al movimiento franciscano; nace la Segunda Orden (Clarisas).' },
    { year: '1221', text: 'Se redacta el Memoriale propositi, considerado la primera regla para los laicos penitentes que darán origen a la Tercera Orden.' },
    { year: '1223', text: 'El Papa Honorio III aprueba definitivamente (por bula) la Regla de los Hermanos Menores.' },
    { year: '1226', text: 'Muere San Francisco de Asís en la Porciúncula (3 de octubre).' },
    { year: '1228', text: 'Francisco es canonizado por el Papa Gregorio IX.' },
    { year: 'Siglo XIII', text: 'Grupos de terciarios comienzan a adoptar vida común y votos públicos, distinguiéndose de los terciarios seglares; germen de la Tercera Orden Regular (TOR).' },
    { year: '1289', text: 'El Papa Nicolás IV aprueba formalmente la regla de la Tercera Orden mediante la bula Supra Montem.' },
    { year: 'XIV–XVI', text: 'Expansión de la TOR por Europa; surgen distintas congregaciones y fraternidades que adoptan esta regla.' },
    { year: 'S. XVI+', text: 'Expansión franciscana (incluida la TOR) hacia América tras la evangelización del Nuevo Mundo.' },
    { year: '1927', text: 'El Papa Pío XI aprueba una regla renovada específica para los religiosos de la TOR mediante la bula Rerum Conditio, consolidando su identidad jurídica propia frente a la Orden Franciscana Seglar.' },
    { year: '1962–1965', text: 'Concilio Vaticano II; impulsa la renovación de constituciones y vida religiosa en las congregaciones de la TOR conforme al espíritu conciliar.' },
    { year: 'XX–XXI', text: 'Consolidación de las distintas ramas y congregaciones de la Tercera Orden Regular a nivel mundial, manteniendo el carisma de fraternidad, minoridad y penitencia.' },
  ],
}

export const LANDING_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1551418557-567e915fe7aa?w=1200&q=80',
  comunidad: 'https://images.unsplash.com/photo-1687563100716-17408eb4fb93?w=800&q=80',
  camino: 'https://images.unsplash.com/photo-1756541178978-fe09dc8d4bda?w=800&q=80',
  oracion: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
}
