// Campo de lavanda pixel de la portada, dibujado en un <canvas>.
//
// Cómo funciona:
//   1. Se dibuja a baja resolución (1 pixel del canvas = 3 o 4 pixeles de pantalla)
//      y el CSS lo agranda con image-rendering: pixelated.
//   2. El fondo (cielo con degradado tramado, suelo y luna) se calcula una sola vez.
//   3. En cada cuadro se copian el fondo, las nubes o estrellas, los globos y las plantas.
//   4. El «motor» es una animación de anime.js que mueve el viento de -1 a 1 y llama a dibujar()
//      en cada cuadro; los globos suben y bajan con sus propias animaciones de anime.js.
//   Los colores salen de las variables CSS (styles/variables.css), así sigue al tema claro/oscuro.

import { animate } from '../lib/anime.esm.min.js';
import { $ } from '../utils/dom.js';
import { rngSemilla } from '../utils/aleatorio.js';
import { hayMovimiento } from '../utils/movimiento.js';
import { esOscuro, alCambiarTema } from '../ui/tema.js';

// Matriz de Bayer 4x4: decide qué pixeles cambian de tono para que el degradado se vea tramado
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

// Globo aerostático: a/b franjas, l brillo, r cuerdas, f llama (solo de noche), k/w canasta
const GLOBO = [
  '..aaaaa..', '.aabbbaa.', 'laabbbaaa', 'laabbbaaa', 'laabbbaaa', 'aaabbbaaa', '.aabbbaa.', '..aabaa..',
  '...aba...', '..r.f.r..', '..r...r..', '..r...r..', '..kwwwk..', '..kwwwk..', '...kkk...'
];

const lienzo = $('#campo');
const ctx = lienzo.getContext('2d', { alpha: false });
const heroe = $('#inicio');

const viento = { v: 0 };                        // lo anima anime.js
const raton = { x: 0, y: 0, activo: false };    // posición del mouse en pixeles del canvas

let W = 0, H = 0, PX = 4, HORIZONTE = 0;
let imagen = null, pixeles = null, fondo = null, paleta = null;
let plantas = [], globos = [], estrellas = [], nubes = [];
let colorNube = 0, colorSombraNube = 0;
let motor = null, animacionesGlobos = [], ultimoCuadro = 0, enPantalla = true;
let anchoAnterior = 0, altoAnterior = 0;

/* ---------- Colores ---------- */

