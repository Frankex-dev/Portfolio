// Barra de experiencia bajo el menú: se llena según cuánto bajaste en la página.

import { animate } from '../lib/anime.esm.min.js';
import { $ } from '../utils/dom.js';
import { hayMovimiento } from '../utils/movimiento.js';

export function iniciarBarraXp() {
  const relleno = $('#xp-relleno');
  let pendiente = false;

  const actualizar = () => {
    pendiente = false;
    const maximo = document.documentElement.scrollHeight - innerHeight;
    const avance = maximo > 0 ? Math.min(1, scrollY / maximo) : 0;
    relleno.style.width = `${(avance * 100).toFixed(2)}%`;
  };

  // requestAnimationFrame evita recalcular más de una vez por cuadro
  addEventListener('scroll', () => {
    if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); }
  }, { passive: true });
  actualizar();
}

/** Hace «saltar» el número de nivel (se usa al ganar XP con los bloques). */
export function destellarNivel() {
  if (!hayMovimiento) return;
  animate('#xp-nivel', {
    scale: [{ to: 1.5, duration: 150 }, { to: 1, duration: 400 }],
    ease: 'outQuad'
  });
}
