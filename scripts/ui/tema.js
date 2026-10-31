// Tema claro u oscuro. Por defecto sigue al sistema; el botón lo fija y lo guarda.

import { $ } from '../utils/dom.js';
import { guardar } from '../utils/almacen.js';
import { tx, alCambiarIdioma } from './idioma.js';
import { UI } from '../datos/textos.js';

const raiz = document.documentElement;
const sistemaOscuro = matchMedia('(prefers-color-scheme: dark)');
const oyentes = [];

export const esOscuro = () => raiz.dataset.theme ? raiz.dataset.theme === 'dark' : sistemaOscuro.matches;

/** Registra una función que se ejecuta cada vez que cambia el tema (la usa el campo de lavanda). */
export const alCambiarTema = funcion => oyentes.push(funcion);

// Iconos pixel del botón
const SOL = '<svg viewBox="0 0 12 12" width="18" height="18" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true"><rect x="4" y="4" width="4" height="4"/><rect x="5" y="0" width="2" height="2"/><rect x="5" y="10" width="2" height="2"/><rect x="0" y="5" width="2" height="2"/><rect x="10" y="5" width="2" height="2"/><rect x="1" y="1" width="2" height="2"/><rect x="9" y="1" width="2" height="2"/><rect x="1" y="9" width="2" height="2"/><rect x="9" y="9" width="2" height="2"/></svg>';
const LUNA = '<svg viewBox="0 0 12 12" width="18" height="18" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true"><rect x="4" y="0" width="4" height="2"/><rect x="2" y="1" width="3" height="10"/><rect x="0" y="3" width="3" height="6"/><rect x="4" y="10" width="4" height="2"/><rect x="7" y="9" width="3" height="2"/><rect x="9" y="8" width="2" height="2"/></svg>';

function pintarBoton() {
  const boton = $('#btn-tema');
  const oscuro = esOscuro();
  boton.innerHTML = oscuro ? SOL : LUNA;
  boton.setAttribute('aria-label', tx(oscuro ? UI.aTemaClaro : UI.aTemaOscuro));
}

function avisarCambio() {
  pintarBoton();
  oyentes.forEach(funcion => funcion());
}

export function iniciarTema() {
  pintarBoton();
  $('#btn-tema').addEventListener('click', () => {
    const nuevo = esOscuro() ? 'light' : 'dark';
    raiz.dataset.theme = nuevo;
    guardar('ff-tema', nuevo);
    avisarCambio();
  });
  // Si no se eligió uno a mano, se sigue al sistema cuando este cambia
  sistemaOscuro.addEventListener('change', () => { if (!raiz.dataset.theme) avisarCambio(); });
  alCambiarIdioma(pintarBoton);
}
