# Plan — Base del proyecto (Persona 1 / líder)

> Borrador de plan para la Capa 1 y Capa 2 del Avance 1. Pendiente de aprobación antes de crear archivos o instalar dependencias. Revisado contra `CLAUDE.md`, `design/styles.css`, `design/C2-pedidos.html`, `design/C4-estadisticas.html` y todo `reference/`.

## i) Dudas e inconsistencias encontradas (léelas antes del resto, afectan el plan)

1. **Faltan prototipos de mi alcance.** `design/` solo tiene `styles.css`, `C2-pedidos.html` y `C4-estadisticas.html`. Las pantallas C1/C1b (login), C3 (detalle), C5 (perfil) y C6 (nuevo usuario) —que son exactamente las que me toca construir en la Capa 2 (login, perfil, nuevo usuario)— no tienen HTML de referencia. Por la regla de la sección 6 ("si una pantalla aún no tiene prototipo, no la inventes"), en la Capa 2 construiré **solo el esqueleto con tokens** para login/perfil/nuevo usuario y lo dejaré marcado como pendiente de prototipo, en vez de inventar layout. Avisar si los prototipos existen en otro lado (Figma) y hay que exportarlos a `design/`.
2. **Mapeo de estados de pedido, pendiente por definir (CLAUDE.md lo dice explícito).** La web (`reference/types/order.ts`, `orderStatus.ts`) tiene 5 estados: `pendiente → en_preparacion → listo → entregado`, más `cancelado` (alcanzable desde cualquier estado en curso). El mockup móvil C2 solo muestra 4 chips/tags: Recibido, En preparación, Listo, Entregado — **no hay "Cancelado"**. Mapeo propuesto para aprobación:
   - `pendiente` → **Recibido** (cobre)
   - `en_preparacion` → **En preparación** (vino)
   - `listo` → **Listo** (verde)
   - `entregado` → **Entregado** (gris)
   - `cancelado` → no aparece en los chips de filtro ni en la lista principal (se excluye de `order-list`), pero sí se puede ver en el detalle si se accede directamente a un pedido cancelado, con un tag adicional fuera de la paleta de 4 (gris con texto "Cancelado"). Esto evita inventar un 5º chip que no está en el mockup, pero no oculta el dato.
   Decisión de Persona 1 porque toca el contrato de tipos que usará Persona 3; no se implementa hasta aprobación.
