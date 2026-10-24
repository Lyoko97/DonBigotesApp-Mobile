# Plan — Módulo de Pedidos (Persona 3)

> Para revisión de Persona 1 (líder). Sigue `CLAUDE.md`, `design/C2-pedidos.html`,
> `design/styles.css` y la interfaz de servicios propuesta en `PLAN-BASE-PROYECTO.md`.

## Qué se construye

- **C2 — Lista de pedidos:** encabezado "Pedidos" con la fecha de hoy en español y el
  contador "N hoy", chips de filtro por estado (Todos · Recibido · En preparación ·
  Listo · Entregado) con scroll horizontal y tarjetas de pedido. Deslizar hacia abajo
  para actualizar.
- **C3 — Detalle de pedido:** desglose de platillos, cargo de domicilio si aplica,
  total, modalidad, método de pago, datos del cliente y botón grande para avanzar
  el estado.
- **Sondeo (polling):** la lista y el detalle se actualizan cada 10 s mientras la
  pantalla está visible y la app está en primer plano.

## Archivos (todos dentro de `src/screens/pedidos/`)

| Archivo | Qué hace |
|---|---|
| `OrdersListScreen.tsx` | Pantalla C2 |
| `OrderDetailScreen.tsx` | Pantalla C3 |
| `estados.ts` | Mapeo de estados, transiciones y etiquetas (adaptado de `reference/orderStatus.ts`) |
| `formato.ts` | Fecha "Viernes 23 de octubre", hora "11:12 a.m.", número "#228", hora de El Salvador |
| `tipos.ts` | Tipo `Order` (copia de `reference/types/order.ts`) |
| `usePolling.ts` | Sondeo con `AppState` |
| `datos/ordersService.ts` | Interfaz `OrdersService` **idéntica** a la del plan base + selector `mock`/`http` |
| `datos/mockAdapter.ts` | Pedidos de prueba con platillos y precios del comedor |
| `datos/httpAdapter.ts` | Llamadas reales a `/api/orders` |
| `provisional/` | `theme.ts`, `Tag`, `Chip`, `Price`, `Button`, `OrderCard` |
| `PedidosPreview.tsx` | Solo para probar en Expo Go mientras no exista la navegación |

**No se toca** `App.tsx`, `src/theme/`, `src/components/`, `src/navigation/` ni
`src/services/`, que son de Persona 1.

## Por qué hay una carpeta `provisional/`

La base (tokens, componentes compartidos, servicios, navegación) aún no está en `main`.
Para no bloquear el avance, Pedidos trae sus propias versiones mínimas con **los mismos
valores de `styles.css` y las mismas props del plan base** (`Tag status`, `Chip label
active onPress`, `Price amount size`, `OrderCard order onPress`). Cuando Persona 1 suba
la base, se borra `provisional/` y se cambian los `import`; las pantallas no cambian.

Lo mismo con `datos/`: implementa exactamente `listOrders`, `getOrder` y `updateStatus`.
Cuando exista `src/services`, las pantallas pasan a usar ese y se borra `datos/`.

## Mapeo de estados (propuesta i.2 de Persona 1, pendiente de aprobación)

| API (`orderStatus.ts`) | Móvil | Tag |
|---|---|---|
| `pendiente` | Recibido | cobre |
| `en_preparacion` | En preparación | vino |
| `listo` | Listo | verde |
| `entregado` | Entregado | gris |
| `cancelado` | No aparece en la lista; en el detalle se ve con tag gris "Cancelado" | — |

Está en una sola constante (`MOSTRAR_CANCELADOS_EN_LISTA` en `estados.ts`), así que si
se decide otra cosa, el cambio es de una línea.

## Decisiones y dudas para Persona 1

1. **Modalidad:** la web usa `local`, `para_llevar` y `domicilio`; el móvil las muestra
   como Local, Retiro y Domicilio.
2. **Cargo de domicilio ($1.00):** la API no lo separa. El detalle lo muestra como
   `total − suma de platillos` cuando la diferencia es mayor que 0; si es 0, no aparece.
3. **`getOrder(id)` en el adaptador http:** la web no tiene `GET /api/orders/[id]`, así
   que se pide la lista y se busca el pedido. Si se agrega ese endpoint, se cambia una
   función.
4. **C3 no tiene prototipo en `design/`.** Se construyó solo con piezas que ya existen en
   `styles.css` (panel, fila de platillo con línea punteada, tag, botón primario) y la
   descripción de `CLAUDE.md`. Si hay un C3 en Figma, se ajusta.
5. **Íconos de modalidad:** C2 los dibuja con SVG. `react-native-svg` todavía no está
   instalado (está en el plan base, pendiente de aprobación), así que por ahora se muestra
   solo el texto.
6. **Fuentes:** todavía no se cargan Archivo / IBM Plex. Las pantallas toman la familia
   de `provisional/theme.ts`, así que basta cambiar ese archivo (o el import a
   `tokens.ts`).
7. **Contraste:** el texto en cobre `#A9713C` sobre papel `#FAF8F4` (eyebrow "PEDIDOS" de
   C2) da 3.87:1. No cumple AA para texto pequeño (4.5:1). Se dejó igual al prototipo
   (regla 9.3) y se reporta aquí. El resto de combinaciones usadas sí cumple: café claro
   sobre papel 6.07:1, vino sobre vino-tinte 8.01:1, café sobre los tintes de los tags
   más de 10:1.
8. **Datos de prueba:** los platillos y precios salen de C2 (todos entre $2.50 y $3.50).
   El adaptador mock agrega un pedido "Recibido" cada cierto tiempo para que el sondeo
   se vea en el video. Se apaga con `SIMULAR_PEDIDOS_NUEVOS = false`.

## Variables de entorno

```
EXPO_PUBLIC_API_ADAPTER=mock   # o http
EXPO_PUBLIC_API_URL=https://don-bigotes-app.vercel.app
```

Con `http`, la API exige el header `Authorization: Bearer`, que depende del cambio en el
repo web (sección 7 de `CLAUDE.md`). Mientras tanto se usa `mock`.
