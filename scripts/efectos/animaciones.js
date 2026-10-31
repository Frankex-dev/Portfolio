// Animaciones generales con anime.js v4:
//   - aparecer al hacer scroll (observar)
//   - entrada de la portada: nombre letra por letra, contadores, cartel y bloques
//   - pétalos al hacer clic en el cielo

import { animate, stagger, utils } from '../lib/anime.esm.min.js';
import { $, $$ } from '../utils/dom.js';
import { hayMovimiento } from '../utils/movimiento.js';

/* ---------- Aparecer al hacer scroll ---------- */

// IntersectionObserver avisa cuando un elemento entra en pantalla; anime.js lo hace aparecer.
const observador = hayMovimiento && 'IntersectionObserver' in window
  ? new IntersectionObserver(entradas => {
      const nuevos = entradas.filter(e => e.isIntersecting).map(e => e.target);
      if (!nuevos.length) return;
      nuevos.forEach(el => { observador.unobserve(el); el.classList.add('visto'); });
      animate(nuevos, {
        opacity: [0, 1],
        translateY: [26, 0],
        delay: stagger(90),          // uno detrás de otro
        duration: 700,
        ease: 'outCubic',
        onComplete: () => nuevos.forEach(el => { el.style.transform = ''; })   // devuelve el :hover al CSS
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 })
  : null;

/** Hace que los elementos aparezcan con animación cuando entran en pantalla. */
export function observar(elementos) {
  elementos.forEach(el => (observador ? observador.observe(el) : el.classList.add('visto')));
}

/** Deja de esperar a un elemento (por ejemplo, si un filtro ya lo mostró). */
export function dejarDeObservar(el) {
  if (observador) observador.unobserve(el);
}

/* ---------- Portada ---------- */

// Separa el nombre en letras para animarlas una por una
function animarNombre() {
  const titulo = $('#nombre');
  const texto = titulo.textContent.trim();
  titulo.setAttribute('aria-label', texto);   // los lectores de pantalla leen el nombre completo
  titulo.innerHTML = texto.split(' ')
    .map(palabra => `<span class="palabra" aria-hidden="true">${[...palabra].map(l => `<span class="letra">${l}</span>`).join('')}</span>`)
    .join(' ');
  if (!hayMovimiento) return;

  const letras = $$('.letra', titulo);
  animate(letras, {
    translateY: [-70, 0],
    opacity: [0, 1],
    delay: stagger(55, { start: 250 }),
    duration: 1000,
    ease: 'outBounce'
  });

  // Cada letra salta al pasar el mouse
  letras.forEach(letra => letra.addEventListener('mouseenter', () => {
    if (letra.dataset.salta) return;
    letra.dataset.salta = '1';
    animate(letra, {
      translateY: [{ to: -14, duration: 160, ease: 'outQuad' }, { to: 0, duration: 520, ease: 'outBounce' }],
      onComplete: () => { delete letra.dataset.salta; }
    });
  }));
}

// Los números de la portada cuentan desde 0
function animarContadores() {
  if (!hayMovimiento) return;
  $$('[data-cuenta]').forEach(el => {
    const final = Number(el.dataset.cuenta);
    const cuenta = { n: 0 };
    el.textContent = '0';
    animate(cuenta, {
      n: final,
      duration: 1600,
      delay: 700,
      ease: 'outExpo',
      onUpdate: () => { el.textContent = Math.round(cuenta.n); }
    });
  });
}

// El cartel y los bloques entran desde abajo
function animarEntrada() {
  if (!hayMovimiento) return;
  animate('.cartel', {
    opacity: [0, 1],
    translateY: [24, 0],
    duration: 800,
    ease: 'outCubic',
    onComplete: () => { $('.cartel').style.transform = ''; }
  });
  animate('.voxel', {
    opacity: [0, 1],
    translateY: [50, 0],
    delay: stagger(140, { start: 500 }),
    duration: 900,
    ease: 'outBack'
  });
}

// Clic en el cielo o en el campo: salen pétalos de colores
function activarPetalos() {
  if (!hayMovimiento) return;
  const heroe = $('#inicio');
  const capa = $('#petalos');
  const colores = ['var(--lav-1)', 'var(--lav-2)', 'var(--lav-3)', 'var(--xp)'];

  heroe.addEventListener('pointerdown', evento => {
    if (evento.target.closest('a, button, .cartel')) return;
    const caja = heroe.getBoundingClientRect();
    const x = evento.clientX - caja.left;
    const y = evento.clientY - caja.top;

    const petalos = Array.from({ length: 14 }, (_, i) => {
      const petalo = document.createElement('span');
      petalo.className = 'petalo';
      petalo.style.left = `${x}px`;
      petalo.style.top = `${y}px`;
      petalo.style.background = colores[i % colores.length];
      capa.append(petalo);
      return petalo;
    });

    animate(petalos, {
      translateX: () => utils.random(-100, 100),   // cada pétalo va a un lado distinto
      translateY: () => utils.random(-140, -20),
      rotate: () => utils.random(-180, 180),
      opacity: [1, 0],
      duration: () => utils.random(700, 1150),
      ease: 'outCubic',
      onComplete: () => petalos.forEach(p => p.remove())
    });
  });
}

export function animarPortada() {
  animarNombre();
  animarContadores();
  animarEntrada();
  activarPetalos();
}
