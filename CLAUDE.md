# CLAUDE.md — DonBigotesApp-Mobile

Contexto y reglas para Claude Code en este repositorio. Léelo completo antes de proponer o escribir código. Si algo de aquí contradice una instrucción puntual del usuario, avisa antes de actuar.

## 1. Qué es este proyecto

DonBigotesApp es un proyecto de cátedra (curso de desarrollo de aplicaciones multiplataforma) para un negocio real: **Comedor y Taquería "Don Bigotes"**, un comedor familiar en Colonia Las Brisas, Soyapango, El Salvador.

El sistema completo tiene tres partes:

1. **Bot de WhatsApp** (clientes): ven el menú, piden y consultan el estado. Los clientes se quedan en WhatsApp.
2. **App web** (Next.js, repo aparte `DonBigotesApp`): panel administrativo con autenticación, menú del día, pedidos y dashboard. Desplegada en Vercel: https://don-bigotes-app.vercel.app
3. **App móvil** (este repo): React Native con Expo y TypeScript.

**Este repo es la Etapa 3 del curso (implementación móvil).** La entrega actual es el **Avance 1** (15% de la nota). Fecha límite aproximada: domingo 25 de octubre de 2026 (confirmar hora exacta con el docente).

## 2. Alcance de la app móvil

**Es una app de uso interno para el personal del comedor, no para clientes.** Quienes la usan:

- **Admin (dueño):** ve Pedidos, Estadísticas y Perfil; puede crear usuarios del personal.
- **Encargado (mesero):** ve Pedidos y Perfil. No ve Estadísticas ni puede crear usuarios.

No hay registro público. La "pantalla de registro" es el formulario de nuevo usuario, solo accesible para admin desde Perfil.

**El Menú del día NO está en la app móvil.** Se gestiona solo en la web. No lo agregues.

### Requerimientos del Avance 1 (de la rúbrica)
1. Autenticación (login/registro) funcional.
2. Módulo principal con navegación entre pantallas.
3. Diseño coherente con los mockups de Figma (Etapa 1).
4. Validaciones de formularios.
5. Documento PDF en APA 7 sobre React Native y Figma aplicados al proyecto.

Entregables: repositorio GitHub + video de demostración (máx. 15 min) + PDF.

Criterios de evaluación: (1) diseño e implementación de pantallas, coherentes con el diseño y con componentes reutilizables y buenas prácticas multiplataforma; (2) funcionalidad completa y robusta; (3) documentación que justifique cada decisión con base en React Native y Figma, con capturas y análisis propio. Prioriza coherencia visual, que todo funcione sin errores y que las decisiones queden documentadas.

## 3. Equipo y reparto

Tres integrantes, cada uno con su rama y sus commits.

| Persona | Responsabilidad en móvil |
|---|---|
| Persona 1 (líder) | Base del proyecto (tokens, componentes compartidos, navegación, servicios), login, perfil, nuevo usuario |
| Persona 2 | Módulo de Estadísticas |
| Persona 3 | Módulo de Pedidos (lista, filtros, detalle, cambio de estado, polling) |

Reglas de trabajo en equipo:
- Una rama por integrante o por módulo (`feature/...`). `main` solo recibe cambios por Pull Request revisado por el líder.
- **Solo el líder modifica** `src/theme/tokens.ts`, la navegación y la interfaz de servicios. Si necesitas un cambio ahí, pídelo; no lo hagas por tu cuenta.
- Trabaja solo dentro del alcance de la persona que te está usando. No implementes módulos de otras personas.
- Los commits los hace cada persona manualmente. Claude Code no ejecuta comandos de git que modifiquen el repositorio (add, commit, push, branch, checkout, reset); al terminar cada bloque de trabajo propone un mensaje de commit en español (`feat(pedidos): ...`, `fix(auth): ...`, `docs: ...`) y la lista de archivos afectados, y espera.

## 4. Stack

