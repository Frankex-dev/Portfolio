// Servicios que ofrezco en Fiverr. «bloque» elige la textura del icono (ver utils/pixel.js).
// «desde» es el precio del paquete básico de cada anuncio.

export const FIVERR = 'https://www.fiverr.com/frank_freire';

export const SERVICIOS = [
  {
    bloque: 'cesped', desde: 5,
    t: { es: 'Mods, plugins y modpacks de Minecraft', en: 'Minecraft mods, plugins & modpacks' },
    d: {
      es: 'Mods de Forge o Fabric y plugins de Spigot. También armo modpacks, monto servidores con mods y arreglo crasheos.',
      en: 'Forge or Fabric mods and Spigot plugins. I also build modpacks, set up modded servers and fix crashes.'
    }
  },
  {
    bloque: 'amatista', desde: 5,
    t: { es: 'Webs con Django y scripts de Python', en: 'Django websites & Python scripts' },
    d: {
      es: 'Sistemas web con base de datos, páginas con HTML y CSS, y scripts que automatizan tareas repetitivas.',
      en: 'Web apps with a database, HTML and CSS pages, and scripts that automate repetitive tasks.'
    }
  },
  {
    bloque: 'diamante', desde: 5,
    t: { es: 'Scripts de Roblox en Luau', en: 'Roblox scripts in Luau' },
    d: { es: 'Sistemas para tu juego, como tiendas, puntos o guardado de datos, y corrección de errores.', en: 'Game systems such as shops, points or data saving, plus bug fixing.' }
  }
];
