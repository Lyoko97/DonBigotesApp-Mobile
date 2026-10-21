# Bitácora de Decisiones Técnicas

## Persona 2 Módulo de Estadísticas

- **Decisión:** Reutilización directa del módulo de cálculo `reference/dashboardStats.ts`.
- **Alternativas consideradas:** Volver a escribir las funciones de agregación dentro de la pantalla móvil.
- **Por qué se eligió:** Garantiza consistencia total entre los cálculos del panel web y la app móvil (ingresos, turnos, ticket promedio y top 5 platillos) sin duplicar código ni introducir discrepancias.