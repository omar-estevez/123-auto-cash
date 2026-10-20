import { translations, Lang } from '../i18n'
import './Parts.css'

import engine from "../assets/images/engine.webp";
import transmissions from "../assets/images/transmission.webp";
import body from "../assets/images/body.webp";

interface PartsProps { lang: Lang }

const parts = [engine, transmissions, body]

export default function Parts({ lang }: PartsProps) {
  const t = translations[lang].parts

  return (
    <section className="parts section" id="parts">
      <div className="container">
        <div className="parts__header">
          <div>
            <h2 className="parts__title">{t.title}</h2>
            <p className="parts__subtitle-yellow">{lang === 'es' ? 'Repuestos usados de calidad para autos, camionetas y SUVs! Houston y alrededores.' : 'Quality used parts for cars, trucks and SUVs! Houston and surrounding areas.'}</p>
          </div>
          <a href="#quote" className="btn-yellow parts__view-btn">{t.viewInventory}</a>
        </div>

        <div className="parts__grid">
          {t.items.map((item, i) => (
            <div className="parts__card" key={i}>
              <div className="parts__card-img">
                <span className="tag parts__tag">{lang === "es" ? "Consultar" : "Inquire"}</span>
                <img src={parts[i]} alt={item.name} loading="lazy" width="400" height="300" />
              </div>
              <div className="parts__card-body">
                <h3 className="parts__card-name">{item.name}</h3>
                <p className="parts__card-desc">{item.desc}</p>
                <a href={`https://wa.me/18324499104?text=${encodeURIComponent(lang === "es" ? `Hola, busco ${item.name.toLowerCase()}. ¿Qué datos necesitan para confirmar disponibilidad y compatibilidad?` : `Hello, I am looking for ${item.name.toLowerCase()}. What details do you need to confirm availability and fitment?`)}`} target="_blank" rel="noopener noreferrer" className="parts__card-link">
                  {lang === 'en' ? 'Ask for availability →' : 'Consultar disponibilidad →'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
