import { build } from 'vite'
import { readFile, writeFile, mkdir } from 'node:fs/promises'

await build({ build: { ssr: 'src/prerender.tsx', outDir: '.prerender', emptyOutDir: true, rollupOptions: { output: { entryFileNames: 'render.mjs' } } }, publicDir: false })
const { render } = await import('../.prerender/render.mjs')
const template = await readFile('dist/index.html', 'utf8')
const origin = 'https://123autocash.com'
const alternates = `<link rel="alternate" hreflang="en" href="${origin}/" /><link rel="alternate" hreflang="es" href="${origin}/es/" /><link rel="alternate" hreflang="x-default" href="${origin}/" />`
for (const lang of ['en', 'es']) {
  const es = lang === 'es'
  const url = origin + (es ? '/es/' : '/')
  const title = es ? 'Compra de carros y repuestos en Houston | 123 Auto Cash' : 'Cash for Junk Cars & Used Auto Parts Houston | 123 Auto Cash'
  const description = es ? 'Vende tu carro o consulta motores, transmisiones y repuestos usados en Houston, Katy y Pasadena. Atención en español. Llama al (832) 449-9104.' : 'Sell your junk car or ask about used engines, transmissions and auto parts in Houston, Katy and Pasadena. Call or text (832) 449-9104. Se habla español.'
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'AutomotiveBusiness', '@id': origin + '/#business', name: '123 Auto Cash', url: origin + '/', logo: origin + '/logo.png', image: origin + '/logo.png', telephone: '+1-832-449-9104', email: '123autocash@gmail.com', description,
        address: { '@type': 'PostalAddress', streetAddress: '6702 Weaver Rd', addressLocality: 'Houston', addressRegion: 'TX', postalCode: '77028', addressCountry: 'US' },
        areaServed: ['Houston', 'Katy', 'Pasadena'].map(name => ({ '@type': 'City', name })),
        contactPoint: { '@type': 'ContactPoint', telephone: '+1-832-449-9104', contactType: 'customer service', availableLanguage: ['English', 'Spanish'] },
      },
      { '@type': 'WebSite', '@id': origin + '/#website', url: origin + '/', name: '123 Auto Cash', inLanguage: ['en', 'es'], publisher: { '@id': origin + '/#business' } },
      { '@type': 'WebPage', '@id': url + '#webpage', url, name: title, description, inLanguage: lang, isPartOf: { '@id': origin + '/#website' }, about: { '@id': origin + '/#business' } },
    ],
  }
  let html = template.replace('<html lang="en">', `<html lang="${lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description"[\s\S]*?\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />${alternates}`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" /><meta property="og:locale" content="${es ? 'es_US' : 'en_US'}" /><meta property="og:locale:alternate" content="${es ? 'en_US' : 'es_US'}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${description}" />`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .replace('<div id="root"></div>', `<div id="root">${render(lang)}</div>`)
  const directory = es ? 'dist/es' : 'dist'
  await mkdir(directory, { recursive: true })
  await writeFile(`${directory}/index.html`, html)
}
console.log('Pre-rendered English and Spanish pages with localized search metadata.')
await mkdir('dist/admin', { recursive: true })
await writeFile('dist/admin/index.html', template.replace(/<title>[\s\S]*?<\/title>/,'<title>Dashboard privado | 123 Auto Cash</title>').replace('</head>','<meta name="robots" content="noindex,nofollow" /></head>'))