const hexARgb = texto => {
  let s = (texto || '#888888').trim();
  if (s.length === 4) s = '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
  const n = parseInt(s.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mezclar = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
// Un color en un solo número de 32 bits (formato de ImageData: alfa, azul, verde, rojo)
const aPixel = c => ((255 << 24) | (Math.round(c[2]) << 16) | (Math.round(c[1]) << 8) | Math.round(c[0])) >>> 0;

function leerPaleta() {
  const estilos = getComputedStyle(document.documentElement);
  const v = nombre => hexARgb(estilos.getPropertyValue('--' + nombre));
  paleta = {
    oscuro: esOscuro(),
    cielo: [v('sky-top'), v('sky-mid'), v('sky-bot'), v('haze')],
    lejos: v('ground-far'),
    cerca: v('ground-near'),
    bruma: v('haze'),
    lavanda: [v('lav-3'), v('lav-2'), v('lav-1')],
    tallo: [v('stem-2'), v('stem')],
    globos: [v('globo-1'), v('globo-2'), v('globo-3'), v('globo-4')]
  };
}

function colorCielo(t) {
  const c = paleta.cielo;
  if (t < 0.55) return mezclar(c[0], c[1], t / 0.55);
  if (t < 0.9) return mezclar(c[1], c[2], (t - 0.55) / 0.35);
  return mezclar(c[2], c[3], Math.min(1, (t - 0.9) / 0.1));
}

/* ---------- Escena (posiciones fijas por semilla) ---------- */

function generarEscena() {
  const azar = rngSemilla(20261031);

  // Plantas en filas: las lejanas son pequeñas y juntas, las cercanas grandes y separadas
  plantas = [];
  const filas = Math.max(16, Math.round((H - HORIZONTE) / 2.4));
  for (let f = 0; f < filas; f++) {
    const d = (f + 1) / filas;                                     // 0 = horizonte, 1 = abajo
    const base = HORIZONTE + 1 + Math.round(Math.pow(d, 1.55) * (H - HORIZONTE + 6));
    const separacion = Math.max(1, Math.round(1 + d * d * 7));
    for (let x = -8; x < W + 8; x += separacion) {
      const alto = Math.max(1, Math.round((1.5 + d * d * 34) * (0.7 + azar() * 0.6)));
      plantas.push({
        x: x + Math.floor(azar() * separacion), y: base, d, alto,
        flor: Math.max(1, Math.round(alto * (0.38 + azar() * 0.12))),   // largo de la espiga morada
        ancho: d > 0.72 ? 3 : d > 0.42 ? 2 : 1,
        tono: azar(), fase: azar() * Math.PI * 2, patron: Math.floor(azar() * 3)
      });
    }
  }

  // Globos: escala 1 = lejos, 3 = cerca
  globos = [];
  const cantidad = W < 260 ? 3 : 5;
  for (let i = 0; i < cantidad; i++) {
    const escala = i < 2 ? 1 : i < cantidad - 1 ? 2 : 3;
    globos.push({
      x: azar() * W,
      y: Math.min(HORIZONTE * (0.1 + azar() * 0.45), HORIZONTE - 15 * escala - 4),
      escala, vx: (0.004 + azar() * 0.004) * escala, dy: 0, color: i % 4
    });
  }
  globos.sort((a, b) => a.escala - b.escala);

  estrellas = Array.from({ length: Math.round(W * HORIZONTE / 240) }, () => ({
    x: Math.floor(azar() * W), y: Math.floor(azar() * HORIZONTE * 0.8),
    fase: azar() * 6.28, vel: 0.001 + azar() * 0.003, grande: azar() < 0.12
  }));
  nubes = Array.from({ length: Math.max(3, Math.round(W / 110)) }, () => ({
    x: azar() * W, y: Math.round(HORIZONTE * (0.06 + azar() * 0.42)), w: Math.round(16 + azar() * 26), vx: 0.002 + azar() * 0.004
  }));
}

/* ---------- Fondo (se recalcula solo al cambiar tamaño o tema) ---------- */

function dibujarLuna() {
  const r = Math.max(4, Math.round(Math.min(W, HORIZONTE) * 0.07));
  const cx = Math.round(W * 0.86), cy = Math.round(HORIZONTE * 0.24);
  const luz = aPixel([246, 240, 255]), sombra = aPixel(mezclar([246, 240, 255], paleta.cielo[1], 0.3));
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (x * x + y * y > r * r) continue;
      // Un segundo círculo desplazado "muerde" la luna y la deja en cuarto creciente
      const dx = x - Math.round(r * 0.45), dy = y + Math.round(r * 0.3);
      if (dx * dx + dy * dy < r * r * 0.75) continue;
      const px = cx + x, py = cy + y;
      if (px >= 0 && px < W && py >= 0 && py < H) fondo[py * W + px] = (x + y + 64) % 3 === 0 ? sombra : luz;
    }
  }
}

