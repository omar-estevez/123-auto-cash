import { translations, Lang } from '../i18n'
import './Parts.css'

import engine from "../assets/images/engine.png";
import tires from "../assets/images/tires.png";
import body from "../assets/images/body.png";

interface PartsProps { lang: Lang }

const parts = [engine, tires, body]

export default function Parts({ lang }: PartsProps) {
  const t = translations[lang].parts

  return (
    <section className="parts section" id="parts">
      <div className="container">
        <div className="parts__header">
          <div>
            <h2 className="parts__title">{t.title}</h2>
            <p className="parts__subtitle-yellow">{lang === 'es' ? 'Venta de Partes' : 'Parts for Sale'}</p>
          </div>
          <a href="#" className="btn-yellow parts__view-btn">{t.viewInventory}</a>
        </div>

        <div className="parts__grid">
          {t.items.map((item, i) => (
            <div className="parts__card" key={i}>
              <div className="parts__card-img">
                <span className="tag parts__tag">{item.label}</span>
                <img src={parts[i]} alt='123 auto cash' />
              </div>
              <div className="parts__card-body">
                <h3 className="parts__card-name">{item.name}</h3>
                <p className="parts__card-desc">{item.desc}</p>
                <a href="#" className="parts__card-link">
                  {lang === 'en' ? 'View details →' : 'Ver detalles →'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
