# Guía de armado de la banca

[Abrir la guía en GitHub Pages](https://kevincastle.github.io/rascador/) · [Repositorio](https://github.com/KevinCastle/rascador)

Abre `index.html` en un navegador con conexión para cargar three.js y sus controles. El archivo contiene la interfaz, los cálculos y las instrucciones; no necesita instalación ni compilación. Puedes copiarlo al teléfono y abrirlo en su navegador.

Las medidas provienen de `references/plan-rascador.md`. El bosquejo aportado sirve únicamente como referencia de distribución, no de medidas ni colores. El presupuesto conserva los precios aportados; su suma es $190.307 CLP, sin cojín ni velcro cotizados. No se comprobaron precios ni disponibilidad actuales.

Como alternativa en Vercel, usa el preset **Other**, activa Override de Build Command y déjalo vacío. El directorio raíz se sirve como salida estática al no existir `public`. No hay variables de entorno. [Documentación oficial de Vercel](https://vercel.com/docs/builds/configure-a-build#skip-build-step).

## GitHub Pages

Publicado desde **main / (root)**, con **Deploy from a branch** en Settings → Pages. El archivo `.nojekyll` permite servir directamente el HTML, sin procesamiento de Jekyll. Las actualizaciones publicadas en `main` actualizarán el sitio. [Documentación oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

La guía permite explorar variaciones, pero no valida la resistencia de la banca para dos adultos. El montaje real de bisagras y su despeje contra el muro, la fijación del rascador, el ancho real del balcón y la resistencia al agua de la cola siguen pendientes de comprobación.

## Verificación

Datos y medidas: `node --test tests/data.test.cjs`.

Navegador: con Playwright disponible, sirve esta carpeta (`python3 -m http.server 8765 --bind 127.0.0.1`) y ejecuta `node tests/browser.cjs`. La suite genera capturas en `tests/screenshots/` y prueba escritorio1440×900, ancho360, doce pasos, parámetros, tapa, despiece, capas y modo sin conexión a los CDN. No equivale a probar en un teléfono físico.

El registro de implementación y las verificaciones realizadas están en `tasks/todo.md`. El usuario autorizó crear commits para la publicación en GitHub.
