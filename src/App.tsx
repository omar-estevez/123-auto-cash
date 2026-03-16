import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import QuoteForm from './components/QuoteForm'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Parts from './components/Parts'
import Reviews from './components/Reviews'
import Footer from './components/Footer'
import type { Lang } from './i18n'
import './App.css'

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const toggleLang = () => setLang(l => l === 'en' ? 'es' : 'en')

  return (
    <>
      <Navbar lang={lang} onLangToggle={toggleLang} />
      <main>
        <Hero lang={lang} />
        <QuoteForm lang={lang} />
        <Features lang={lang} />
        <HowItWorks lang={lang} />
        <Parts lang={lang} />
        <Reviews lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  )
}
