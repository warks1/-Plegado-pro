# Informe de verificación — v0.15.0-beta

## Superado

- Auditoría UI: 49 componentes TSX, 87 botones, 20 formularios, 146 controles, 0 avisos.
- Verificación estructural: 40 archivos críticos y 39 rutas.
- Transpilación sintáctica: 76 archivos TypeScript/TSX, 0 errores.
- `git diff --check`: sin errores.
- Validación dimensional y comparación de catálogos cubiertas por pruebas unitarias preparadas.

## Pendiente de ejecutar en un equipo con dependencias instaladas

- `npm run build`
- `npm test`
- `npm run test:e2e`
- Revisión visual completa en PC, tablet y smartphone.

## Limitaciones reales

- La comprobación de fuentes puede fallar por CORS, autenticación o falta de API pública.
- El estado CAD oficial exige trazabilidad y validación, pero no sustituye una certificación del fabricante.
- STEP/IGES/DXF/GLB todavía necesitan traductores geométricos especializados.
