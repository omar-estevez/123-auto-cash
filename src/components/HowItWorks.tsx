import { translations, Lang } from '../i18n'
import './HowItWorks.css'

interface HowItWorksProps { lang: Lang }

export default function HowItWorks({ lang }: HowItWorksProps) {
  const t = translations[lang].howItWorks

  return (
    <section className="hiw section" id="how-it-works">
      <div className="container">
        <div className="hiw__header">
          <h2 className="hiw__title">
            {lang === 'en'
              ? <><span className="hiw__title-white">HOW IT </span><span className="hiw__title-yellow">WORKS</span></>
              : <><span className="hiw__title-white">CÓMO </span><span className="hiw__title-yellow">FUNCIONA</span></>
            }
          </h2>
          <div className="hiw__underline" />
        </div>

        <div className="hiw__steps">
          {t.steps.map((step, i) => (
            <div className="hiw__step" key={i}>
              <div className="hiw__step-num">{step.num}</div>
              {i < t.steps.length - 1 && <div className="hiw__connector" />}
              <h3 className="hiw__step-title">{step.title}</h3>
              <p className="hiw__step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
