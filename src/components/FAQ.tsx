import type { Lang } from '../i18n'

export default function FAQ({ lang }: { lang: Lang }) {
  const es = lang === 'es'
  const entries = es ? [
    ['¿Qué información necesitan para cotizar mi carro?', 'Envíanos año, marca, modelo, condición y código postal. Agrega fotos y dinos si tienes el título para que podamos revisar tu caso.'],
    ['¿Compran carros que no funcionan?', 'Puedes consultarnos por carros que no arrancan, accidentados o con daños. La oferta depende de la condición y los datos del vehículo.'],
    ['¿Cómo se coordina la recogida?', 'Confirma con nosotros la ubicación, disponibilidad, documentación y condiciones de recogida antes de agendar.'],
    ['¿Cómo sé si una parte es compatible?', 'Comparte año, marca, modelo, motor y la parte que buscas. Si tienes el número de parte o fotos, agrégalos al chat. Confirma compatibilidad, precio, disponibilidad y condiciones antes de comprar.'],
  ] : [
    ['What do you need to quote my car?', 'Send the year, make, model, condition and ZIP code. Add photos and let us know whether you have the title so we can review your vehicle.'],
    ['Do you buy cars that do not run?', 'Ask us about non-running, wrecked or damaged vehicles. Offers depend on vehicle details and condition.'],
    ['How is pickup arranged?', 'Confirm the location, availability, paperwork and pickup terms with us before scheduling.'],
    ['How do I check part compatibility?', 'Share the year, make, model, engine and part you need. Add a part number or photos in the chat if available. Confirm fitment, price, availability and terms before purchasing.'],
  ]
  return <section className="section" id="faq"><div className="container faq"><h2>{es ? 'Preguntas frecuentes' : 'Frequently asked questions'}</h2>{entries.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}<p>{es ? 'Houston, Katy, Pasadena y alrededores. Consulta cobertura con tu código postal.' : 'Houston, Katy, Pasadena and surrounding areas. Ask about coverage with your ZIP code.'}</p></div></section>
}
