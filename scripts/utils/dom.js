// Atajos para buscar elementos en la página.

/** Primer elemento que coincide con el selector. */
export const $ = (selector, raiz = document) => raiz.querySelector(selector);

/** Todos los elementos que coinciden, como arreglo normal (para usar map, filter, forEach…). */
export const $$ = (selector, raiz = document) => [...raiz.querySelectorAll(selector)];
