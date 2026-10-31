// Sección «Mi camino»: línea de tiempo a partir de datos/camino.js.
// Cuando aparece en pantalla, anime.js hace crecer la línea punteada de arriba hacia abajo.

import { animate } from '../lib/anime.esm.min.js';
import { CAMINO } from '../datos/camino.js';
import { $ } from '../utils/dom.js';
import { hayMovimiento } from '../utils/movimiento.js';
import { tx, alCambiarIdioma } from '../ui/idioma.js';
import { observar } from '../efectos/animaciones.js';

function pintar(primeraVez) {
  const lista = $('#camino');
  lista.innerHTML = '<span class="linea" aria-hidden="true"></span>';

  const hitos = CAMINO.map((hito, i) => {
    const elemento = document.createElement('li');
    const esElUltimo = i === CAMINO.length - 1;
    elemento.className = 'hito' + (esElUltimo ? ' actual' : '') + (primeraVez ? ' revela' : '');
    elemento.innerHTML = `
      <span class="hito-fecha">${tx(hito.f)}</span>
      <h3>${tx(hito.t)}</h3>
      <p>${tx(hito.d)}</p>
      ${hito.img ? `<img src="${hito.img}" alt="${tx(hito.alt)}" loading="lazy" width="1280" height="720">` : ''}`;
    lista.append(elemento);
    return elemento;
  });

  if (primeraVez) observar(hitos);
}

function animarLinea() {
  const lista = $('#camino');
  if (!hayMovimiento || !('IntersectionObserver' in window)) {
    lista.classList.add('visto');
    return;
  }
  const observador = new IntersectionObserver(([entrada]) => {
    if (!entrada.isIntersecting) return;
    observador.disconnect();
    lista.classList.add('visto');
    animate(lista.querySelector('.linea'), { scaleY: [0, 1], duration: 1800, ease: 'inOutQuad' });
  }, { threshold: 0.05 });
  observador.observe(lista);
}

export function iniciarCamino() {
  pintar(true);
  animarLinea();
  alCambiarIdioma(() => pintar(false));
}
