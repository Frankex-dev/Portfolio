// Sección «Servicios»: tarjetas con precio desde datos/servicios.js.

import { SERVICIOS, FIVERR } from '../datos/servicios.js';
import { UI } from '../datos/textos.js';
import { $ } from '../utils/dom.js';
import { texturaBloque } from '../utils/pixel.js';
import { tx, alCambiarIdioma } from '../ui/idioma.js';
import { observar } from '../efectos/animaciones.js';

function pintar(primeraVez) {
  const caja = $('#lista-servicios');
  caja.innerHTML = '';

  const tarjetas = SERVICIOS.map(servicio => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'servicio pix' + (primeraVez ? ' revela' : '');
    tarjeta.innerHTML = `
      <span class="bloque" style="background-image: url(${texturaBloque(servicio.bloque, 'lado')})"></span>
      <h3>${tx(servicio.t)}</h3>
      <p>${tx(servicio.d)}</p>
      <div class="precio">
        <div><small>${tx(UI.desde)}</small><b>$${servicio.desde}</b></div>
        <a href="${FIVERR}" target="_blank" rel="noopener">${tx(UI.verFiverr)}</a>
      </div>`;
    caja.append(tarjeta);
    return tarjeta;
  });

  if (primeraVez) observar(tarjetas);
}

export function iniciarServicios() {
  pintar(true);
  alCambiarIdioma(() => pintar(false));
}
