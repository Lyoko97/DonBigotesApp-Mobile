import type { Order } from "./tipos";

// Adaptado de reference/format.ts. La web usa Intl.DateTimeFormat con la zona
// "America/El_Salvador"; aquí se usa el desfase fijo UTC-6 (El Salvador no
// tiene horario de verano) porque el soporte de zonas horarias de Hermes
// varía entre dispositivos. El resultado es el mismo.
const DESFASE_EL_SALVADOR_MS = -6 * 60 * 60 * 1000;

function relojDelNegocio(valor: Date | string): Date {
  return new Date(new Date(valor).getTime() + DESFASE_EL_SALVADOR_MS);
}

const dos = (n: number) => String(n).padStart(2, "0");

// "YYYY-MM-DD" del día del negocio.
export function claveDelDia(valor: Date | string): string {
  const d = relojDelNegocio(valor);
  return `${d.getUTCFullYear()}-${dos(d.getUTCMonth() + 1)}-${dos(d.getUTCDate())}`;
}

export function esDeHoy(valor: Date | string, ahora: Date = new Date()): boolean {
  return claveDelDia(valor) === claveDelDia(ahora);
}

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// "Viernes 23 de octubre" (CLAUDE.md §8: siempre a partir de la fecha actual).
export function fechaLarga(ahora: Date = new Date()): string {
  const d = relojDelNegocio(ahora);
  return `${DIAS[d.getUTCDay()]} ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`;
}

// "11:12 a.m." (formato del prototipo C2)
export function hora(valor: Date | string): string {
  const d = relojDelNegocio(valor);
  const h = d.getUTCHours();
  return `${h % 12 === 0 ? 12 : h % 12}:${dos(d.getUTCMinutes())} ${h < 12 ? "a.m." : "p.m."}`;
}

// "#228"
export function numeroPedido(n: number): string {
  return `#${n}`;
}

// "1 Sopa de res, 1 Pechuga"
export function resumenPlatillos(order: Order): string {
  return order.items.map((item) => `${item.quantity} ${item.dishName}`).join(", ");
}

// "$6" + ".25" (precio con centavos en superíndice, CLAUDE.md §5)
export function partesPrecio(monto: number): { entero: string; centavos: string } {
  const [entero, centavos] = monto.toFixed(2).split(".");
  return { entero: `$${entero}`, centavos: `.${centavos}` };
}

export function redondear(monto: number): number {
  return Math.round(monto * 100) / 100;
}

// Cargo de domicilio: la API no lo separa, se calcula como la diferencia
// entre el total y la suma de platillos (0 si no aplica).
export function cargoDomicilio(order: Order): number {
  const platillos = order.items.reduce((acc, item) => acc + item.subtotal, 0);
  return Math.max(0, redondear(order.total - platillos));
}
