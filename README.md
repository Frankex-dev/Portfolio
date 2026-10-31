# Portafolio de Frank Freire

Portafolio personal con estilo pixel art inspirado en Minecraft. La portada es un campo de lavanda dibujado en `<canvas>`, con globos aerostáticos y bloques 3D, y todo se anima con **[anime.js](https://animejs.com) v4**.

Soy estudiante de Ingeniería en Software en la UNEMI (Ecuador). Aquí muestro mis proyectos de Django, Python y mods de Minecraft.

## Qué tiene

- **Portada animada:** campo de lavanda pixel que se mueve con el viento y se aparta al pasar el mouse. Tiene modo día (nubes) y noche (estrellas y luna).
- **Bloques 3D** hechos solo con CSS, con texturas generadas por código. Al hacer clic giran, dan «+10 XP» y, con los tres, sale un logro.
- **Proyectos con filtros** por categoría. Las tarjetas se generan desde un archivo de datos.
- **Inventario de tecnologías** estilo barra de Minecraft. Se usa con el mouse o con las teclas 1–9.
- **Línea de tiempo** que se dibuja al bajar.
- **Español / inglés** y **tema claro / oscuro**, que se guardan en el navegador.
- **Accesible:** respeta «reducir movimiento» del sistema, se usa con teclado y funciona en celular.

## Tecnologías

HTML · CSS · JavaScript (módulos ES) · anime.js 4.5.0 · Canvas 2D

## Estructura

```
portafolio/
├── index.html                 Estructura de la página (sin estilos ni código adentro)
├── images/                    Imágenes de los proyectos
├── styles/
│   ├── variables.css          Colores (tema claro y oscuro) y fuentes
│   ├── base.css               Reinicio, tipografía, botones y marco pixel
│   ├── componentes.css        Barra, tarjetas, inventario, bloques 3D, aviso de logro
│   └── secciones.css          Distribución de cada sección
└── scripts/
    ├── main.js                Punto de entrada: arranca todo en orden
    ├── tema-inicial.js        Aplica el tema guardado antes de pintar
    ├── datos/                 Contenido: proyectos, línea de tiempo, servicios, habilidades, textos en inglés, sprites
    ├── componentes/           Partes que se dibujan con esos datos
    │   ├── proyectos.js       Filtros y tarjetas
    │   ├── camino.js          Línea de tiempo
    │   ├── servicios.js       Tarjetas de servicios
    │   ├── inventario.js      Barra de 9 espacios
    │   ├── bloques.js         Bloques 3D y logro
    │   └── campo.js           Campo de lavanda en canvas
    ├── efectos/
    │   └── animaciones.js     Animaciones generales con anime.js (aparecer al bajar, nombre, contadores, pétalos)
    ├── ui/                    Idioma, tema y barra de experiencia
    ├── utils/                 Funciones de apoyo (DOM, almacenamiento, azar con semilla, pixel art)
    └── lib/
        └── anime.esm.min.js   anime.js 4.5.0 (licencia MIT), sin modificar
```

Para **añadir un proyecto** basta con agregar un objeto en `scripts/datos/proyectos.js`. La tarjeta, el filtro y el contador se actualizan solos.

## Dónde se usa anime.js

| Archivo | Qué anima |
|---|---|
| `efectos/animaciones.js` | Aparición al hacer scroll (`animate` + `stagger`), letras del nombre, contadores y pétalos (`utils.random`) |
| `componentes/campo.js` | El «motor» del viento que redibuja el canvas en cada cuadro (`onUpdate`) y el vaivén de los globos |
| `componentes/bloques.js` | Flotar y girar los bloques, el giro al hacer clic y el aviso de logro (`createTimeline`) |
| `componentes/proyectos.js` | Entrada de las tarjetas al filtrar y el salto de los dibujos |
| `componentes/inventario.js` | Movimiento del marco y rebote de los iconos |
| `componentes/camino.js` | La línea de tiempo que crece hacia abajo |
| `ui/barra-xp.js` | El número de nivel que salta al ganar XP |

## Cómo abrirlo

Usa módulos de JavaScript (`import` / `export`), así que **hay que abrirlo con un servidor local**. Si haces doble clic en `index.html`, el navegador bloquea los módulos.

- **VS Code:** extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*.
- **Terminal:**
  ```bash
  python -m http.server 8000
  ```
  y abrir <http://localhost:8000>.

Para publicarlo, sirve tal cual en **GitHub Pages** (Settings → Pages → rama `main`, carpeta raíz).

## Créditos

- [anime.js](https://github.com/juliangarnier/anime) de Julian Garnier (MIT).
- Fuentes de Google Fonts: Pixelify Sans, Instrument Sans y JetBrains Mono.
- Pixel art, texturas y campo de lavanda generados con código en este proyecto.
- Versión 1 del portafolio: HTML, CSS y anime.js 3 sobre una captura de Minecraft con shaders.
