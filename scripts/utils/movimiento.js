// Si la persona pidió «reducir movimiento» en su sistema, no se anima nada
// y todo el contenido se ve desde el inicio.
export const hayMovimiento = !matchMedia('(prefers-reduced-motion: reduce)').matches;
