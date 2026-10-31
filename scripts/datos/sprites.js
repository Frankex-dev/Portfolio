// Dibujos pixel de 12 x 12 para las tarjetas sin imagen.
// Cada letra es un color (clases .p-* en styles/componentes.css) y el punto es transparente:
//   k contorno · w blanco · a acento · b acento claro · s gris · d oscuro
//   g verde · y dorado · r rosa · c celeste · o naranja

export const SPRITES = {
  auto: [
    '............', '............', '...kkkkkk...', '..kcckkcck..', '..kcckkcck..', '.kkkkkkkkkk.',
    'kaaaaaaaaaak', 'kayaaaaaayak', 'kaaawwwwaaak', 'kkkkkkkkkkkk', '.kssk..kssk.', '..kk....kk..'
  ],
  cruz: [
    '............', '....kkkk....', '....krrk....', '....krrk....', '.kkkkrrkkkk.', '.krrrrrrrrk.',
    '.krrrrrrrrk.', '.kkkkrrkkkk.', '....krrk....', '....krrk....', '....kkkk....', '............'
  ],
  birrete: [
    '............', '.....kk.....', '...kkaakk...', '.kkaabbaakk.', 'kaabbbbbbaak', '.kkaabbaakky',
    '..kkkaakkk.y', '..kaakkaak.y', '..kaaaaaak.y', '..kaaaaaakyy', '...kkkkkk.yy', '............'
  ],
  caja: [
    '............', '.kkkkkkkkkk.', 'kooooyyooook', 'kooooyyooook', 'kkkkkyykkkkk', 'kooooyyooook',
    'kooooyyooook', 'kooooyyooook', 'koooooooowok', 'kooooooowwok', 'kkkkkkkkkkkk', '............'
  ],
  chat: [
    '............', '.kkkkkkkkkk.', 'kyyyyyyyyyyk', 'kyyyyyyyyyyk', 'kykkykkykkyk', 'kyyyyyyyyyyk',
    '.kkkyykkkkk.', '...kyk......', '...kk.......', '............', '............', '............'
  ],
  espada: [
    '..........kk', '.........kwk', '........kwk.', '.......kwk..', '......kwk...', '..k..kwk....',
    '..kkkwk.....', '...kyk......', '..kykkk.....', '.kyk..k.....', 'kyk.........', 'kk..........'
  ],
  nota: [
    '............', '....kkkkkkkk', '....kaaaaaak', '....kakkkkak', '....kak...ak', '....kak...ak',
    '..kkkak.kkak', '.kaaaak.kaak', '.kaaaakkaaak', '..kkkk..kkk.', '............', '............'
  ]
};
