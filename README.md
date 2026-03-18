# 🚗 Junker Cash – Landing Page

Landing page bilingüe (EN/ES) para empresa de compra de autos chatarra.

## Stack
- **React 18** + **Vite 5** + **TypeScript**
- CSS Modules por componente (sin dependencias de UI externas)
- Fuentes: Bebas Neue + Barlow + Barlow Condensed (Google Fonts)
- i18n manual con `src/i18n.ts`

## Estructura del proyecto

```
src/
├── components/
│   ├── Navbar.tsx / .css      — Barra de navegación fija + menú móvil
│   ├── Hero.tsx / .css        — Sección principal con auto SVG y oferta
│   ├── QuoteForm.tsx / .css   — Formulario de cotización instantánea
│   ├── Features.tsx / .css    — Remolque gratis, mismo día, mejor precio
│   ├── HowItWorks.tsx / .css  — Pasos 1-2-3 con conector visual
│   ├── Parts.tsx / .css       — Catálogo de partes con SVGs
│   ├── Reviews.tsx / .css     — Testimonios de clientes
│   └── Footer.tsx / .css      — Pie de página con links y contacto
├── i18n.ts                    — Traducciones EN / ES
├── App.tsx                    — Root con toggle de idioma
├── App.css
├── index.css                  — Variables globales, reset, utilidades
└── main.tsx
```

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

## Cambio de idioma
El botón 🇲🇽 ES / 🇺🇸 EN en la navbar (y en el menú móvil) cambia el idioma
de toda la página instantáneamente sin recargar.

## Personalización rápida

- **Colores** → `src/index.css` (variables CSS `:root`)
- **Traducciones / textos** → `src/i18n.ts`
- **Número de teléfono** → busca `1-800-JUNKER` en `Navbar.tsx` y `Footer.tsx`
- **Imágenes reales** → reemplaza los SVGs inline en `Hero.tsx` y `Parts.tsx`
  con `<img src="...">` dentro de los mismos contenedores

## Responsive
- ✅ Mobile (< 768px)
- ✅ Tablet (768px – 1024px)
- ✅ Desktop (> 1024px)


## Deploy
git commit -a -m "cambio"
git push
pnpm run build
npx wrangler pages deploy dist --project-name=123-auto-cash
