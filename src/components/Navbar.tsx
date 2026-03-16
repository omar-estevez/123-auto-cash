import { useState, useEffect } from 'react'
import { translations, Lang } from '../i18n'
import './Navbar.css'

interface NavbarProps {
  lang: Lang
  onLangToggle: () => void
}

export default function Navbar({ lang, onLangToggle }: NavbarProps) {
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
        <a href="#" className="navbar__logo">
          {/* <span className="navbar__logo-icon">🚗</span> */}
          <div>
            <span className="navbar__logo-main">123</span>
            <span className="navbar__logo-sub">AUTO CASH</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <ul className="navbar__links">
          <li><a href="#how-it-works">{t.howItWorks}</a></li>
          <li><a href="#parts">{t.parts}</a></li>
          <li><a href="#reviews">{t.reviews}</a></li>
        </ul>

        {/* Right side */}
        <div className="navbar__actions">
          <a href="tel:18005865371" className="navbar__phone">
            <span className="navbar__phone-icon">📞</span>
            {t.phone}
          </a>
          <button className="navbar__lang" onClick={onLangToggle} title="Toggle language">
            {lang === 'en' ? '🇲🇽 ES' : '🇺🇸 EN'}
          </button>
          <a href="#quote" className="btn-yellow">{t.getQuote}</a>
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        <a href="#how-it-works" onClick={() => setMenuOpen(false)}>{t.howItWorks}</a>
        <a href="#parts" onClick={() => setMenuOpen(false)}>{t.parts}</a>
        <a href="#reviews" onClick={() => setMenuOpen(false)}>{t.reviews}</a>
        <a href="tel:18005865371" className="navbar__phone">{t.phone}</a>
        <button className="navbar__lang" onClick={() => { onLangToggle(); setMenuOpen(false) }}>
          {lang === 'en' ? '🇲🇽 Español' : '🇺🇸 English'}
        </button>
        <a href="#quote" className="btn-yellow" onClick={() => setMenuOpen(false)}>{t.getQuote}</a>
      </div>
    </nav>
  )
}
