// «Inventario»: barra de 9 espacios estilo Minecraft con las tecnologías de datos/habilidades.js.
// Se elige un espacio con el mouse, con Tab o con las teclas 1–9 (como en el juego).

import { animate, stagger, utils } from '../lib/anime.esm.min.js';
import { HABILIDADES } from '../datos/habilidades.js';
import { $, $$ } from '../utils/dom.js';
import { hayMovimiento } from '../utils/movimiento.js';
import { tx, alCambiarIdioma } from '../ui/idioma.js';

let activo = 0;
let barraVisible = false;

function pintar() {
  const barra = $('#hotbar');
  barra.innerHTML = '<span class="selector" id="selector" aria-hidden="true"></span>';
  HABILIDADES.forEach((habilidad, i) => {
    const espacio = document.createElement('button');
    espacio.type = 'button';
    espacio.className = 'slot';
    espacio.setAttribute('aria-label', `${habilidad.n}: ${tx(habilidad.lvl)}`);
    espacio.innerHTML = `<span class="item" style="--c1: ${habilidad.c1}; ${habilidad.t ? `--t: ${habilidad.t}` : ''}">${habilidad.k}</span>`;
    espacio.addEventListener('mouseenter', () => elegir(i));
    espacio.addEventListener('focus', () => elegir(i));
    espacio.addEventListener('click', () => elegir(i, { rebote: true }));
    barra.append(espacio);
  });
  elegir(activo, { sinAnimacion: true });
}

/** Mueve el marco blanco al espacio i y muestra su descripción. */
function elegir(i, { rebote = false, sinAnimacion = false } = {}) {
  const cambio = i !== activo;
  activo = i;
  const espacio = $$('#hotbar .slot')[i];
  const marco = $('#selector');
  if (!espacio || !marco) return;

  // El marco es 3 px más grande que el espacio por cada lado
  const x = espacio.offsetLeft - 3;
  const lado = espacio.offsetWidth + 6;
  marco.style.width = marco.style.height = `${lado}px`;
  marco.style.top = `${espacio.offsetTop - 3}px`;
  if (hayMovimiento && !sinAnimacion) animate(marco, { translateX: x, duration: 220, ease: 'outQuad' });
  else utils.set(marco, { translateX: x });

  const habilidad = HABILIDADES[i];
  const info = $('#inv-info');
  info.innerHTML = `
    <p class="inv-nombre">${habilidad.n}<span class="inv-nivel">${tx(habilidad.lvl)}</span></p>
    <p class="inv-uso">${tx(habilidad.uso)}</p>`;

  if (!hayMovimiento || sinAnimacion) return;
  if (cambio) animate([...info.children], { opacity: [0, 1], translateY: [6, 0], duration: 260, delay: stagger(50), ease: 'outQuad' });
  if (rebote) animate(espacio.querySelector('.item'), { scale: [{ to: 1.2, duration: 120 }, { to: 1, duration: 320 }], ease: 'outQuad' });
}

export function iniciarInventario() {
  const contador = $('#n-tecnologias');
  contador.dataset.cuenta = HABILIDADES.length;
  contador.textContent = HABILIDADES.length;

  pintar();
  alCambiarIdioma(pintar);

  // Las teclas 1–9 solo funcionan cuando el inventario está en pantalla
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entrada]) => { barraVisible = entrada.isIntersecting; }).observe($('#hotbar'));
  }
  addEventListener('keydown', evento => {
    if (!barraVisible || evento.ctrlKey || evento.metaKey || evento.altKey) return;
    if (/input|textarea|select/i.test(evento.target.tagName)) return;
    const numero = parseInt(evento.key, 10);
    if (numero >= 1 && numero <= HABILIDADES.length) elegir(numero - 1, { rebote: true });
  });

  // Si cambia el tamaño de la ventana o cargan las fuentes, se recoloca el marco
  addEventListener('resize', () => elegir(activo, { sinAnimacion: true }));
  document.fonts?.ready.then(() => elegir(activo, { sinAnimacion: true }));
}
