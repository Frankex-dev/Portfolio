// Números aleatorios con semilla (algoritmo mulberry32).
// Con la misma semilla salen siempre los mismos números, así el campo de lavanda
// y las texturas de los bloques se ven iguales cada vez que se abre la página.

export function rngSemilla(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;   // número entre 0 y 1
  };
}