function construirFondo() {
  fondo = new Uint32Array(W * H);
  const tramado = (x, y) => (BAYER[(x & 3) | ((y & 3) << 2)] + 0.5) / 16;

  // Cielo en 14 tonos
  const tonosCielo = Array.from({ length: 15 }, (_, i) => aPixel(colorCielo(i / 14)));
  for (let y = 0; y < HORIZONTE; y++) {
    const v = (y / HORIZONTE) * 14, i = Math.floor(v), resto = v - i;
    for (let x = 0; x < W; x++) fondo[y * W + x] = tonosCielo[Math.min(14, resto > tramado(x, y) ? i + 1 : i)];
  }
  // Suelo en 10 tonos, de la bruma lejana al verde oscuro cercano
  const tonosSuelo = Array.from({ length: 11 }, (_, i) => aPixel(mezclar(paleta.lejos, paleta.cerca, Math.pow(i / 10, 0.8))));
  for (let y = HORIZONTE; y < H; y++) {
    const v = ((y - HORIZONTE) / Math.max(1, H - HORIZONTE)) * 10, i = Math.floor(v), resto = v - i;
    for (let x = 0; x < W; x++) fondo[y * W + x] = tonosSuelo[Math.min(10, resto > tramado(x, y) ? i + 1 : i)];
  }
  if (paleta.oscuro) dibujarLuna();

  // Colores de cada planta: más brumosos cuanto más lejos
  for (const p of plantas) {
    const bruma = Math.pow(1 - p.d, 2.2) * 0.85;
    const base = mezclar(paleta.lavanda[0], paleta.lavanda[2], p.tono * 0.75);
    p.c1 = aPixel(mezclar(base, paleta.bruma, bruma));
    p.c2 = aPixel(mezclar(mezclar(base, paleta.lavanda[2], 0.45), paleta.bruma, bruma));
    p.ct = aPixel(mezclar(mezclar(paleta.tallo[0], paleta.tallo[1], p.tono), paleta.bruma, bruma));
  }
  for (const g of globos) {
    const bruma = (3 - g.escala) * 0.22;
    const a = paleta.globos[g.color], b = paleta.globos[(g.color + 1) % 4];
    const conBruma = c => aPixel(mezclar(c, paleta.bruma, bruma));
    g.colores = {
      a: conBruma(a), b: conBruma(b), l: conBruma(mezclar(a, [255, 255, 255], 0.35)),
      r: conBruma([120, 98, 82]), k: conBruma([80, 52, 32]), w: conBruma([168, 116, 63]),
      f: paleta.oscuro ? aPixel([255, 190, 90]) : 0
    };
  }
  for (const s of estrellas) {
    s.c1 = aPixel([255, 250, 235]);
    s.c2 = aPixel(mezclar(colorCielo(s.y / HORIZONTE), [255, 255, 255], 0.35));
  }
  colorNube = aPixel(mezclar([255, 255, 255], paleta.cielo[1], 0.1));
  colorSombraNube = aPixel(mezclar([255, 255, 255], paleta.cielo[1], 0.38));
}

/* ---------- Dibujo de cada cuadro ---------- */

function rect(x, y, w, h, color) {
  for (let j = y; j < y + h; j++) {
    if (j < 0 || j >= H) continue;
    const fila = j * W;
    for (let i = x; i < x + w; i++) if (i >= 0 && i < W) pixeles[fila + i] = color;
  }
}

function dibujarNube(n) {
  const x = Math.round(n.x), y = n.y, w = n.w, h = Math.max(4, Math.round(w / 4));
  rect(x, y + h - 2, w, 2, colorSombraNube);
  rect(x + 1, y + h - 3, w - 2, 1, colorNube);
  rect(x + Math.round(w * 0.12), y + Math.round(h * 0.35), Math.round(w * 0.58), h - Math.round(h * 0.35) - 2, colorNube);
  rect(x + Math.round(w * 0.45), y, Math.round(w * 0.35), h - 2, colorNube);
}

function dibujarGlobo(g) {
  const e = g.escala;
  const x0 = Math.round(g.x), y0 = Math.round(Math.min(g.y + g.dy, HORIZONTE - 15 * e - 2));
  GLOBO.forEach((fila, j) => {
    [...fila].forEach((letra, i) => {
      if (letra === '.') return;
      const color = g.colores[letra];
      if (!color || (letra === 'f' && Math.random() < 0.18)) return;   // la llama parpadea
      rect(x0 + i * e, y0 + j * e, e, e, color);
    });
  });
}

function dibujarPlantas(tiempo) {
  for (const p of plantas) {
    // Inclinación: viento general + vaivén propio + empujón del mouse
    let inclinacion = viento.v * (0.5 + p.d * 2.4) + Math.sin(tiempo * 0.0015 + p.fase) * (0.3 + p.d * 1.1);
    if (raton.activo) {
      const dx = p.x - raton.x, dy = (p.y - p.alto * 0.5) - raton.y;
      const radio = 26 + p.d * 20, dist2 = dx * dx + dy * dy * 0.6;
      if (dist2 < radio * radio) inclinacion += (dx >= 0 ? 1 : -1) * (1 - Math.sqrt(dist2) / radio) * (2 + p.d * 5);
    }

    const inicioFlor = p.alto - p.flor;
    for (let s = 0; s <= p.alto; s++) {
      const y = p.y - s;
      if (y < 0) break;
      if (y >= H) continue;
      const k = s / p.alto;                              // 0 en la base, 1 en la punta
      const desplazamiento = Math.round(inclinacion * k * k);
      const esFlor = s >= inicioFlor;
      const ancho = esFlor ? (s >= p.alto - 1 ? 1 : p.ancho) : 1;
      const x0 = p.x + desplazamiento - (ancho >> 1), fila = y * W;
      for (let x = x0; x < x0 + ancho; x++) {
        if (x < 0 || x >= W) continue;
        // Los botones de la flor van en diagonal y cambian en cada planta, así no salen rayas
        pixeles[fila + x] = esFlor ? ((s + x + p.patron) % 3 ? p.c1 : p.c2) : p.ct;
      }
    }
  }
}

