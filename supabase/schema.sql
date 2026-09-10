-- ==============================================================================
-- JUNTA COMUNAL DE DAVID SUR - SUPABASE DATABASE SCHEMA & SEED DATA
-- ==============================================================================

-- 1. Categories for news
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. News articles
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  gallery JSONB DEFAULT '[]',
  category_id INTEGER REFERENCES categories(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Purchases / Actos Públicos (Transparencia)
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'activo' CHECK (status IN ('activo', 'adjudicado', 'expirado', 'desierto')),
  publication_date DATE,
  deadline_date DATE,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Citizen reports
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  apellido VARCHAR(200) NOT NULL,
  cedula VARCHAR(20) NOT NULL,
  email VARCHAR(200) NOT NULL,
  telefono VARCHAR(30),
  tipo_reporte VARCHAR(200) NOT NULL,
  detalles TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Media files tracking
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(500) NOT NULL,
  original_name VARCHAR(500) NOT NULL,
  mime_type VARCHAR(100),
  size INTEGER,
  url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TRIGGERS: Auto-update updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS news_updated_at ON news;
CREATE TRIGGER news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS purchases_updated_at ON purchases;
CREATE TRIGGER purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Auto-expire purchases: Handled via application logic or pg_cron
-- Application logic checks: if status = 'activo' AND deadline_date < CURRENT_DATE, set status = 'expirado'

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public read access for news, purchases, categories, media and insert access for reports
DROP POLICY IF EXISTS "Public can read news" ON news;
CREATE POLICY "Public can read news" ON news FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read purchases" ON purchases;
CREATE POLICY "Public can read purchases" ON purchases FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read categories" ON categories;
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert reports" ON reports;
CREATE POLICY "Public can insert reports" ON reports FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read media" ON media;
CREATE POLICY "Public can read media" ON media FOR SELECT USING (true);

-- Authenticated users (admin) full access to all tables
DROP POLICY IF EXISTS "Admin full access news" ON news;
CREATE POLICY "Admin full access news" ON news FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access purchases" ON purchases;
CREATE POLICY "Admin full access purchases" ON purchases FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access categories" ON categories;
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access reports" ON reports;
CREATE POLICY "Admin full access reports" ON reports FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access media" ON media;
CREATE POLICY "Admin full access media" ON media FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================================================
-- SEED DATA
-- ==============================================================================

-- Categories
INSERT INTO categories (name, slug) VALUES
  ('Gestión', 'gestion'),
  ('Actividades', 'actividades'),
  ('Transparencia', 'transparencia'),
  ('Infraestructura', 'infraestructura'),
  ('Cultura', 'cultura'),
  ('Medio Ambiente', 'medio-ambiente')
ON CONFLICT (slug) DO NOTHING;

-- Purchases / Actos Públicos
INSERT INTO purchases (title, slug, description, status, publication_date, deadline_date, documents)
VALUES
  (
    'Construcción de Casetas de Espera en el Corregimiento de David Sur – Tercera Convocatoria',
    'construccion-de-casetas-de-espera-en-el-corregimiento-de-david-sur-tercera-convocatoria',
    'Construcción de 4 casetas en el corregimiento de David Sur. Ubicación La Riviera, San Cristobal, Alto Verde. Fecha de recepción de propuesta 15 de enero de 2026 salon BACH escuela de Bellas Artes',
    'adjudicado',
    '2026-05-01',
    '2026-05-21',
    '[{"group":"Pliego","files":[{"title":"Ver Documento","url":"https://jcdavidsur.gob.pa/wp-content/uploads/2026/01/CONSTRUCION-DE-CASETAS.pdf"}]},{"group":"Cotización","files":[{"title":"Ver Documento","url":"https://jcdavidsur.gob.pa/wp-content/uploads/2026/01/Escaner_20260511-2.pdf"},{"title":"Ver Documento 2","url":"https://jcdavidsur.gob.pa/wp-content/uploads/2026/01/Escaner_20260709-2.pdf"}]},{"group":"Orden de Proceder","files":[{"title":"Ver Documento","url":"https://jcdavidsur.gob.pa/wp-content/uploads/2025/12/const-casetas-orden-proceder-scaled.jpg"}]}]'::jsonb
  ),
  (
    'Mejoramiento de parques en el corregimiento de David Sur',
    'mejoramiento-de-parques-en-el-corregimiento-de-david-sur',
    E'El proyecto consiste en llevar a cabo todas las actividades necesarias para las mejoras de los parques y canchas en distintas barriadas del corregimiento del David Sur.\nEl proyecto incluye tanto el suministro de los materiales como la mano de obra para el desarrollo de las actividades.\nComunidades: Altos de San Cristobal, El Retorno – Victoriano Lorenzo, Portal de las Margaritas, Alto Verde – La Primavera',
    'desierto',
    '2026-05-15',
    '2026-05-21',
    '[{"group":"Pliego","files":[{"title":"Ver Documento","url":"https://jcdavidsur.gob.pa/wp-content/uploads/2026/05/I-Conv.-Mejoramiento-de-Parques.pdf"}]},{"group":"Cotización","files":[{"title":"Ver Documento","url":"https://jcdavidsur.gob.pa/wp-content/uploads/2026/05/mejoramiento-cotizaicon-Escaner_20260522.pdf"},{"title":"Ver Documento 2","url":"https://jcdavidsur.gob.pa/wp-content/uploads/2026/05/Escaner_20260709-3-1.pdf"}]}]'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;

-- News Articles
INSERT INTO news (title, slug, content, excerpt, featured_image, gallery, category_id, published_at)
VALUES
  (
    'Informe de Gestión: Segundo Año Cumplido',
    'informe-de-gestion-segundo-ano-cumplido',
    $news1$En un acto solemne de rendición de cuentas ante la comunidad, la Junta Comunal de David Sur presentó su Informe de Gestión correspondiente al Segundo Año de labores comunitarias. Durante la jornada, se expusieron de manera detallada los avances alcanzados en los diferentes ejes estratégicos de la administración local.

Entre los principales logros destacan la modernización de los espacios públicos, la rehabilitación vial en sectores prioritarios como San Cristóbal y La Riviera, así como el fortalecimiento de los programas sociales dirigidos a niños, jóvenes y adultos mayores.

Asimismo, se enfatizó la política de puertas abiertas y transparencia presupuestaria, permitiendo que cada residente conozca de primera mano cómo se invierten los recursos públicos asignados al corregimiento.

"Nuestro compromiso sigue siendo trabajar de la mano con las comunidades, escuchando sus necesidades y respondiendo con hechos tangibles que eleven la calidad de vida de todos los habitantes de David Sur", afirmó la administración comunal.$news1$,
    'La Junta Comunal de David Sur rinde cuentas a la ciudadanía al cumplirse el segundo año de gestión, destacando los principales avances en obras públicas, desarrollo social y administración transparente.',
    '/images/datos1.jpg',
    '[]'::jsonb,
    (SELECT id FROM categories WHERE slug = 'gestion'),
    '2026-07-31 10:00:00+00'
  ),
  (
    'Taller de Salud Mental en el Colegio IPT Arnulfo Arias Madrid',
    'taller-de-salud-mental-en-el-colegio-ipt-arnulfo-arias-madrid',
    $news2$Con el propósito de promover el bienestar integral de la juventud de David Sur, la Junta Comunal llevó a cabo un enriquecedor Taller de Salud Mental en las instalaciones del Colegio IPT Arnulfo Arias Madrid, en estrecha alianza con la organización Casa Esperanza.

Durante la jornada, especialistas en psicología y trabajo social brindaron a los alumnos herramientas prácticas para la gestión del estrés, la inteligencia emocional, el autocuidado y la prevención de situaciones de riesgo. Los estudiantes participaron activamente en dinámicas grupales y espacios de diálogo constructivo.

Esta iniciativa forma parte del plan integral de apoyo educativo y desarrollo juvenil de la Junta Comunal, reconociendo que la salud mental es un pilar indispensable para el éxito académico y el crecimiento personal de nuestros jóvenes.$news2$,
    'En colaboración conjunta con Casa Esperanza, desarrollamos una jornada de orientación y salud mental dirigida a los estudiantes del Colegio IPT Arnulfo Arias Madrid.',
    '/images/datos2.jpg',
    '[]'::jsonb,
    (SELECT id FROM categories WHERE slug = 'actividades'),
    '2026-07-31 14:00:00+00'
  ),
  (
    'Seminario Juventud en Acción: Democracia y Liderazgo con Propósito',
    'seminario-juventud-en-accion-democracia-y-liderazgo-con-proposito',
    $news3$Bajo el lema "Democracia y Liderazgo con Propósito", se llevó a cabo el seminario juvenil "Juventud en Acción", convocado por la Junta Comunal de David Sur. El evento reunió a más de 80 jóvenes líderes procedentes de diversas barriadas y organizaciones juveniles del corregimiento.

El programa contó con ponencias magistrales sobre la importancia de la participación ciudadana en los gobiernos locales, mecanismos de control social, formulación de proyectos comunitarios y ética en el servicio público.

Los jóvenes participantes tuvieron la oportunidad de debatir sobre las problemáticas más apremiantes de sus sectores y formular propuestas concretas para el desarrollo comunitario, reafirmando que la juventud no es el futuro, sino el presente activo de David Sur.$news3$,
    'Más de 80 jóvenes del corregimiento participaron en el seminario formativo centrado en fomentar el liderazgo con propósito, valores cívicos y participación democrática.',
    '/images/datos3.jpg',
    '[]'::jsonb,
    (SELECT id FROM categories WHERE slug = 'actividades'),
    '2026-07-09 09:30:00+00'
  ),
  (
    'Mejoras a Centro de Salud de San Cristóbal',
    'mejoras-a-centro-de-salud-de-san-cristobal',
    $news4$La Junta Comunal de David Sur anunció la culminación formal y entrega de los trabajos de remodelación y mantenimiento en las instalaciones del Centro de Salud de San Cristóbal. Este proyecto fue posible gracias a una productiva alianza estratégica de cooperación comunitaria con SIDCA Constructora.

Las mejoras ejecutadas abarcaron la reparación integral de techos para erradicar filtraciones, aplicación de pintura antibacterial en salas de espera y consultorios, adecuación del sistema de climatización y optimización de las instalaciones sanitarias.

Con estas renovadas instalaciones, el personal médico y de enfermería podrá brindar una atención de mayor calidad y en condiciones dignas a las miles de familias de San Cristóbal y comunidades aledañas que asisten diariamente en busca de atención primaria de salud.$news4$,
    'Culminan con éxito los trabajos de acondicionamiento y mantenimiento de la infraestructura en el Centro de Salud de San Cristóbal, gracias a la alianza con SIDCA Constructora.',
    '/images/datos4.jpg',
    '[]'::jsonb,
    (SELECT id FROM categories WHERE slug = 'infraestructura'),
    '2026-03-25 11:00:00+00'
  ),
  (
    'Desfile de la Pollera Blanca 2026',
    'desfile-de-la-pollera-blanca-2026',
    $news5$El corregimiento de David Sur y la ciudad de David celebraron con júbilo la VI edición del Desfile de la Pollera Blanca, uno de los eventos culturales más emblemáticos de la región en el marco de las festividades de la Feria Internacional de David.

Más de 40 delegaciones folclóricas, agrupaciones cívicas y cientos de empolleradas lucieron con gracia la majestuosidad de nuestro traje típico nacional, acompañadas por conjuntos de música típica, tamboritos y alegres comparsas.

La Junta Comunal brindó un respaldo decisivo a la organización logística y de seguridad del desfile, reafirmando el compromiso irrenunciable con el rescate, preservación y difusión de las raíces y tradiciones que identifican a nuestro pueblo panameño y chiricano.$news5$,
    'Con gran entusiasmo y fervor patriótico se celebró la sexta edición del Desfile de la Pollera Blanca, vistiendo de gala, folclore y tradición las calles de David.',
    '/images/datos5.jpg',
    '[]'::jsonb,
    (SELECT id FROM categories WHERE slug = 'cultura'),
    '2026-03-25 16:00:00+00'
  ),
  (
    'Audiencia Pública – PIOPYSM 2026',
    'audiencia-publica-piopysm-2026',
    $news6$En un ejercicio de democracia participativa y transparencia ciudadana, la Junta Comunal de David Sur celebró la Audiencia Pública correspondiente al Programa de Inversión de Obras Públicas y Servicios Municipales (PIOPYSM) para la vigencia fiscal 2026.

Moradores de sectores como San Cristóbal, La Riviera, Alto Verde, Victoriano Lorenzo y El Retorno presentaron sus necesidades comunitarias más urgentes, tales como ampliación de redes de luminarias, reparación de vías, mejoras a parques recreativos y cuneteo pluvial.

Tras un proceso de consulta y deliberación abierta, se procedió a la priorización y votación de los proyectos que serán incluidos en la cartera de inversiones municipales, garantizando que el presupuesto se destine a las verdaderas prioridades de la población.$news6$,
    'Vecinos de todas las comunidades de David Sur se dieron cita en la Audiencia Pública para definir y priorizar los proyectos comunitarios del programa PIOPYSM 2026.',
    '/images/datos6.jpg',
    '[]'::jsonb,
    (SELECT id FROM categories WHERE slug = 'transparencia'),
    '2026-03-25 18:30:00+00'
  ),
  (
    'Trabajos de Dragado y Limpieza en la Quebrada de Barro Blanco',
    'trabajos-de-dragado-y-limpieza-en-la-quebrada-de-barro-blanco',
    $news7$Como parte del plan permanente de mitigación de desastres y prevención ante la temporada de lluvias de alta intensidad, el equipo operativo de la Junta Comunal de David Sur llevó a cabo intensos trabajos de dragado, desmonte y limpieza en el cauce de la quebrada de Barro Blanco.

Con la intervención de maquinaria pesada se retiraron sedimentos acumulados, ramas caídas y desperdicios sólidos que obstaculizaban el curso natural de las aguas y representaban un inminente riesgo de desbordamiento para las barriadas colindantes.

La Junta Comunal reitera el llamado a la ciudadanía a no arrojar basura ni enseres en los cauces naturales de agua, recordando que la prevención de inundaciones y el cuidado del entorno es una tarea compartida de toda la comunidad.$news7$,
    'Labores de desazolve y remoción de desechos con equipo pesado en la quebrada de Barro Blanco para prevenir inundaciones y proteger a las familias ribereñas.',
    '/images/datos7.jpg',
    '[]'::jsonb,
    (SELECT id FROM categories WHERE slug = 'actividades'),
    '2025-11-19 08:00:00+00'
  ),
  (
    'Taller de Emprendimiento',
    'taller-de-emprendimiento',
    $news8$Con el objetivo de dinamizar la economía local e impulsar la independencia económica de las familias, la Junta Comunal organizó el "Taller de Emprendimiento Comunitario", capacitando de forma gratuita a más de 35 emprendedores y artesanos del corregimiento.

Los participantes recibieron instrucción práctica sobre cálculo de costos y márgenes de ganancia, estrategias de comercialización digital a través de redes sociales, atención al cliente y trámites básicos de formalización comercial.

Al finalizar la jornada formativa, varios participantes compartieron sus testimonios de superación y agradecieron a la Junta Comunal por brindar estos espacios que abren oportunidades de crecimiento real para los pequeños negocios familiares de David Sur.$news8$,
    'Emprendedores de David Sur recibieron capacitación gratuita en gestión financiera, mercadeo en redes sociales y modelos de negocio sostenibles.',
    '/images/datos1.jpg',
    '[]'::jsonb,
    (SELECT id FROM categories WHERE slug = 'actividades'),
    '2025-11-07 10:00:00+00'
  ),
  (
    'Nuevo Puente en Calle Z Sur',
    'nuevo-puente-en-calle-z-sur',
    $news9$Una sentida necesidad de la comunidad ha sido resuelta con la entrega e inauguración formal del nuevo puente vehicular y peatonal en Calle Z Sur, obra ejecutada por la Junta Comunal de David Sur.

La antigua estructura de cruce se encontraba gravemente deteriorada y representaba un peligro inminente para conductores y transeúntes, en especial para niños que acuden a las escuelas del área. La nueva estructura cuenta con losa de concreto reforzado, barandales de seguridad de alta resistencia y señalización vial adecuada.

Los moradores del sector celebraron la culminación de esta obra clave de infraestructura que restablece la conectividad fluida entre barriadas y garantiza una circulación segura para todos los residentes.$news9$,
    'Quedó inaugurado el nuevo puente en Calle Z Sur, brindando un paso seguro tanto para el tránsito vehicular como para cientos de peatones y estudiantes.',
    '/images/datos2.jpg',
    '[]'::jsonb,
    (SELECT id FROM categories WHERE slug = 'infraestructura'),
    '2025-11-07 15:30:00+00'
  ),
  (
    'Jornada de Limpieza en el Lago Baruco',
    'jornada-de-limpieza-en-el-lago-baruco',
    $news10$En el marco de las acciones de protección y preservación ambiental, la Junta Comunal de David Sur coordinó una exitosa jornada de limpieza comunitaria en el emblemático Lago Baruco, sumando esfuerzos con el Ministerio de Ambiente (MiAmbiente), organizaciones cívicas y vecinos voluntarios.

Durante la jornada ecológica se recolectaron varias toneladas de desechos sólidos, plásticos de un solo uso y materiales no biodegradables, al tiempo que se realizaron labores de poda controlada y mantenimiento de las zonas verdes circundantes.

Esta actividad busca recuperar y mantener en óptimas condiciones este importante espacio natural y recreativo de nuestro corregimiento, concienciando a las presentes y futuras generaciones sobre el cuidado de nuestras fuentes de agua y biodiversidad local.$news10$,
    'Voluntarios, personal comunal e instituciones ambientales unieron fuerzas en una gran jornada de limpieza y saneamiento ecológico en el Lago Baruco.',
    '/images/datos3.jpg',
    '[]'::jsonb,
    (SELECT id FROM categories WHERE slug = 'medio-ambiente'),
    '2025-09-05 08:30:00+00'
  )
ON CONFLICT (slug) DO NOTHING;
