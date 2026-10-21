# Configuración operativa

## Publicación
Publicar únicamente con commit y push al repositorio GitHub existente. Cloudflare Workers compila con `pnpm run build` y publica `dist`. `server/worker.mjs` contiene la entrada de las API. No usar `wrangler pages deploy` como flujo alternativo.

## Estadísticas y acceso privado
Crear una base D1 para este proyecto, aplicar `migrations/0001_initial.sql` y vincularla al Worker como `DB`. Las métricas son contadores diarios en zona America/Chicago. Las cargas no equivalen a personas únicas y los clics no equivalen a conversiones confirmadas. Se excluyen bots conocidos y preferencias DNT/GPC. Bloqueadores, recargas y bots no reconocidos afectan los totales.

Crear una aplicación Cloudflare Access para `123autocash.com/admin` y `123autocash.com/admin/*`, permitiendo solo el correo del propietario, con código por correo o su proveedor de identidad. Configurar en el Worker `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` y `ADMIN_EMAIL`. La API verifica firma, emisor, audiencia, caducidad y correo, también desde workers.dev. Sin configuración deniega el acceso. El dashboard está en `/admin/`; no contiene cifras simuladas.

## Google Sheets y fotos
Fuente: `Vehiculos`. Solo salen StockID, año, marca, modelo, versión, motor, transmisión, tracción y color, para filas con Estado `En stock`. VIN, notas y ubicación interna no salen. El servidor repite el filtro. El catálogo usa una copia revisada al inicio y consulta la API. Si falla, indica confirmar disponibilidad. El HTML indexable cambia con el build; el catálogo interactivo puede actualizarse sin push.

Los nombres de fotos deben comenzar con StockID, por ejemplo `1002- Polaris Slingshot 2017.JPG` o `1002-1.jpg`. Se agrupan hasta seis imágenes por carro, ordenadas por nombre e ID de archivo. Elegir fotos sin VIN visibles, documentos ni datos de clientes. La web recibe miniaturas, no enlaces de Drive ni nombres originales. El filtro de texto no elimina VIN fotografiados.

En Apps Script vinculado a la hoja, añadir `integrations/google-apps-script/Code.gs` y su manifiesto. Guardar una clave aleatoria de al menos 32 caracteres en Script Properties como `INVENTORY_SYNC_SECRET` y la misma clave como secret del Worker. Nunca colocarla en la hoja, repositorio ni navegador público. Ejecutar `installInventorySync` y autorizar lectura de Sheets/Drive, solicitudes externas y el disparador. Primero sincroniza, después instala la actualización cada 15 minutos. No requiere hacer públicos la hoja ni Drive. Las miniaturas se copian a Cloudflare; los originales quedan privados.

## Posicionamiento orgánico
Versiones `/` y `/es/`, HTML prerenderizado, canonical, hreflang, sitemap y datos estructurados coherentes. No se prometen posiciones. Completar/verificar Google Business Profile con nombre, dirección, teléfono, horarios y fotos reales; solicitar reseñas reales. Verificar el dominio en Search Console y enviar `/sitemap.xml`. No se han creado verificaciones, fichas ni reseñas ficticias.

## Verificación
`pnpm run build` comprueba HTML bilingüe, assets y SEO. `node --test --test-isolation=none tests/security.test.mjs` verifica privacidad, autenticación, fotos y telemetría. Probar WhatsApp/SMS en teléfono real. No se enviaron mensajes a clientes durante las pruebas.

