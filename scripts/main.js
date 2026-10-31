// Punto de entrada de la página: arranca cada parte en orden.
//
// Organización de scripts/:
//   datos/        contenido (proyectos, línea de tiempo, servicios, habilidades, textos en inglés)
//   componentes/  partes que se dibujan con esos datos (tarjetas, inventario, bloques, campo…)
//   efectos/      animaciones generales con anime.js
//   ui/           idioma, tema y barra de experiencia
//   utils/        funciones de apoyo
//   lib/          anime.js 4.5.0 (librería externa, sin modificar)

import { hayMovimiento } from './utils/movimiento.js';
import { $$ } from './utils/dom.js';
import { iniciarIdioma } from './ui/idioma.js';
import { iniciarTema } from './ui/tema.js';
import { iniciarBarraXp } from './ui/barra-xp.js';
import { observar, animarPortada } from './efectos/animaciones.js';
import { iniciarProyectos } from './componentes/proyectos.js';
import { iniciarCamino } from './componentes/camino.js';
import { iniciarServicios } from './componentes/servicios.js';
import { iniciarInventario } from './componentes/inventario.js';
import { iniciarBloques } from './componentes/bloques.js';
import { iniciarCampo } from './componentes/campo.js';

// Con esta clase el CSS oculta lo que luego aparece con animación
if (hayMovimiento) document.documentElement.classList.add('con-movimiento');

iniciarIdioma();
iniciarTema();

// Los títulos fijos de index.html aparecen al bajar (las tarjetas se observan en cada componente)
observar($$('.revela'));

iniciarProyectos();
iniciarCamino();
iniciarServicios();
iniciarInventario();
iniciarBloques();
iniciarCampo();
iniciarBarraXp();
animarPortada();   // va al final: usa los contadores que llenan proyectos e inventario