- React Native con **Expo** y **TypeScript** estricto.
- Navegación: `@react-navigation/native` con native-stack y bottom-tabs.
- Cliente HTTP: `axios`.
- Sesión: `expo-secure-store`.
- Fuentes: `expo-font` con `@expo-google-fonts/archivo`, `ibm-plex-sans` e `ibm-plex-mono`.
- **Sin librerías de UI externas** (nada de NativeBase, Paper, Tamagui, etc.). Los componentes se construyen con primitivas de React Native.
- Antes de instalar una dependencia nueva, justifícala y pide aprobación. Fija versiones compatibles con el SDK de Expo instalado (`npx expo install` cuando aplique).

## 5. Sistema visual (fuente de verdad)

`design/styles.css` y los HTML de `design/` son la fuente de verdad del diseño; son los prototipos que se reconstruyeron en Figma. **No inventes colores, tamaños ni estilos.** Todos los valores salen de `src/theme/tokens.ts`, que replica los tokens de `:root` de `styles.css`.

Valores clave:

| Token | Valor |
|---|---|
| paper (fondo) | `#FAF8F4` |
| surface | `#FFFFFF` |
| border / border-strong | `#E3DCCB` / `#D6CBAF` |
| café (texto) / café-claro | `#3A2A1E` / `#6B5C4D` |
| vino / vino-tinte | `#7A2436` / `#F4E4E6` |
| cobre / cobre-tinte | `#A9713C` / `#F1E6D6` |
| verde / verde-tinte | `#46613D` / `#E6EBE2` |
| gris / gris-tinte | `#6B6258` / `#E9E5DD` |
| Radios | sm 2, md 4, lg 8, pill 999 |
| Espaciado | base 4: 4, 8, 12, 16, 24, 32, 48, 64 |

Tipografía: **Archivo** (títulos, 600-800), **IBM Plex Sans** (cuerpo), **IBM Plex Mono** (números, horas, precios). **Prohibido usar Inter.**

Reglas visuales:
- Diseño plano: sin sombras, sin gradientes, un solo color por gráfico.
- **Precios:** siempre dos decimales, con entero grande y centavos en superíndice (`$6` + `.25`). Crea un componente `Price` reutilizable.
- Etiquetas de estado (`Tag`): fondo tintado, borde del color de estado y **texto siempre en café** para garantizar contraste.
- Colores de estado de pedido: Recibido = cobre, En preparación = vino, Listo = verde, Entregado = gris.
- El bigote (logo) aparece **solo** en la pantalla de login. En ningún otro lugar.
- Todo texto debe cumplir contraste WCAG AA. Si dudas, calcula el ratio antes de usar la combinación.
- La app debe verse como una versión ligera del panel web, no como un producto distinto.

## 6. Pantallas

Referencias en `design/` (390×844):

| Código | Pantalla | Notas |
|---|---|---|
| C1 / C1b | Login y login con errores | Correo + contraseña. Muestra errores de validación y de credenciales |
| C2 | Lista de pedidos | Encabezado con fecha y contador, chips de filtro por estado (scroll horizontal), tarjetas |
| C3 | Detalle de pedido | Desglose, modalidad, método de pago, total, botón grande para avanzar estado |
| C4 | Estadísticas | Período diario/semanal/mensual, tarjetas, ingresos por turno, top 5 platillos |
| C5 | Perfil | Nombre, correo, rol, "Nuevo usuario" (solo admin), "Cerrar sesión" |
| C6 | Nuevo usuario | Nombre, correo, contraseña, confirmar contraseña, rol (solo admin) |

Navegación: tab bar inferior con Pedidos · Estadísticas (solo admin) · Perfil. Detalle de pedido y Nuevo usuario van en un stack encima de las tabs. Un guard de navegación redirige a login sin sesión y oculta lo que el rol no permite.

Si una pantalla aún no tiene prototipo en `design/`, no la inventes: pide el prototipo o construye solo el esqueleto con los tokens.

## 7. Datos, API y autenticación

