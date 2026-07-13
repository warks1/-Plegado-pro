# Plegar Pro v19.8

Demo profesional de programación y simulación de plegado de chapa.

## Abrir la aplicación

La aplicación web comienza en `index.html`.

## Publicar con GitHub Pages

Este repositorio ya incluye el flujo:

`.github/workflows/deploy-pages.yml`

Después de subirlo a GitHub:

1. Abre **Settings**.
2. Entra en **Pages**.
3. En **Build and deployment**, selecciona **GitHub Actions**.
4. Abre la pestaña **Actions** y comprueba que finaliza `Deploy Plegar Pro to GitHub Pages`.
5. GitHub mostrará la dirección pública de la aplicación.

## Conversor CAD

La carpeta `server/` contiene el servidor Node.js para conversión CAD.

GitHub Pages solo puede publicar archivos estáticos y no ejecuta Node.js. Para usar el conversor CAD:

```bash
npm install
npm start
```

El servidor se inicia por defecto en:

```text
http://localhost:8787
```

DXF y SVG tienen conversión básica. STEP e IGES pueden usar FreeCAD cuando está instalado. DWG y formatos CAD propietarios necesitan conversores o SDK compatibles.

## Versión

- Aplicación: Plegar Pro v19.8
- Build: 2026.07.12-1980
