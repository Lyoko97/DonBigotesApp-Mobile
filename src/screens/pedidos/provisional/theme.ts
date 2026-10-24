// PROVISIONAL — reemplazar por src/theme/tokens.ts cuando Persona 1 lo suba.
// Valores copiados 1:1 de :root en design/styles.css; no se inventó ninguno.

export const colors = {
  paper: "#FAF8F4",
  surface: "#FFFFFF",
  border: "#E3DCCB",
  borderStrong: "#D6CBAF",
  cafe: "#3A2A1E",
  cafeClaro: "#6B5C4D",
  vino: "#7A2436",
  vinoTinte: "#F4E4E6",
  cobre: "#A9713C",
  cobreTinte: "#F1E6D6",
  verde: "#46613D",
  verdeTinte: "#E6EBE2",
  gris: "#6B6258",
  grisTinte: "#E9E5DD",
} as const;

// --sp-1 … --sp-16
export const spacing = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48, 16: 64 } as const;

export const radius = { sm: 2, md: 4, lg: 8, pill: 999 } as const;

export const fontSize = {
  displayXl: 32,
  displayL: 24,
  displayM: 20,
  bodyL: 16,
  bodyM: 14,
  bodyS: 12,
  monoL: 20,
  monoM: 14,
} as const;

// Las fuentes (Archivo, IBM Plex Sans, IBM Plex Mono) aún no se cargan con
// expo-font. Mientras tanto se deja `undefined` (fuente del sistema) para que
// la app no falle. Cuando Persona 1 cargue las fuentes, poner aquí los
// nombres de @expo-google-fonts, p. ej. "Archivo_800ExtraBold".
export const fonts = {
  display: undefined as string | undefined, // Archivo 800
  body: undefined as string | undefined, // IBM Plex Sans
  mono: undefined as string | undefined, // IBM Plex Mono
} as const;

export const orderStatusColors = {
  recibido: { bg: colors.cobreTinte, border: colors.cobre },
  preparacion: { bg: colors.vinoTinte, border: colors.vino },
  listo: { bg: colors.verdeTinte, border: colors.verde },
  entregado: { bg: colors.grisTinte, border: colors.gris },
  // Fuera de la paleta de 4 (propuesta i.2 del plan base).
  cancelado: { bg: colors.surface, border: colors.gris },
} as const;
