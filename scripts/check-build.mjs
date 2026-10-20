import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
for (const lang of ['en', 'es']) {
  const html = await readFile(lang === 'es' ? 'dist/es/index.html' : 'dist/index.html', 'utf8')
  assert(html.includes(`<html lang="${lang}">`))
  assert.equal((html.match(/<h1\b/g) || []).length, 1)
  assert(html.includes('6702 Weaver Rd'))
  assert(html.includes(lang === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'))
  assert(html.includes(`rel="canonical" href="https://123autocash.com/${lang === 'es' ? 'es/' : ''}"`))
  assert(html.includes('hreflang="es"') && html.includes('hreflang="en"'))
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  assert.equal(schema['@graph'][2].inLanguage, lang)
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) await access('dist' + match[1])
}
console.log('Build checks passed: static content, language routes, metadata, structured data and assets.')
