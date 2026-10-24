# Bitácora de Decisiones Técnicas

## Persona 2 Módulo de Estadísticas

- **Decisión:** Reutilización directa del módulo de cálculo `reference/dashboardStats.ts`.
- **Alternativas consideradas:** Volver a escribir las funciones de agregación dentro de la pantalla móvil.
- **Por qué se eligió:** Garantiza consistencia total entre los cálculos del panel web y la app móvil (ingresos, turnos, ticket promedio y top 5 platillos) sin duplicar código ni introducir discrepancias.

## Persona 3 Módulo de Pedidos

- **Decisión:** Mapeo de estados API → móvil: `pendiente` → Recibido, `en_preparacion` → En preparación, `listo` → Listo, `entregado` → Entregado; `cancelado` no aparece en la lista y solo se ve en el detalle.
- **Alternativas consideradas:** Agregar un quinto chip "Cancelado"; renombrar los valores de la API.
- **Por qué se eligió:** Respeta los 4 estados del prototipo C2 sin romper el contrato de la API que usan la web y las estadísticas. Es la propuesta i.2 de Persona 1; queda en una constante (`MOSTRAR_CANCELADOS_EN_LISTA`) por si se aprueba otra opción.

- **Decisión:** Sondeo (polling) cada 10 s con `AppState`, pausado cuando la pantalla no está visible o la app pasa a segundo plano.
- **Alternativas consideradas:** WebSockets / notificaciones push; actualizar solo al deslizar hacia abajo.
- **Por qué se eligió:** La API de la web es REST y corre en funciones serverless de Vercel, que no mantienen conexiones abiertas. El sondeo es el mismo mecanismo que usa la web (10 s) y pausarlo evita gastar datos y batería cuando nadie mira la pantalla.

- **Decisión:** Cambio de estado optimista en el detalle: el estado cambia al instante y se revierte si el servidor lo rechaza (por ejemplo, si otro usuario ya movió el pedido).
- **Alternativas consideradas:** Esperar la respuesta del servidor antes de cambiar la pantalla.
- **Por qué se eligió:** En la cocina la acción tiene que sentirse inmediata aun con mala señal; el servidor sigue validando las transiciones y el error se muestra en pantalla.

- **Decisión:** Componentes y servicio provisionales dentro de `src/screens/pedidos/` (`provisional/` y `datos/`) con las mismas props e interfaz que el plan base.
- **Alternativas consideradas:** Esperar a que la base esté en `main`; crear los componentes compartidos en `src/components/`.
- **Por qué se eligió:** La base aún no existe y `src/components`, `src/theme` y `src/services` son de Persona 1. Al respetar el mismo contrato, integrarlo es cambiar imports y borrar esas carpetas.

- **Decisión:** Fecha y hora calculadas con desfase fijo UTC-6 en lugar de `Intl.DateTimeFormat` con zona horaria.
- **Alternativas consideradas:** Reutilizar `reference/format.ts` tal cual.
- **Por qué se eligió:** El soporte de zonas horarias de Hermes (motor de JavaScript de React Native) varía entre dispositivos; El Salvador no tiene horario de verano, así que el resultado es idéntico al de la web.

- **Inconsistencia reportada:** el texto cobre `#A9713C` sobre papel `#FAF8F4` (eyebrow "PEDIDOS" de C2) tiene contraste 3.87:1 y no cumple WCAG AA para texto pequeño (4.5:1). Se mantuvo igual al prototipo hasta que el equipo decida.
