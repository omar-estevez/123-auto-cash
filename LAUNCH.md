# 123 Auto Cash

Sitio bilingüe en inglés (`/`) y español (`/es/`) para compra de carros y venta de partes usadas en Houston. Catálogo por StockID, consultas por WhatsApp/SMS y dashboard privado en `/admin/`.

## Desarrollo y comprobaciones

- `pnpm install --frozen-lockfile`
- `pnpm dev`
- `pnpm build`: TypeScript, Vite, HTML prerenderizado y comprobaciones SEO.
- `pnpm test`: pruebas de privacidad, autenticación y API.
- `pnpm exec wrangler dev`: Worker y D1 local; aplicar antes migraciones locales.

## Publicación

El proyecto existente usa Cloudflare Workers con compilación automática desde `master` del repositorio `omar-estevez/123-auto-cash`. Publicar con commit y push a GitHub. Verificar el despliegue y el dominio al terminar. No publicar directamente desde la máquina.

`server/worker.mjs` sirve las API y los archivos de `dist`. D1 contiene contadores agregados e inventario público. `SETUP.md` documenta autenticación y sincronización privada de Google Sheets/Drive.

El formulario prepara un mensaje; el cliente lo envía desde su aplicación. No se guardan formularios ni se confirma falsamente su envío. Las visitas son cargas de página, no personas únicas, y los clics no son ventas.

Para revertir, revertir el commit y hacer push; no usar force-push.