function dibujar() {
  if (!pixeles) return;
  const ahora = performance.now();
  const dt = ultimoCuadro ? Math.min(50, ahora - ultimoCuadro) : 0;
  ultimoCuadro = ahora;

  pixeles.set(fondo);
  if (paleta.oscuro) {
    for (const s of estrellas) {
      const brillo = Math.sin(ahora * s.vel + s.fase);
      rect(s.x, s.y, 1, 1, brillo > 0.2 ? s.c1 : s.c2);
      if (s.grande && brillo > 0.6) {
        rect(s.x - 1, s.y, 1, 1, s.c2); rect(s.x + 1, s.y, 1, 1, s.c2);
        rect(s.x, s.y - 1, 1, 1, s.c2); rect(s.x, s.y + 1, 1, 1, s.c2);
      }
    }
  } else {
    for (const n of nubes) {
      n.x += n.vx * dt;
      if (n.x > W + 10) n.x = -n.w - 10;
      dibujarNube(n);
    }
  }
  for (const g of globos) {
    g.x += g.vx * dt;
    if (g.x > W + 4) g.x = -9 * g.escala - 4;
    dibujarGlobo(g);
  }
  dibujarPlantas(ahora);
  ctx.putImageData(imagen, 0, 0);
}

/* ---------- Tamaño y animación ---------- */

function animarGlobos() {
  if (!hayMovimiento) return;
  animacionesGlobos.forEach(a => a.cancel());
  animacionesGlobos = globos.map((g, i) => animate(g, {
    dy: [-(2 + g.escala), 2 + g.escala],
    duration: 2400 + i * 370,
    alternate: true,
    loop: true,
    ease: 'inOutSine',
    autoplay: enPantalla
  }));
}

function medir() {
  const caja = lienzo.getBoundingClientRect();
  if (!caja.width || !caja.height) return;
  anchoAnterior = caja.width;
  altoAnterior = caja.height;

  PX = caja.width < 700 ? 3 : 4;
  W = Math.ceil(caja.width / PX);
  H = Math.ceil(caja.height / PX);
  HORIZONTE = Math.round(H * 0.6);
  lienzo.width = W;
  lienzo.height = H;
  imagen = ctx.createImageData(W, H);
  pixeles = new Uint32Array(imagen.data.buffer);   // escribir un número = pintar un pixel completo

  generarEscena();
  leerPaleta();
  construirFondo();
  animarGlobos();
  ultimoCuadro = 0;
  dibujar();
}

export function iniciarCampo() {
  medir();

  let espera;
  addEventListener('resize', () => {
    clearTimeout(espera);
    espera = setTimeout(() => {
      const caja = lienzo.getBoundingClientRect();
      // En el celular la barra del navegador cambia el alto al hacer scroll: eso no merece rehacer el campo
      if (caja.width === anchoAnterior && Math.abs(caja.height - altoAnterior) < 120) return;
      medir();
    }, 160);
  });

  alCambiarTema(() => {
    if (!pixeles) return;
    leerPaleta();
    construirFondo();
    dibujar();
  });

  if (!hayMovimiento) return;   // sin movimiento: el campo queda quieto

  // Motor: el viento va de -1 a 1 y vuelve; en cada cuadro se redibuja el campo
  motor = animate(viento, {
    v: [-1, 1],
    duration: 5200,
    alternate: true,
    loop: true,
    ease: 'inOutSine',
    onUpdate: dibujar
  });

  // Si la portada no está en pantalla, se pausa todo para no gastar batería
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entrada]) => {
      enPantalla = entrada.isIntersecting;
      if (enPantalla) {
        ultimoCuadro = 0;
        motor.resume();
        animacionesGlobos.forEach(a => a.resume());
      } else {
        motor.pause();
        animacionesGlobos.forEach(a => a.pause());
      }
    }).observe(lienzo);
  }

  heroe.addEventListener('pointermove', evento => {
    const caja = lienzo.getBoundingClientRect();
    raton.x = (evento.clientX - caja.left) / PX;
    raton.y = (evento.clientY - caja.top) / PX;
    raton.activo = true;
  });
  heroe.addEventListener('pointerleave', () => { raton.activo = false; });
}
