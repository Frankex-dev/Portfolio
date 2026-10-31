// Bloques 3D de la portada (césped, amatista y diamante).
// anime.js los hace flotar y girar como los objetos tirados en Minecraft;
// al hacer clic dan dos vueltas rápidas y «+10 XP». Con los tres sale un logro.

import { animate, createTimeline, utils } from '../lib/anime.esm.min.js';
import { UI } from '../datos/textos.js';
import { $, $$ } from '../utils/dom.js';
import { texturaBloque } from '../utils/pixel.js';
import { hayMovimiento } from '../utils/movimiento.js';
import { tx } from '../ui/idioma.js';
import { destellarNivel } from '../ui/barra-xp.js';

const tocados = new Set();
let logroMostrado = false;

// Giro lento sin fin desde el ángulo actual
function girarLento(cubo) {
  const angulo = parseFloat(utils.get(cubo, 'rotateY')) || 40;
  animate(cubo, { rotateY: [angulo, angulo + 360], duration: 10000, ease: 'linear', loop: true });
}

function golpear(boton, cubo, tipo) {
  tocados.add(tipo);

  const texto = document.createElement('span');
  texto.className = 'flotante';
  texto.textContent = '+10 XP';
  boton.append(texto);

  if (hayMovimiento) {
    utils.remove(cubo);
    const angulo = parseFloat(utils.get(cubo, 'rotateY')) || 0;
    animate(cubo, {
      rotateY: angulo + 720,
      duration: 1300,
      ease: 'outExpo',
      onComplete: () => {
        utils.set(cubo, { rotateY: (angulo + 720) % 360 });
        girarLento(cubo);
      }
    });
    animate(texto, { translateY: [0, -70], opacity: [1, 0], duration: 1000, ease: 'outCubic', onComplete: () => texto.remove() });
    destellarNivel();
  } else {
    setTimeout(() => texto.remove(), 900);
  }

  if (tocados.size === 3 && !logroMostrado) mostrarLogro();
}

// Aviso «¡Logro desbloqueado!»: entra por la derecha, espera y se va (línea de tiempo de anime.js)
function mostrarLogro() {
  logroMostrado = true;
  const aviso = $('#logro');
  aviso.querySelector('.logro-titulo').textContent = tx(UI.logroTitulo);
  aviso.querySelector('.logro-texto').textContent = tx(UI.logroTexto);
  aviso.hidden = false;

  if (!hayMovimiento) {
    setTimeout(() => { aviso.hidden = true; }, 3500);
    return;
  }
  createTimeline({ defaults: { ease: 'outCubic' } })
    .add(aviso, { translateX: ['130%', '0%'], duration: 500 })
    .add(aviso, { translateX: '130%', duration: 450, ease: 'inCubic', onComplete: () => { aviso.hidden = true; } }, '+=2800');
}

export function iniciarBloques() {
  $$('.voxel').forEach((boton, i) => {
    const tipo = boton.dataset.bloque;
    const cubo = $('.cubo', boton);
    const flota = $('.flota', boton);

    // Cada cara recibe su textura (arriba, abajo o lado)
    $$('.cara', boton).forEach(cara => {
      const parte = cara.classList.contains('t') ? 'arriba' : cara.classList.contains('u') ? 'abajo' : 'lado';
      cara.style.backgroundImage = `url(${texturaBloque(tipo, parte)})`;
    });

    if (hayMovimiento) {
      utils.set(cubo, { rotateX: -22, rotateY: 40 + i * 25 });
      girarLento(cubo);
      animate(flota, {
        translateY: [-7, 7],
        duration: 1700 + i * 260,
        delay: i * 180,
        alternate: true,
        loop: true,
        ease: 'inOutSine'
      });
    }
    boton.addEventListener('click', () => golpear(boton, cubo, tipo));
  });

  // El logo de la barra y el aviso de logro usan las mismas texturas
  $('.logo-cubo').style.backgroundImage = `url(${texturaBloque('cesped', 'lado')})`;
  $('#logro-bloque').style.backgroundImage = `url(${texturaBloque('diamante', 'lado')})`;
}
