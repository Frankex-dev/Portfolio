// Guarda preferencias (idioma y tema) en localStorage.
// localStorage puede fallar en ventanas privadas o vistas previas, por eso todo va con try/catch.

export function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, valor);
  } catch (e) {
    // Si no se puede guardar, la preferencia solo dura hasta recargar
  }
}

export function leer(clave) {
  try {
    return localStorage.getItem(clave);
  } catch (e) {
    return null;
  }
}
