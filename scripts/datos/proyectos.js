// Datos de los proyectos que se muestran en la sección «Proyectos».
// Para añadir uno nuevo basta con agregar un objeto a PROYECTOS:
//   cat     → id de una categoría de CATEGORIAS
//   tipo    → clave de TIPOS (si falta, es «propio»)
//   sprite  → nombre de un dibujo de datos/sprites.js, o img + w + h + alt para usar una imagen
//   t, d, dato → título, descripción y dato destacado ({ es, en } o un texto igual en ambos idiomas)

export const CATEGORIAS = [
  { id: 'todos', es: 'Todos', en: 'All' },
  { id: 'web', es: 'Web y Python', en: 'Web & Python' },
  { id: 'juegos', es: 'Juegos y mods', en: 'Games & mods' },
  { id: 'linux', es: 'Linux y PC', en: 'Linux & PC' }
];

export const TIPOS = {
  propio: { es: 'Propio', en: 'Personal' },
  equipo: { es: 'En equipo', en: 'Team' },
  uni: { es: 'Universidad', en: 'University' }
};

export const PROYECTOS = [
  {
    cat: 'web', tipo: 'equipo', sprite: 'auto', tinte: 'cyan',
    t: 'Zentry',
    d: {
      es: 'Control de acceso vehicular para la universidad: detecta los autos con YOLOv8, lee las placas y lo muestra todo en un panel web con Django. Proyecto en equipo.',
      en: 'Vehicle access control for my university: YOLOv8 spots the cars, a reader gets the plates and a Django dashboard shows everything. Team project.'
    },
    dato: { es: '85 % de placas leídas', en: '85% of plates read' },
    tags: ['Python', 'Django', 'YOLOv8']
  },
  {
    cat: 'web', tipo: 'uni', sprite: 'cruz', tinte: 'rose',
    t: { es: 'Consultorio médico (SCM)', en: 'Medical office system (SCM)' },
    d: {
      es: 'Sistema para un consultorio: agenda de citas, consultas, diagnósticos con códigos CIE, recetas, cobros e informe en PDF. Conectado a SQL Server.',
      en: 'A clinic system: appointments, consultations, ICD-coded diagnoses, prescriptions, payments and a PDF report. Runs on SQL Server.'
    },
    dato: { es: 'Informe PDF con xhtml2pdf', en: 'PDF report with xhtml2pdf' },
    tags: ['Django', 'SQL Server', 'xhtml2pdf']
  },
  {
    cat: 'web', tipo: 'uni', sprite: 'birrete', tinte: 'accent',
    t: { es: 'Control académico', en: 'Academic records' },
    d: {
      es: 'Cursos, profesores, estudiantes, evaluaciones y notas con inicio de sesión. Valida la cédula ecuatoriana con su dígito verificador y usa borrado lógico para no perder datos.',
      en: 'Courses, teachers, students, assessments and grades behind a login. It checks Ecuadorian ID numbers with their check digit and uses soft delete so no data is lost.'
    },
    dato: { es: 'Cédula validada con módulo 10', en: 'IDs checked with modulo 10' },
    tags: ['Django', 'Python', 'JavaScript']
  },
  {
    cat: 'web', tipo: 'equipo', sprite: 'caja', tinte: 'gold',
    t: { es: 'Mensajería y taller mecánico', en: 'Courier & car-shop apps' },
    d: {
      es: 'Dos sistemas de consola en Python orientado a objetos: encomiendas y órdenes de trabajo de un taller. Separados en modelos, servicios y repositorio, guardando en JSON. Trabajo en grupo.',
      en: 'Two object-oriented Python console apps: parcel delivery and car-shop work orders. Split into models, services and a repository, saving to JSON. Group work.'
    },
    dato: { es: 'Herencia, CRUD y JSON', en: 'Inheritance, CRUD and JSON' },
    tags: ['Python', 'POO', 'JSON']
  },
  {
    cat: 'juegos', img: 'images/hpbar.png', w: 392, h: 220,
    alt: {
      es: 'Barra de vida pixel de Simple HP Bar marcando 37/60 con absorción +8',
      en: 'Simple HP Bar pixel health bar showing 37/60 with +8 absorption'
    },
    t: 'Simple HP Bar',
    d: {
      es: 'Mi propio mod de Minecraft para RLCraft: cambia los corazones y la comida por barras pixel con números, absorción, veneno y aire bajo el agua.',
      en: 'My own Minecraft mod for RLCraft: it swaps hearts and food for pixel bars with numbers, absorption, poison and air underwater.'
    },
    dato: { es: '8 estados del HUD', en: '8 HUD states' },
    tags: ['Java', 'Forge 1.12.2', 'Mixins']
  },
  {
    cat: 'juegos', sprite: 'chat', tinte: 'gold',
    t: { es: 'Verity con IA local', en: 'Verity with local AI' },
    d: {
      es: 'Al mod de terror Verity le conecté una IA que corre en mi PC: Qwen3.5-4B en LM Studio, un intermediario en Python que la hace rápida y voz en español para hablarle y que me conteste.',
      en: 'I hooked the Verity horror mod up to an AI running on my own PC: Qwen3.5-4B in LM Studio, a Python proxy that makes it fast, and Spanish voice both ways.'
    },
    dato: { es: 'Todo en mi PC, sin nube', en: 'Fully local, no cloud' },
    tags: ['Python', 'Java', 'LM Studio', 'Piper']
  },
  {
    cat: 'juegos', sprite: 'espada', tinte: 'rose',
    t: { es: 'RLCraft optimizado', en: 'Optimized RLCraft' },
    d: {
      es: 'Más FPS en RLCraft con shaders sin bajar la distancia de renderizado: tres instancias para comparar, recolector G1 y una versión en Cleanroom con Java 25.',
      en: 'More FPS in RLCraft with shaders without lowering render distance: three instances to compare, the G1 garbage collector and a Cleanroom build on Java 25.'
    },
    dato: { es: '22 mods fuera, 19 dentro', en: '22 mods out, 19 in' },
    tags: ['Java', 'Cleanroom', 'Shaders']
  },
  {
    cat: 'linux', sprite: 'nota', tinte: 'green',
    t: { es: 'Autoradio para cliamp', en: 'Autoradio for cliamp' },
    d: {
      es: 'Un plugin en Lua para el reproductor de terminal: cuando se acaba la lista, pide a YouTube la radio de la canción y sigue sonando música parecida sin parar.',
      en: 'A Lua plugin for a terminal music player: when the queue runs out it asks YouTube for the song radio and keeps similar music going.'
    },
    dato: { es: '15 canciones por tanda', en: '15 songs per batch' },
    tags: ['Lua', 'YouTube', 'Terminal']
  }
];
