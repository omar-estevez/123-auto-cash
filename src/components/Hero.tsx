import type { Lang } from '../i18n'
import './Hero.css'

export default function Hero({ lang }: { lang: Lang }) {
  const es = lang === 'es'
  return <section className="hero" id="home"><div className="hero__bg-pattern" /><div className="container hero__inner">
    <div className="hero__content">
      <div className="hero__badge">HOUSTON, TEXAS · 123 AUTO CASH</div>
      <h1 className="hero__title"><span className="hero__title-white">{es ? 'Tu carro viejo.' : 'Your old car.'}</span><br /><span className="hero__title-yellow">{es ? 'Una nueva oferta.' : 'A fresh offer.'}</span></h1>
      <p className="hero__subtitle">{es ? '¿Tienes un carro que ya no usas? Cuéntanos sobre él y consulta una oferta. También te ayudamos a encontrar repuestos usados.' : 'Have a car you no longer use? Tell us about it and request an offer. We can also help you find used auto parts.'}</p>
      <div className="hero__actions"><a href="#quote" className="btn-yellow hero__cta">{es ? 'Cotizar mi carro →' : 'Get my car offer →'}</a><a href="tel:+18324499104" className="hero__call">{es ? 'Llamar' : 'Call'} (832) 449-9104</a></div>
      <p className="hero__service">{es ? 'Houston y alrededores · Hablamos español' : 'Houston & surrounding areas · Se habla español'}</p>
    </div>
    <aside className="hero__parts"><span className="tag">{es ? '¿Buscas una parte?' : 'Looking for a part?'}</span><h2>{es ? 'Dale más vida a tu carro.' : 'Keep your car moving.'}</h2><p>{es ? 'Busca por marca, modelo o año entre nuestros carros para partes. Consulta la pieza que necesitas.' : 'Search our parts vehicles by make, model or year. Ask us about the part you need.'}</p><a className="btn-yellow" href="#inventory">{es ? 'Buscar mi vehículo →' : 'Find my vehicle →'}</a><small>{es ? 'Solo venta de partes. Compatibilidad por confirmar.' : 'Parts only. Fitment must be confirmed.'}</small></aside>
  </div></section>
}
