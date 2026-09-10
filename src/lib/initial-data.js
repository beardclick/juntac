export const initialCategories = [
  { id: 1, name: 'Gestión', slug: 'gestion' },
  { id: 2, name: 'Actividades', slug: 'actividades' },
  { id: 3, name: 'Transparencia', slug: 'transparencia' },
  { id: 4, name: 'Infraestructura', slug: 'infraestructura' },
  { id: 5, name: 'Cultura', slug: 'cultura' },
  { id: 6, name: 'Medio Ambiente', slug: 'medio-ambiente' }
]

export const initialPurchases = [
  {
    id: 1,
    title: 'Construcción de Casetas de Espera en el Corregimiento de David Sur – Tercera Convocatoria',
    slug: 'construccion-de-casetas-de-espera-en-el-corregimiento-de-david-sur-tercera-convocatoria',
    description: 'Construcción de 4 casetas en el corregimiento de David Sur. Ubicación La Riviera, San Cristobal, Alto Verde. Fecha de recepción de propuesta 15 de enero de 2026 salon BACH escuela de Bellas Artes',
    status: 'adjudicado',
    is_desierto: false,
    publication_date: '2026-05-01',
    deadline_date: '2026-05-21',
    documents: [
      {
        group: 'Pliego',
        files: [
          { title: 'Ver Documento', url: 'https://jcdavidsur.gob.pa/wp-content/uploads/2026/01/CONSTRUCION-DE-CASETAS.pdf' }
        ]
      },
      {
        group: 'Cotización',
        files: [
          { title: 'Ver Documento', url: 'https://jcdavidsur.gob.pa/wp-content/uploads/2026/01/Escaner_20260511-2.pdf' },
          { title: 'Ver Documento 2', url: 'https://jcdavidsur.gob.pa/wp-content/uploads/2026/01/Escaner_20260709-2.pdf' }
        ]
      },
      {
        group: 'Orden de Proceder',
        files: [
          { title: 'Ver Documento', url: 'https://jcdavidsur.gob.pa/wp-content/uploads/2025/12/const-casetas-orden-proceder-scaled.jpg' }
        ]
      }
    ],
    created_at: '2026-05-01T08:00:00Z'
  },
  {
    id: 2,
    title: 'Mejoramiento de parques en el corregimiento de David Sur',
    slug: 'mejoramiento-de-parques-en-el-corregimiento-de-david-sur',
    description: 'El proyecto consiste en llevar a cabo todas las actividades necesarias para las mejoras de los parques y canchas en distintas barriadas del corregimiento del David Sur.\nEl proyecto incluye tanto el suministro de los materiales como la mano de obra para el desarrollo de las actividades.\nComunidades: Altos de San Cristobal, El Retorno – Victoriano Lorenzo, Portal de las Margaritas, Alto Verde – La Primavera',
    status: 'desierto',
    is_desierto: true,
    publication_date: '2026-05-15',
    deadline_date: '2026-05-21',
    documents: [
      {
        group: 'Pliego',
        files: [
          { title: 'Ver Documento', url: 'https://jcdavidsur.gob.pa/wp-content/uploads/2026/05/I-Conv.-Mejoramiento-de-Parques.pdf' }
        ]
      },
      {
        group: 'Cotización',
        files: [
          { title: 'Ver Documento', url: 'https://jcdavidsur.gob.pa/wp-content/uploads/2026/05/mejoramiento-cotizaicon-Escaner_20260522.pdf' },
          { title: 'Ver Documento 2', url: 'https://jcdavidsur.gob.pa/wp-content/uploads/2026/05/Escaner_20260709-3-1.pdf' }
        ]
      }
    ],
    created_at: '2026-05-15T08:00:00Z'
  }
]

