import { translations, Lang } from '../i18n'
import './Features.css'

interface FeaturesProps { lang: Lang }

const icons = ['🚛', '⚡', '💰']

export default function Features({ lang }: FeaturesProps) {
  const t = translations[lang].features

  return (
    <section className="features section">
      <div className="container">
        <div className="features__grid">
          {t.map((f, i) => (
            <div className="features__card" key={i}>
              <div className="features__icon">{icons[i]}</div>
              <h3 className="features__title">{f.title}</h3>
              <p className="features__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
