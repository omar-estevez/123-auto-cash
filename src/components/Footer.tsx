import { translations, Lang } from '../i18n'
import './Footer.css';

import logo from "../assets/images/Logo.webp";

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
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.address)}`} target="_blank" rel="noopener noreferrer">{t.address}</a>
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
          <details className="privacy-notice"><summary>{lang === 'es' ? 'Privacidad' : 'Privacy'}</summary><p>{lang === 'es' ? 'Medimos cargas de página y clics agregados. Estas estadísticas no guardan datos de formularios, VIN, direcciones IP ni identificadores de visitantes. No usamos cookies publicitarias. Los mensajes se envían desde tu aplicación de WhatsApp o SMS. Para consultas sobre tus datos: 123autocash@gmail.com.' : 'We measure page loads and clicks in aggregate. These statistics do not store form content, VINs, IP addresses or visitor identifiers. We do not use advertising cookies. Messages are sent from your WhatsApp or SMS app. For questions about your data: 123autocash@gmail.com.'}</p></details>

        </div>
      </div>
    </footer>
  )
}
