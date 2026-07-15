# Plegar Pro v28.5.2 GitHub Pages Startup Fix

Base acumulativa: v28.5.1.

## Error corregido
`ReferenceError: Cannot access 'simStep' before initialization`

La sección Pliegues ejecutaba el renderizado 2D/3D antes de que el estado de simulación estuviera inicializado.

## Solución
- Se separa la creación de pliegues del arranque de las simulaciones.
- `renderBends()` ya no llama a `drawSim()` ni a `draw2D()` durante el arranque temprano.
- Nuevo indicador `PP_SIM_READY`.
- Refresco seguro de las simulaciones después de inicializar `simStep` y `sim2dStep`.
- Diagnósticos retrasados hasta completar el arranque.
- Validación final del motor 2D y 3D.
- Arranque seguro y botón «Entrar sin esperar» conservados.
- Todos los módulos de v28.5.1 conservados.

## GitHub Pages
Sube todos los archivos del ZIP a la raíz del repositorio. Sustituye el `index.html` anterior.
