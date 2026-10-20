import './App.css'

import type { Lang } from './i18n'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import QuoteForm from './components/Inquiry'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Parts from './components/Parts'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import { FloatingButton } from './shared/FloatingButton'
import ServiceArea from './components/ServiceArea'
import Inventory from './components/Inventory'
import Dashboard from './pages/Dashboard'

export default function App({ initialLang }: { initialLang?: Lang }) {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) return <Dashboard />
  const lang: Lang = initialLang ?? (typeof window !== 'undefined' && window.location.pathname.startsWith('/es') ? 'es' : 'en')

  return (
    <>
      <a className="skip-link" href="#main">{lang === "es" ? "Ir al contenido" : "Skip to content"}</a>
      <Navbar lang={lang} />
      <main id="main">
        <Hero lang={lang} />
        <Inventory lang={lang} />
        <QuoteForm lang={lang} />
        <Features lang={lang} />
        <HowItWorks lang={lang} />
        <Parts lang={lang} />
        <FAQ lang={lang} />
        <ServiceArea lang={lang} />
      </main>
      <Footer lang={lang} />
      <FloatingButton lang={lang} />
    </>
  )
}

/**
 * Website developed by Omar Estevez
 * All rights reserved © 2026
 */
