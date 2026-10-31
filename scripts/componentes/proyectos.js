// Sección «Proyectos»: botones de filtro y tarjetas, a partir de datos/proyectos.js.

import { animate, stagger, utils } from '../lib/anime.esm.min.js';
import { CATEGORIAS, TIPOS, PROYECTOS } from '../datos/proyectos.js';
import { $, $$ } from '../utils/dom.js';
import { sprite } from '../utils/pixel.js';
import { hayMovimiento } from '../utils/movimiento.js';
import { tx, alCambiarIdioma } from '../ui/idioma.js';
import { observar, dejarDeObservar } from '../efectos/animaciones.js';

let filtro = 'todos';

// Solo aparecen las categorías que tienen al menos un proyecto
const categorias = CATEGORIAS.filter(c => c.id === 'todos' || PROYECTOS.some(p => p.cat === c.id));

function pintarFiltros() {
  const caja = $('#filtros');
  caja.innerHTML = '';
  categorias.forEach(categoria => {
    const cantidad = categoria.id === 'todos'
      ? PROYECTOS.length
      : PROYECTOS.filter(p => p.cat === categoria.id).length;
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'filtro';
    boton.dataset.cat = categoria.id;
    boton.setAttribute('aria-pressed', String(categoria.id === filtro));
    boton.innerHTML = `${tx(categoria)}<span class="n">${cantidad}</span>`;
    boton.addEventListener('click', () => filtrar(categoria.id));
    caja.append(boton);
  });
}

function crearTarjeta(proyecto, conAnimacion) {
  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta pix' + (conAnimacion ? ' revela' : '');
  tarjeta.dataset.cat = proyecto.cat;

  const categoria = tx(CATEGORIAS.find(c => c.id === proyecto.cat));
  const tipo = tx(TIPOS[proyecto.tipo || 'propio']);
  const medio = proyecto.img
    ? `<div class="medio"><img src="${proyecto.img}" alt="${tx(proyecto.alt)}" loading="lazy" width="${proyecto.w}" height="${proyecto.h}"></div>`
    : `<div class="medio medio-sprite" style="--tinte: var(--${proyecto.tinte})">${sprite(proyecto.sprite)}</div>`;

  tarjeta.innerHTML = `
    ${medio}
    <div class="cuerpo">
      <div class="meta"><span>${categoria}</span><span>${tipo}</span></div>
      <h3>${tx(proyecto.t)}</h3>
      <p class="desc">${tx(proyecto.d)}</p>
      <div class="pie">
        <p class="dato">${tx(proyecto.dato)}</p>
        <ul class="tags">${proyecto.tags.map(tag => `<li>${tag}</li>`).join('')}</ul>
      </div>
    </div>`;

  // Al pasar el mouse, el dibujo da un saltito
  if (hayMovimiento) {
    tarjeta.addEventListener('mouseenter', () => {
      const dibujo = tarjeta.querySelector('.medio-sprite svg');
      if (!dibujo) return;
      animate(dibujo, {
        translateY: [{ to: -14, duration: 180, ease: 'outQuad' }, { to: 0, duration: 520, ease: 'outBounce' }]
      });
    });
  }
  return tarjeta;
}

function pintarTarjetas(primeraVez) {
  const rejilla = $('#rejilla');
  rejilla.innerHTML = '';
  const tarjetas = PROYECTOS.map(proyecto => {
    const tarjeta = crearTarjeta(proyecto, primeraVez);
    tarjeta.hidden = filtro !== 'todos' && proyecto.cat !== filtro;
    rejilla.append(tarjeta);
    return tarjeta;
  });
  if (primeraVez) observar(tarjetas);
}

function filtrar(categoria) {
  filtro = categoria;
  $$('.filtro').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === categoria)));

  const visibles = [];
  $$('#rejilla .tarjeta').forEach(tarjeta => {
    const mostrar = categoria === 'todos' || tarjeta.dataset.cat === categoria;
    tarjeta.hidden = !mostrar;
    if (mostrar) visibles.push(tarjeta);
    dejarDeObservar(tarjeta);
    tarjeta.classList.add('visto');
  });

  if (!hayMovimiento) return;
  utils.remove(visibles);
  animate(visibles, {
    opacity: [0, 1],
    translateY: [18, 0],
    delay: stagger(55),
    duration: 480,
    ease: 'outCubic',
    onComplete: () => visibles.forEach(t => { t.style.transform = ''; })
  });
}

export function iniciarProyectos() {
  // El contador de la portada sale de los datos, no se escribe a mano
  const contador = $('#n-proyectos');
  contador.dataset.cuenta = PROYECTOS.length;
  contador.textContent = PROYECTOS.length;

  pintarFiltros();
  pintarTarjetas(true);
  alCambiarIdioma(() => { pintarFiltros(); pintarTarjetas(false); });
}
