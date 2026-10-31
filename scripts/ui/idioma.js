// Idioma de la página (español o inglés).
// Los componentes se suscriben con alCambiarIdioma() para volver a dibujarse cuando cambia.

import { $, $$ } from '../utils/dom.js';
import { guardar, leer } from '../utils/almacen.js';
import { TEXTOS_EN, UI } from '../datos/textos.js';

let idioma = leer('ff-idioma') === 'en' ? 'en' : 'es';
const oyentes = [];

export const idiomaActual = () => idioma;

/** Devuelve el texto en el idioma actual: acepta { es, en } o un texto igual para los dos. */
export const tx = texto => (texto && typeof texto === 'object') ? (texto[idioma] ?? texto.es) : texto;

/** Registra una función que se ejecuta cada vez que se cambia de idioma. */
export const alCambiarIdioma = funcion => oyentes.push(funcion);

// Cambia los textos fijos de index.html (los que tienen data-i18n)
function traducirTextosFijos() {
  document.documentElement.lang = idioma;
  $$('[data-i18n]').forEach(el => {
    if (el.dataset.es === undefined) el.dataset.es = el.innerHTML;   // guarda el español original
    const traduccion = TEXTOS_EN[el.dataset.i18n];
    el.innerHTML = idioma === 'en' && traduccion ? traduccion : el.dataset.es;
  });
  const boton = $('#btn-idioma');
  boton.textContent = tx(UI.botonIdioma);
  boton.setAttribute('aria-label', tx(UI.cambiarIdioma));
}

export function iniciarIdioma() {
  traducirTextosFijos();
  $('#btn-idioma').addEventListener('click', () => {
    idioma = idioma === 'en' ? 'es' : 'en';
    guardar('ff-idioma', idioma);
    traducirTextosFijos();
    oyentes.forEach(funcion => funcion(idioma));
  });
}
