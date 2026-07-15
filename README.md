# Plegar Pro v28.5.1 GitHub Pages Hotfix

Base acumulativa: v28.5.0.

## Corrección principal
La pantalla del logo ya no puede bloquear indefinidamente la aplicación en GitHub Pages.

## Cambios
- Arranque seguro independiente del resto de módulos.
- El logo se cierra aunque un módulo falle.
- Botón «Entrar sin esperar».
- Panel visible con el error de arranque.
- Inicialización protegida módulo por módulo.
- `index.html` preparado para GitHub Pages.
- `404.html` de respaldo.
- Archivo `.nojekyll`.
- Todos los módulos anteriores conservados.

## Publicación
Sube todos los archivos del ZIP a la raíz del repositorio. En GitHub Pages selecciona la rama principal y la carpeta `/ (root)`.
