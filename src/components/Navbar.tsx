import { useState, useEffect } from 'react'
import { translations, Lang } from '../i18n'
import './Navbar.css';

import logo from "../assets/images/Logo.webp";

interface NavbarProps {
  lang: Lang
}

export default function Navbar({ lang }: NavbarProps) {
  const t = translations[lang].nav
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <a href="#home" className="navbar__logo">
          {/* <span className="navbar__logo-icon">🚗</span> */}
          <div>
            {/* <span className="navbar__logo-main">123</span>
            <h1 className="navbar__logo-sub">AUTO CASH HOUSTON</h1> */}
            <img className='navbar__logo-img' src={logo} alt='123AutoCash' />
          </div>
        </a>

        {/* Desktop Nav */}
        <ul className="navbar__links">
          <li><a href="#inventory">{lang === 'es' ? 'Inventario' : 'Inventory'}</a></li>
          <li><a href="#how-it-works">{t.howItWorks}</a></li>
          <li><a href="#parts">{t.parts}</a></li>
          <li><a href="#faq">{lang === "es" ? "Preguntas" : "FAQ"}</a></li>
        </ul>

        {/* Right side */}
        <div className="navbar__actions">
          <a href="tel:+18324499104" className="navbar__phone">
            <span className="navbar__phone-icon">📞</span>
            {t.phone}
          </a>

          <a className="navbar__lang" href={lang === 'en' ? '/es/' : '/'} hrefLang={lang === 'en' ? 'es' : 'en'} lang={lang === 'en' ? 'es' : 'en'} aria-label={lang === 'en' ? 'Leer en español' : 'Read in English'}>
            {lang === 'en' ? '🇲🇽 ES' : '🇺🇸 EN'}
          </a>
          <a href="#quote" className="btn-yellow">{t.getQuote}</a>
        </div>

        {/* Hamburger Mobile */}
        <div className='navbar__lang__mobile__container'>
          <a className="navbar__lang__mobile" href={lang === 'en' ? '/es/' : '/'} hrefLang={lang === 'en' ? 'es' : 'en'} lang={lang === 'en' ? 'es' : 'en'}>
            {lang === 'en' ? '🇲🇽 Español' : '🇺🇸 English'}
          </a>
        </div>

        <div className='navbar__logo__mobile__container'>
          <a href="#home" className="navbar__logo__mobile">
            <img className='navbar__logo-img' src={logo} alt='123AutoCash' />
          </a>
        </div>


        <div className='navbar__hamburger__container'>
          <button
            className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={lang === "es" ? "Abrir menú" : "Toggle menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span /><span /><span />
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      <div id="mobile-navigation" hidden={!menuOpen} className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        <a href="#inventory" onClick={() => setMenuOpen(false)}>{lang === 'es' ? 'Inventario' : 'Inventory'}</a>
        <a href="#how-it-works" onClick={() => setMenuOpen(false)}>{t.howItWorks}</a>
        <a href="#parts" onClick={() => setMenuOpen(false)}>{t.parts}</a>
        <a href="#faq" onClick={() => setMenuOpen(false)}>{lang === "es" ? "Preguntas" : "FAQ"}</a>
        <a href="tel:+18324499104" className="navbar__phone">{t.phone}</a>
        <a href="#quote" className="btn-yellow" onClick={() => setMenuOpen(false)}>{t.getQuote}</a>
      </div>
    </nav>
  )
}
