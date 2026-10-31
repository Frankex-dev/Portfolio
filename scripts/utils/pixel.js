// Pixel art generado con código: sprites SVG para las tarjetas y texturas de bloques estilo Minecraft.

import { SPRITES } from '../datos/sprites.js';
import { rngSemilla } from './aleatorio.js';

/** Convierte un sprite de datos/sprites.js en un <svg> con un cuadrito por pixel. */
export function sprite(nombre) {
  const filas = SPRITES[nombre];
  if (!filas) return '';
  let cuadros = '';
  filas.forEach((fila, y) => {
    [...fila].forEach((letra, x) => {
      if (letra !== '.') cuadros += `<rect class="p-${letra}" x="${x}" y="${y}" width="1" height="1"/>`;
    });
  });
  return `<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true">${cuadros}</svg>`;
}

// Paletas de cada material
const VERDE = ['#5b9a34', '#67a93b', '#74b845', '#4f8c2c', '#82c24f'];
const TIERRA = ['#7a5232', '#8a5d3a', '#6b4629', '#966843', '#5f3e24'];
const PIEDRA = ['#7f7f86', '#8e8e95', '#6f6f76', '#9b9ba2', '#75757c'];
const AMATISTA = ['#7b56c8', '#8e69da', '#a183ea', '#6a47b3', '#9a78e6'];
const GEMA = ['#4fe3ee', '#a8f7fb', '#2aa9b8'];

const cache = {};

/**
 * Dibuja una textura de 16 x 16 y la devuelve como imagen (data URL).
 * @param {'cesped'|'amatista'|'diamante'} tipo
 * @param {'arriba'|'lado'|'abajo'} cara
 */
export function texturaBloque(tipo, cara) {
  const clave = `${tipo}-${cara}`;
  if (cache[clave]) return cache[clave];

  const lienzo = document.createElement('canvas');
  lienzo.width = lienzo.height = 16;
  const g = lienzo.getContext('2d');

  // La semilla sale del nombre, así cada cara tiene siempre el mismo dibujo
  let semilla = 7;
  for (const letra of clave) semilla = (semilla * 31 + letra.charCodeAt(0)) >>> 0;
  const azar = rngSemilla(semilla);
  const elegir = lista => lista[Math.floor(azar() * lista.length)];
  const pintar = (x, y, color) => { g.fillStyle = color; g.fillRect(x, y, 1, 1); };

  // Hasta dónde baja el pasto en cada columna del costado del bloque de césped
  const bordePasto = Array.from({ length: 16 }, () => 3 + Math.floor(azar() * 3));

  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      let color;
      if (tipo === 'cesped') {
        if (cara === 'arriba') color = elegir(VERDE);
        else if (cara === 'abajo') color = elegir(TIERRA);
        else color = y < bordePasto[x] ? elegir(VERDE) : elegir(TIERRA);
      } else if (tipo === 'amatista') {
        color = elegir(AMATISTA);
      } else {
        color = elegir(PIEDRA);
      }
      pintar(x, y, color);
    }
  }

  if (tipo === 'amatista') {
    // Brillos y sombras de los cristales
    [[2, 4], [3, 3], [4, 2], [9, 7], [10, 6], [11, 5], [12, 4], [4, 12], [5, 11], [6, 10], [12, 13], [13, 12]]
      .forEach(([x, y]) => pintar(x, y, '#d9c8ff'));
    [[3, 5], [4, 4], [10, 8], [11, 7], [5, 13], [6, 12]]
      .forEach(([x, y]) => pintar(x, y, '#4e3291'));
  }
  if (tipo === 'diamante') {
    // Vetas de diamante sobre la piedra
    [[3, 3], [4, 3], [3, 4], [4, 4], [5, 4], [11, 4], [12, 4], [11, 5], [10, 5], [6, 10], [7, 10],
     [6, 11], [7, 11], [8, 11], [12, 11], [12, 12], [13, 12], [2, 13], [3, 13]]
      .forEach(([x, y]) => pintar(x, y, elegir(GEMA)));
  }

  return (cache[clave] = lienzo.toDataURL());
}