3. **`reference/dashboardStats.ts` importa de `@/lib/format`** (`roundMoney`, `toBusinessDateKey`, `addDaysToKey`, `startOfWeekKey`, `startOfMonthKey`) y ese archivo no está copiado en `reference/`. Persona 2 (Estadísticas) lo va a necesitar. Pedir ese archivo o, si no se puede obtener del repo web, reimplementar esas funciones de fecha/dinero en `src/lib/format.ts` del móvil documentando que es una reimplementación, no una copia literal (regla de la sección 7).
4. **Cargo de $1.00 a domicilio (sección 8):** ni `reference/types/order.ts` ni `orderValidation.ts` calculan ese cargo — el `total` ya viene resuelto desde el backend. Como el módulo de Pedidos del móvil es de **solo lectura** (lista, filtro, detalle, cambio de estado — no creación, según el reparto de la sección 3 y las pantallas C1-C6), no hay nada que calcular en el móvil: el total ya incluye el cargo si aplica. Queda como nota en `DECISIONES.md`, no como algo que haya que "corregir".
5. **No existe el SVG del bigote** en `design/` ni `assets/`. `styles.css` define `.brand__mark svg` pero el contenido del ícono no está en ningún HTML revisado (C2/C4 no usan `.brand`). Se necesita para la pantalla de login. Pedirlo (export de Figma) o construirlo como vector simple una vez exista el prototipo C1.
6. **Versión de Expo Go en las tiendas vs. SDK más nuevo.** Según la documentación oficial de Expo (actualizada ago-2026) y un agregador de terceros (sep-2026) hay señales contradictorias sobre si Expo Go en App Store/Play Store ya soporta SDK 57 o se quedó en SDK 54. Antes de fijar la versión, pedir al equipo que revise qué build de Expo Go tiene instalado en sus teléfonos (o lo reinstale) y confirmar; si hay duda, bajar a SDK 54 por ser la última confirmada oficialmente en ambas tiendas. Fuentes: [Expo Go version mismatch](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/), [Expo Go and the App Store in May 2026](https://expo.dev/changelog/expo-go-and-app-store-may-2026).

## a) Inicialización de Expo

El directorio no está vacío (`CLAUDE.md`, `design/`, `reference/`, `docs/`), así que no se puede correr `create-expo-app .`. Plan:

1. Crear el proyecto en una carpeta temporal **fuera** del repo: `npx create-expo-app@latest ../dbapp-tmp --template blank-typescript` (plantilla `blank-typescript`, **no** la plantilla `tabs`, porque esa trae `expo-router` y CLAUDE.md pide `@react-navigation` explícito).
2. Verificar el SDK resultante contra el punto i.6 y, si hace falta, fijar `expo` a la versión confirmada en las tiendas (`npx expo install expo@<version>` dentro de la carpeta temporal antes de mover nada).
3. Mover al repo real solo lo necesario, sin tocar `CLAUDE.md`, `design/`, `reference/`, `docs/`, `.git`:
   - `package.json`, `package-lock.json` (o regenerar), `tsconfig.json`, `app.json`, `.gitignore`, `App.tsx` (se reescribe para montar `NavigationContainer` + carga de fuentes), `assets/` (icon/splash por defecto, para reemplazar luego con marca real).
4. Borrar la carpeta temporal.
5. `npm install` dentro del repo real, luego `npx expo install <paquetes>` para las dependencias nativas (ver sección c).
6. Confirmar `"strict": true` en `tsconfig.json` (ya viene así en `expo/tsconfig.base`, se deja explícito).
7. Probar con `npx expo start` y escanear el QR con Expo Go desde al menos un teléfono del equipo antes de dar esta capa por cerrada.

## b) Estructura de carpetas (ajustada)

Igual a la sección 10 de CLAUDE.md, con un detalle adicional (`src/lib/format.ts` por el punto i.3, y separar tipos/adaptadores dentro de `services`):

```
DonBigotesApp-Mobile/
├── CLAUDE.md, README.md, .env.example
├── design/            (solo lectura)
├── reference/         (solo lectura)
├── docs/DECISIONES.md
├── assets/            (icon, splash, fuentes si se embeben localmente)
└── src/
    ├── theme/
    │   ├── tokens.ts
    │   └── useAppFonts.ts
    ├── components/
    │   ├── Tag.tsx, Chip.tsx, Price.tsx, Button.tsx, TextField.tsx
    │   ├── OrderCard.tsx, StatCard.tsx
    │   └── icons/ (wrappers react-native-svg: set tipo Feather + marca)
    ├── screens/
    │   ├── auth/LoginScreen.tsx
    │   ├── pedidos/ (placeholder — Persona 3)
    │   ├── estadisticas/ (placeholder — Persona 2)
    │   └── perfil/ (ProfileScreen.tsx, NewUserScreen.tsx)
    ├── navigation/
    │   ├── RootNavigator.tsx, AuthStack.tsx, AppTabs.tsx, PedidosStack.tsx
    │   └── types.ts (tipos de rutas)
    ├── context/AuthContext.tsx
    ├── services/
    │   ├── types.ts (contrato único)
    │   ├── index.ts (selector http/mock)
    │   ├── http/
    │   └── mock/
    └── lib/
        ├── format.ts (fecha en español, moneda — ver punto i.3)
        └── env.ts
```

## c) Dependencias propuestas (pendiente aprobación antes de instalar)

| Paquete | Para qué |
|---|---|
| `expo` | Core del proyecto managed |
| `@react-navigation/native` | Contenedor de navegación |
| `@react-navigation/native-stack` | Stack de Login, Detalle de pedido, Nuevo usuario |
| `@react-navigation/bottom-tabs` | Tab bar Pedidos/Estadísticas/Perfil |
| `react-native-screens`, `react-native-safe-area-context` | Peer deps obligatorias de react-navigation (vía `expo install`) |
| `axios` | Cliente HTTP del adaptador `http` |
| `expo-secure-store` | Persistencia de sesión (token/usuario) |
| `expo-font` + `@expo-google-fonts/archivo` + `@expo-google-fonts/ibm-plex-sans` + `@expo-google-fonts/ibm-plex-mono` | Las 3 tipografías exactas del sistema visual |
| `expo-splash-screen` | Mantener el splash hasta que las fuentes carguen (evita flash de fuente de sistema) |
| `react-native-svg` | Reproducir pixel a pixel los íconos y la marca (bigote) a partir del path SVG real de `design/`, en vez de adivinar con una librería de iconos genérica — justificación: la regla "prototipo y código deben coincidir" |

Sin librerías de UI (NativeBase, Paper, etc.) — todo se construye con primitivas RN + estos tokens, como exige la sección 4.

## d) `src/theme/tokens.ts`

Traducción 1:1 de **todo** `:root` de `styles.css` (no solo la tabla resumen de CLAUDE.md):

```ts
export const colors = {
  paper: '#FAF8F4', surface: '#FFFFFF',
  border: '#E3DCCB', borderStrong: '#D6CBAF',
  cafe: '#3A2A1E', cafeClaro: '#6B5C4D',
  vino: '#7A2436', vinoTinte: '#F4E4E6',
  cobre: '#A9713C', cobreTinte: '#F1E6D6',
  verde: '#46613D', verdeTinte: '#E6EBE2',
  gris: '#6B6258', grisTinte: '#E9E5DD',
} as const;

export const spacing = { 1:4, 2:8, 3:12, 4:16, 6:24, 8:32, 12:48, 16:64 } as const;
export const radius = { sm:2, md:4, lg:8, pill:999 } as const;

export const fontSize = {
  displayXl:32, displayL:24, displayM:20,
  bodyL:16, bodyM:14, bodyS:12,
  monoL:20, monoM:14,
} as const;

export const orderStatusColors = {
  recibido:    { bg: colors.cobreTinte, border: colors.cobre },
  preparacion: { bg: colors.vinoTinte,  border: colors.vino  },
  listo:       { bg: colors.verdeTinte, border: colors.verde },
  entregado:   { bg: colors.grisTinte,  border: colors.gris  },
};
```

**Nota técnica importante** (va a `DECISIONES.md`): en RN, los *custom fonts* no soportan `fontWeight` encima del family como en CSS — cada peso (600/700/800) es literalmente otro `fontFamily` (`Archivo_700Bold`, `Archivo_800ExtraBold`, etc.). Por eso, en vez de exponer `fontFamily` + `fontWeight` sueltos como en `styles.css`, `tokens.ts` expondrá **estilos de texto compuestos** listos para usar (`textStyles.displayXl`, `textStyles.bodyMBold`, `textStyles.monoL`, …), cada uno ya con la familia/peso correctos. Las fuentes se cargan en `useAppFonts.ts` con `useFonts()` de `expo-font`, combinando los hooks de los 3 paquetes `@expo-google-fonts/*`, y `App.tsx` mantiene el splash visible (`expo-splash-screen`) hasta que resuelva.

## e) Componentes compartidos

| Componente | Props (resumen) | Clase CSS origen |
|---|---|---|
| `Tag` | `status: 'recibido'\|'preparacion'\|'listo'\|'entregado'\|'cancelado'`, `children` | `.tag`, `.tag--*` |
| `Chip` | `label`, `active: boolean`, `onPress` | `.chip`, `.chip--active` |
| `Price` | `amount: number` (dólares), `size?: 'l'\|'m'` | `.dish-row__price` / `.order-card__total` (entero + `<sup>` centavos) |
| `Button` | `variant: 'primary'\|'secondary'\|'icon'`, `label`, `onPress`, `disabled?` | `.btn`, `.btn--primary/secondary/icon` |
| `TextField` | `label`, `value`, `onChangeText`, `error?`, `secureTextEntry?` | no hay clase explícita en los HTML vistos — se construye con `colors.border`/`.select` como referencia más cercana; pendiente de confirmar contra C1/C6 cuando existan |
| `OrderCard` | `order: Order` (o su forma simplificada), `onPress` | `.order-card`, `.order-card__*` |
| `StatCard` | `label`, `value`, `variant?: 'default'\|'mobile'` | `.stat-card`, `.stat-card--mobile` |
| `TabBar` (ícono+label reutilizable, no un navigator aparte) | `icon`, `label`, `focused: boolean` | `.tabbar__item`, `.tabbar__item--active` |

## f) Interfaz de `src/services`

Basado en `reference/types` tal cual (sin inventar campos nuevos):

```ts
// services/types.ts
export interface AuthService {
  login(email: string, password: string): Promise<AuthResult>;
  register(nombre: string, email: string, password: string, role: Role): Promise<AuthResult>;
}

export interface OrdersService {
  listOrders(params?: { status?: OrderStatus; date?: string }): Promise<Order[]>;
  getOrder(id: string): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<OrderActionResult>;
}

export interface StatsService {
  getDashboardSummary(todayKey: string): Promise<DashboardSummary>;
}

export interface Services { auth: AuthService; orders: OrdersService; stats: StatsService; }
```

- `services/index.ts` elige el adaptador leyendo `process.env.EXPO_PUBLIC_API_ADAPTER` (`'http' | 'mock'`, default `'mock'` mientras no exista auth real por token — sección 7).
- `services/mock/` trae datos fijos realistas (platillos $2.50–$3.50, nombres reales del comedor) y usuarios semilla admin/encargado — nunca contraseñas reales, solo las de prueba documentadas en README.
- `services/http/` usa `axios` con `baseURL = EXPO_PUBLIC_API_URL`, pensado para `GET/POST /api/orders`, `PATCH/DELETE /api/orders/[id]`, `GET /api/dishes`; el login real queda **sin implementar** (solo el tipo) hasta que la web tenga el endpoint, tal como pide la sección 7.
- Pedidos y Estadísticas consumen `Order`, `Dish`, `DashboardSummary` importados/adaptados de `reference/types` — no se inventan tipos paralelos.

## g) Navegación y guard

```
RootNavigator (NativeStack)
├── AuthStack            (sin sesión)
│   └── Login
└── AppStack             (con sesión)
    ├── Tabs (BottomTabs)
    │   ├── Pedidos        (placeholder → Persona 3)
    │   ├── Estadisticas   (solo admin — placeholder → Persona 2)
    │   └── Perfil
    ├── DetallePedido      (stack encima de tabs — placeholder → Persona 3)
    └── NuevoUsuario       (stack encima de tabs — solo admin, placeholder → Persona 1 en Capa 2)
```

- `AuthContext` (Capa 2) expone `user`, `role`, `isLoading`, `login`, `logout`.
- El guard vive en `RootNavigator`: sin `user` → solo `AuthStack`; con `user` → `AppStack`, y el tab "Estadísticas" se registra condicionalmente (`role === 'admin'`) en vez de ocultarlo con estilos, para que Encargado ni siquiera pueda navegar ahí por deep link.
- Placeholders de Pedidos/Estadísticas en Capa 1 son una pantalla vacía con el texto "Módulo de X — Persona Y" y los tokens básicos, nada más — no se construye nada de su lógica.

## h) Capa 1 vs Capa 2

Sin cambios respecto a la propuesta original:

- **Capa 1 (directo a `main`):** init de Expo, `tokens.ts`, carga de fuentes, tipos compartidos, `services` con interfaz + adaptador mock, navegación con placeholders y guard por rol, `README.md`, `.env.example`.
- **Capa 2 (rama `feature/auth-perfil` + PR):** Login, validaciones (reusando `reference/validation.ts`), `AuthContext`, Perfil, Nuevo usuario.

## j) Entradas iniciales para `docs/DECISIONES.md`

1. Expo SDK y plantilla elegidos (versión exacta, una vez confirmada contra Expo Go de las tiendas) — alternativa descartada: plantilla `tabs` (trae `expo-router`, incompatible con la navegación pedida).
2. `react-native-svg` como única librería de iconos/marca, para fidelidad pixel a pixel con `design/` — alternativa descartada: `@expo/vector-icons`/Feather, por no garantizar coincidencia exacta de paths y no cubrir la marca del bigote.
3. Fuentes como estilos de texto compuestos en `tokens.ts` (no `fontFamily`+`fontWeight` sueltos) — motivo: limitación de RN con fuentes custom.
4. Mapeo de estados de pedido Recibido/En preparación/Listo/Entregado ↔ `pendiente/en_preparacion/listo/entregado`, y manejo de `cancelado` fuera de los 4 chips — pendiente de aprobación (punto i.2).
5. Pedidos en el módulo móvil es de solo lectura (sin creación) — confirmar que coincide con el reparto de la sección 3 antes de que Persona 3 empiece.
6. Adaptador `mock` como único activo hasta que exista auth real por token en la web (sección 7).

---

**Pendiente de aprobación** antes de crear cualquier archivo o instalar algo. En particular, los puntos **i.1 (prototipos faltantes), i.2 (mapeo de estados) e i.5 (SVG del bigote)** bloquean partes concretas de la Capa 2.
