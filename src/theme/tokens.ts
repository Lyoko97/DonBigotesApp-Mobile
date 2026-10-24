// Traducción 1:1 de design/styles.css (:root) — no modificar valores aquí sin
// actualizar también el prototipo. Solo el líder del equipo toca este archivo
// (ver CLAUDE.md, sección 3).

export const colors = {
  paper: '#FAF8F4',
  surface: '#FFFFFF',
  border: '#E3DCCB',
  borderStrong: '#D6CBAF',

  cafe: '#3A2A1E',
  cafeClaro: '#6B5C4D',
  vino: '#7A2436',
  vinoTinte: '#F4E4E6',
  cobre: '#A9713C',
  cobreTinte: '#F1E6D6',
  verde: '#46613D',
  verdeTinte: '#E6EBE2',
  gris: '#6B6258',
  grisTinte: '#E9E5DD',
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 2,
  md: 4,
  lg: 8,
  pill: 999,
} as const;

// Tamaños de fuente nombrados de styles.css (--fs-*). Los tamaños literales
// que aparecen sueltos en los HTML (11px, 12px, 13px) se usan directo dentro
// de `typography`, igual que en el prototipo.
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

// Colores de las etiquetas de estado de pedido. El texto siempre es café
// (CLAUDE.md sección 5) sin importar el estado — el contraste lo da el
// fondo tintado + borde, nunca el color del texto.
export const orderStatusColors = {
  recibido: { bg: colors.cobreTinte, border: colors.cobre },
  preparacion: { bg: colors.vinoTinte, border: colors.vino },
  listo: { bg: colors.verdeTinte, border: colors.verde },
  entregado: { bg: colors.grisTinte, border: colors.gris },
  // No tiene chip de filtro propio (no está en el mockup C2): solo aparece
  // si se navega directo al detalle de un pedido cancelado.
  cancelado: { bg: colors.grisTinte, border: colors.gris },
} as const;

// ---------------------------------------------------------------------------
// Tipografía
// ---------------------------------------------------------------------------
// RN no soporta fontWeight sobre una fuente custom: cada peso es un
// fontFamily distinto. Por eso no exponemos fontFamily + fontWeight sueltos
// (como en el CSS) sino nombres de familia ya resueltos por peso, y encima
// de ellos, estilos de texto compuestos listos para usar.
//
// Pesos cargados — solo los que de verdad aparecen en styles.css + los HTML
// de design/ (C2, C4) que ya existen. Si una pantalla nueva necesita otro
// peso, se agrega aquí cuando exista su prototipo.
export const fontFamilies = {
  archivoExtraBold: 'Archivo_800ExtraBold',
  plexSansRegular: 'IBMPlexSans_400Regular',
  plexSansMedium: 'IBMPlexSans_500Medium',
  plexSansSemiBold: 'IBMPlexSans_600SemiBold',
  plexSansBold: 'IBMPlexSans_700Bold',
  plexMonoRegular: 'IBMPlexMono_400Regular',
  plexMonoBold: 'IBMPlexMono_700Bold',
} as const;

// Cada entrada corresponde a una combinación real vista en styles.css o en
// design/C2-pedidos.html / design/C4-estadisticas.html. El comentario indica
// la clase CSS de origen.
export const typography = {
  // .mobile-header__date (C2, C4) — título de pantalla
  screenTitle: {
    fontFamily: fontFamilies.archivoExtraBold,
    fontSize: fontSize.displayM,
    lineHeight: 23,
    color: colors.cafe,
  },

  // .mobile-header__eyebrow (C2, C4)
  eyebrow: {
    fontFamily: fontFamilies.plexSansBold,
    fontSize: 11,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: colors.cobre,
  },

  // .tag (Tag) — texto siempre en café, el estado lo marca el fondo/borde
  tagLabel: {
    fontFamily: fontFamilies.plexSansBold,
    fontSize: 11,
    letterSpacing: 0.44,
    textTransform: 'uppercase',
    color: colors.cafe,
  },

  // .chip / .chip--active (Chip)
  chipLabel: {
    fontFamily: fontFamilies.plexSansSemiBold,
    fontSize: 11,
    color: colors.cafeClaro,
  },
  chipLabelActive: {
    fontFamily: fontFamilies.plexSansSemiBold,
    fontSize: 11,
    color: colors.vino,
  },

  // .btn (Button)
  buttonLabel: {
    fontFamily: fontFamilies.plexSansSemiBold,
    fontSize: fontSize.bodyM,
  },

  // .order-card__dishes, texto de cuerpo general
  bodyM: {
    fontFamily: fontFamilies.plexSansRegular,
    fontSize: fontSize.bodyM,
    color: colors.cafeClaro,
  },

  // .rank-item__name (C4)
  bodyMMedium: {
    fontFamily: fontFamilies.plexSansMedium,
    fontSize: fontSize.bodyM,
    color: colors.cafe,
  },

  // .order-card__meta, .modalidad — texto pequeño secundario
  bodyS: {
    fontFamily: fontFamilies.plexSansRegular,
    fontSize: fontSize.bodyS,
    color: colors.cafeClaro,
  },

  // .stat-card__label (StatCard)
  statLabel: {
    fontFamily: fontFamilies.plexSansSemiBold,
    fontSize: fontSize.bodyS,
    letterSpacing: 0.48,
    textTransform: 'uppercase',
    color: colors.cafeClaro,
  },

  // Título de panel en C4 ("Ingresos por turno", "Platillos más vendidos
  // hoy") — estilo inline en el HTML, tamaño literal 13px.
  sectionLabel: {
    fontFamily: fontFamilies.plexSansBold,
    fontSize: 13,
    letterSpacing: 0.52,
    textTransform: 'uppercase',
    color: colors.cafeClaro,
  },

  // .stat-card__value (StatCard)
  monoBoldL: {
    fontFamily: fontFamilies.plexMonoBold,
    fontSize: fontSize.monoL,
    color: colors.cafe,
  },
  // .order-card__num, .order-card__total (OrderCard / Price)
  monoBoldM: {
    fontFamily: fontFamilies.plexMonoBold,
    fontSize: fontSize.bodyL,
    color: colors.cafe,
  },
  // .mobile-counter (C2), .rank-item__count (C4)
  monoBoldS: {
    fontFamily: fontFamilies.plexMonoBold,
    fontSize: fontSize.bodyM,
    color: colors.cafeClaro,
  },
  // .rank-item__pos (C4)
  monoBoldXs: {
    fontFamily: fontFamilies.plexMonoBold,
    fontSize: 12,
    color: colors.cafe,
  },
  // .chart-bars__value (C4)
  monoBoldXxs: {
    fontFamily: fontFamilies.plexMonoBold,
    fontSize: 11,
    color: colors.cafe,
  },
  // .chart-bars__label (C4)
  monoRegularXxs: {
    fontFamily: fontFamilies.plexMonoRegular,
    fontSize: 11,
    color: colors.cafeClaro,
  },
  // span.mono dentro de .order-card__meta (hora del pedido en OrderCard)
  monoRegularS: {
    fontFamily: fontFamilies.plexMonoRegular,
    fontSize: fontSize.bodyS,
    color: colors.cafeClaro,
  },
} as const;
