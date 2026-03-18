import { translations, Lang } from '../i18n'
import './Footer.css';

import logo from "../assets/images/Logo.png";

interface FooterProps { lang: Lang }

export default function Footer({ lang }: FooterProps) {
  const t = translations[lang].footer

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              {/* <span>🚗</span> */}
              <div>
                {/* <span className="footer__logo-main">123</span>
                <span className="footer__logo-sub">AUTO CASH</span> */}
                <img className='footer__logo-img' src={logo} alt='123AutoCash' />
              </div>
            </div>
            <p className="footer__desc">{t.desc}</p>
            <div className="footer__social">
              <a href="#" className="footer__social-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="footer__social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">{t.quickLinks}</h4>
            <ul className="footer__links">
              {t.links.map((link, i) => (
                <li key={link}><a href={t.redirect[i]}>{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">{t.contact}</h4>
            <ul className="footer__contact-list">
              <li>
                <span className="footer__contact-icon">📞</span>
                <a href="tel:+18324499104">+1 (832)-449-9104</a>
              </li>
              <li>
                <span className="footer__contact-icon">📍</span>
                <span>{t.address}</span>
              </li>
              <li>
                <span className="footer__contact-icon">✉️</span>
                <a href={`mailto:${t.email}`}>{t.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__rights">{t.rights}</p>
          <div className="footer__bottom-links">
            <a href="#">{t.privacy}</a>
            <a href="#">{t.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
