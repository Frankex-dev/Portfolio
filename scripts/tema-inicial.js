// Se carga en <head>, antes de que se pinte la página: aplica el tema guardado
// para que no se vea un parpadeo de claro a oscuro. Es un script normal (no módulo)
// porque tiene que ejecutarse de inmediato.
try {
  var temaGuardado = localStorage.getItem('ff-tema');
  if (temaGuardado === 'light' || temaGuardado === 'dark') {
    document.documentElement.dataset.theme = temaGuardado;
  }
} catch (e) {
  // Sin acceso al almacenamiento (ventana privada): se usa el tema del sistema
}