- URL base de la API en `EXPO_PUBLIC_API_URL` (ver `.env.example`). Nunca escribas la URL dentro del código. Nunca subas `.env`.
- La capa `src/services` expone una interfaz única con **dos adaptadores**: `http` (API real de la web) y `mock` (datos locales). Se elige con una variable de entorno. Las pantallas nunca llaman a axios directamente.
- Endpoints de la web:
  - `GET /api/dishes` (público).
  - `GET/POST /api/orders`, `PATCH/DELETE /api/orders/[id]`.
- La autenticación real por token (`POST /api/auth/login`, header `Authorization: Bearer`) depende de un cambio en el repo web que está en curso. **Hasta que exista, usa el adaptador mock.** No inventes endpoints que no existan.
- Limitaciones conocidas (documéntalas, no las "arregles" a escondidas):
  - Los datos del backend web viven en memoria en Vercel y se reinician en cada cold start.
  - Los usuarios creados desde la app no se comparten con la web; solo funcionan en el móvil los usuarios semilla (admin y encargado).
- En `reference/` hay copias de lógica de la web para reutilizar sin reescribir: `types`, `validation.ts`, `orderValidation.ts`, `orderStatus.ts`, `dashboardStats.ts`. Reutiliza esas reglas; si hay que adaptarlas, indícalo en un comentario.

## 8. Reglas de negocio y datos

- **Estados de pedido (móvil):** Recibido · En preparación · Listo · Entregado. El mapeo contra los estados del código web (`orderStatus.ts`) está **por definir**; propón el mapeo y espera aprobación antes de implementarlo.
- **Modalidad:** Local · Retiro · Domicilio. El domicilio suma $1.00 al total.
- **Fecha:** siempre calculada a partir de la fecha actual, en español (por ejemplo "Viernes 28 de agosto"). Nada de fechas fijas en el código.
- **Turnos (Estadísticas):** ingresos por Mañana y Noche. Corte configurable en una constante, por defecto 15:00 (por confirmar con el comedor).
- **Top de platillos:** orden por unidades vendidas descendente; desempate alfabético.
- **Ticket promedio:** ingresos / número de pedidos.
- Usa datos reales del comedor (platillos y precios entre $2.50 y $3.50). Prohibido lorem ipsum y platillos o etiquetas inventados.

## 9. Forma de trabajar

1. **Plan antes de código.** Para cualquier tarea no trivial, entrega primero un plan corto (archivos, decisiones, dudas) y espera aprobación.
2. **Verifica antes de dar algo por terminado:** que compile (`npx tsc --noEmit`), que el linter pase y que la pantalla se vea igual que el prototipo.
3. **Prototipo y código deben coincidir.** Si detectas una inconsistencia (contraste, etiqueta, dato), repórtala; no la corrijas por tu cuenta en silencio.
4. **Componentes reutilizables** (`Tag`, `Chip`, `Price`, `OrderCard`, `StatCard`, `Button`, `TextField`), sin estilos duplicados entre pantallas.
5. **Bitácora de decisiones.** Cada vez que tomes o propongas una decisión técnica o de diseño relevante, agrega una entrada breve a `docs/DECISIONES.md` (qué se decidió, alternativas y por qué). Ese archivo alimenta el documento PDF de la entrega.
6. No toques archivos fuera del alcance de la tarea. No borres ni reescribas código de otras personas.
7. Nunca incluyas secretos, contraseñas reales ni claves en el repo. Las credenciales mock de prueba van solo en el adaptador mock y en el README.

## 10. Estructura de carpetas esperada

```
DonBigotesApp-Mobile/
├── CLAUDE.md
├── README.md
├── .env.example
├── design/            (styles.css y prototipos HTML — solo lectura)
├── reference/         (lógica copiada de la web — solo lectura)
├── docs/
│   └── DECISIONES.md
├── assets/
└── src/
    ├── theme/         (tokens.ts, fuentes)
    ├── components/
    ├── screens/
    ├── navigation/
    ├── context/       (AuthContext)
    ├── services/      (interfaz + adaptadores http y mock)
    └── lib/
```

`design/` y `reference/` son material de consulta: no se editan.