export const initialNews = [
  {
    id: 1,
    title: 'Informe de Gestión: Segundo Año Cumplido',
    slug: 'informe-de-gestion-segundo-ano-cumplido',
    category: 'Gestión',
    category_id: 1,
    published_at: '2026-07-31',
    excerpt: 'Hoy presentamos con orgullo los resultados de nuestro segundo año de trabajo como Junta Comunal de David Sur. Ha sido un año de retos y avances importantes.',
    content: 'Hoy presentamos con orgullo los resultados de nuestro segundo año de trabajo como Junta Comunal de David Sur. Ha sido un año de retos, aprendizajes y avances importantes en beneficio de nuestra comunidad. Seguimos comprometidos con una gestión transparente, eficiente y cercana a la gente. Este es solo el comienzo. ¡Juntos hacemos la diferencia!',
    featured_image: '/images/hero.jpg',
    gallery: []
  },
  {
    id: 2,
    title: 'Taller de Salud Mental en el Colegio IPT Arnulfo Arias Madrid',
    slug: 'taller-de-salud-mental-en-el-colegio-ipt-arnulfo-arias-madrid',
    category: 'Actividades',
    category_id: 2,
    published_at: '2026-07-31',
    excerpt: 'Taller dirigido a los estudiantes de este centro educativo enfocado en la salud mental y la toma de decisiones, organizado en conjunto con Casa Esperanza.',
    content: 'El taller fue dirigido a los estudiantes del centro educativo, enfocado en la salud mental y la toma de decisiones. Organizado por la Junta Comunal de David Sur con el apoyo de Casa Esperanza. El artículo enfatiza que los jóvenes no están solos y que hay personas dispuestas a ayudarles, fomentando la escucha activa y la orientación.',
    featured_image: '/images/datos1.jpg',
    gallery: []
  },
  {
    id: 3,
    title: 'Seminario Juventud en Acción: Democracia y Liderazgo con Propósito',
    slug: 'seminario-juventud-en-accion-democracia-y-liderazgo-con-proposito',
    category: 'Actividades',
    category_id: 2,
    published_at: '2026-07-09',
    excerpt: 'Jornada de aprendizaje, reflexión y crecimiento junto a jóvenes comprometidos con construir una sociedad más participativa y democrática.',
    content: 'Hoy vivimos una jornada de aprendizaje, reflexión y crecimiento junto a jóvenes comprometidos con construir una sociedad más participativa y democrática. ✨ A través del seminario Juventud en Acción: Democracia y Liderazgo con Propósito, fortalecimos conocimientos, intercambiamos ideas y reafirmamos la importancia del liderazgo juvenil como motor de transformación en nuestras comunidades. Gracias a todos los participantes por su entusiasmo y compromiso. Seguimos apostando por espacios que inspiren, formen y empoderen a las nuevas generaciones.',
    featured_image: '/images/datos2.jpg',
    gallery: []
  },
  {
    id: 4,
    title: 'Mejoras a Centro de Salud de San Cristóbal',
    slug: 'mejoras-a-centro-de-salud-de-san-cristobal',
    category: 'Infraestructura',
    category_id: 4,
    published_at: '2026-03-25',
    excerpt: 'Entrega oficial de las mejoras realizadas en el Centro de Salud de San Cristóbal, una obra que impacta directamente en la calidad de atención de nuestras familias.',
    content: 'Hoy hacemos entrega oficial de las mejoras realizadas en el Centro de Salud de San Cristóbal, una obra que impacta directamente en la calidad de atención que reciben nuestras familias. Gracias a la alianza estratégica con SIDCA Constructora, logramos ejecutar esta obra que cuenta con espacios optimizados, funcionales y adecuados, pensados para brindar atención oportuna en un entorno más cómodo tanto para los usuarios como para el personal de salud.',
    featured_image: '/images/datos3.jpg',
    gallery: []
  },
  {
    id: 5,
    title: 'Desfile de la Pollera Blanca 2026',
    slug: 'desfile-de-la-pollera-blanca-2026',
    category: 'Cultura',
    category_id: 5,
    published_at: '2026-03-25',
    excerpt: 'Celebración de nuestras raíces, tradiciones y la belleza del traje típico nacional en el marco de la Feria Internacional de David.',
    content: 'Un honor y una alegría ser parte, un año más, del Desfile de la Pollera Blanca 2026. Desde la Junta Comunal de David Sur celebramos con orgullo nuestras raíces, nuestras tradiciones y la belleza de la pollera, símbolo de identidad y cultura panameña. Seguimos apoyando y promoviendo espacios que mantienen viva nuestra historia.',
    featured_image: '/images/datos4.jpg',
    gallery: []
  },
  {
    id: 6,
    title: 'Audiencia Pública – PIOPYSM 2026',
    slug: 'audiencia-publica-piopysm-2026',
    category: 'Transparencia',
    category_id: 3,
    published_at: '2026-03-25',
    excerpt: 'Espacio de participación ciudadana para la presentación y aprobación de proyectos del Programa de Inversión de Obras Públicas y Servicios Municipales.',
    content: 'Informe sobre la audiencia pública del Programa de Inversión de Obras Públicas y Servicios Municipales (PIOPYSM). Este mecanismo de participación ciudadana permite a los residentes de David Sur ser partícipes en la priorización y decisión de las inversiones comunitarias a través de los fondos de descentralización.',
    featured_image: '/images/datos5.jpg',
    gallery: []
  },
  {
    id: 7,
    title: 'Trabajos de Dragado y Limpieza en la Quebrada de Barro Blanco',
    slug: 'trabajos-de-dragado-y-limpieza-en-la-quebrada-de-barro-blanco',
    category: 'Actividades',
    category_id: 2,
    published_at: '2025-11-19',
    excerpt: 'Acciones preventivas de dragado y limpieza en la quebrada de Barro Blanco para evitar desbordamientos durante la temporada lluviosa.',
    content: 'Vecinos realizamos trabajos de dragado y limpieza en la quebrada de Barro Blanco, como parte de nuestras acciones para prevenir desbordamientos durante la temporada lluviosa. Agradecemos al Ministerio de Obras Públicas y a la Alcaldía de David por su apoyo constante en estas labores que benefician a toda la comunidad. ¡Juntos hacemos la diferencia!',
    featured_image: '/images/datos6.jpg',
    gallery: []
  },
  {
    id: 8,
    title: 'Taller de Emprendimiento',
    slug: 'taller-de-emprendimiento',
    category: 'Actividades',
    category_id: 2,
    published_at: '2025-11-07',
    excerpt: 'Capacitación en colaboración con AMPYME para brindar herramientas prácticas de finanzas, marketing y gestión empresarial a emprendedores locales.',
    content: 'Con el objetivo de fortalecer las capacidades económicas y fomentar el desarrollo local, realizamos un taller de emprendimiento dirigido a los residentes de la comunidad de David Sur, en colaboración con la Autoridad de la Micro, Pequeña y Mediana Empresa (AMPYME). Durante la jornada, los participantes recibieron herramientas prácticas para iniciar, mejorar y formalizar sus negocios, aprendiendo sobre temas como planificación, finanzas, marketing y liderazgo empresarial. Esta actividad forma parte de nuestro compromiso con el crecimiento sostenible y la generación de oportunidades para todos los miembros de la comunidad.',
    featured_image: '/images/datos7.jpg',
    gallery: []
  },
  {
    id: 9,
    title: 'Nuevo Puente en Calle Z Sur: Conectando Comunidades, Impulsando el Progreso',
    slug: 'nuevo-puente-en-calle-z-sur',
    category: 'Infraestructura',
    category_id: 4,
    published_at: '2025-11-07',
    excerpt: 'Construcción y habilitación del nuevo puente en Calle Z Sur, mejorando significativamente la conectividad y seguridad vial en el corregimiento.',
    content: 'Con gran satisfacción, anunciamos la construcción del nuevo puente en la Calle Z Sur, una obra que representa un paso importante hacia el mejoramiento de la infraestructura vial de nuestro corregimiento. Esta vía facilitará el tránsito seguro de peatones y vehículos, conectando nuestras comunidades de manera más eficiente y segura.',
    featured_image: '/images/hero.jpg',
    gallery: []
  },
  {
    id: 10,
    title: 'Jornada de Limpieza en el Lago Baruco',
    slug: 'jornada-de-limpieza-en-el-lago-baruco',
    category: 'Medio Ambiente',
    category_id: 6,
    published_at: '2025-09-05',
    excerpt: 'Gran operativo interinstitucional de limpieza y recolección de desechos sólidos para proteger el ecosistema y la fauna de Lago Baruco.',
    content: 'Operativo interinstitucional de saneamiento ambiental en el Lago Baruco, organizado por la Junta Comunal de David Sur con el valioso respaldo de la Alcaldía de David, MiAmbiente, SENAN, Caja de Ahorros y la Autoridad Marítima de Panamá. Se recolectaron importantes volúmenes de desechos plásticos y materiales contaminantes, reafirmando el compromiso con la preservación de nuestras fuentes hídricas y espacios naturales.',
    featured_image: '/images/cerro-san-cristobal.jpg',
    gallery: []
  }
]
