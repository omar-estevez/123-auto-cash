import { useState, type FormEvent } from 'react'
import type { Lang } from '../i18n'
import './QuoteForm.css'
import { track } from '../analytics'

export default function Inquiry({ lang }: { lang: Lang }) {
  const es = lang === 'es'
  const [kind, setKind] = useState('car')
  const [notice, setNotice] = useState(false)
  const [preparedUrl, setPreparedUrl] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const channel = (event.nativeEvent as SubmitEvent).submitter?.getAttribute('value')
    const message = [
      es ? 'Hola 123 Auto Cash.' : 'Hello 123 Auto Cash.',
      kind === 'car' ? (es ? 'Quiero vender mi carro.' : 'I want to sell my car.') : (es ? 'Busco un repuesto.' : 'I am looking for a part.'),
      `${es ? 'Vehículo' : 'Vehicle'}: ${data.get('year')} ${data.get('make')} ${data.get('model')}`,
      kind === 'car' ? `${es ? 'Condición' : 'Condition'}: ${data.get('condition')}` : `${es ? 'Repuesto' : 'Part'}: ${data.get('part')}`,
      `ZIP: ${data.get('zip')}`,
      `${es ? 'Detalles' : 'Details'}: ${data.get('details') || '—'}`,
    ].join('\n')
    const encoded = encodeURIComponent(message)
    track(`quote_${kind === 'car' ? 'car' : 'part'}_${channel === 'sms' ? 'sms' : 'whatsapp'}`, 'form')
    const url = channel === 'sms' ? `sms:+18324499104?body=${encoded}` : `https://wa.me/18324499104?text=${encoded}`
    setPreparedUrl(url)
    if (channel === 'sms') window.location.href = url
    else window.open(url, '_blank', 'noopener,noreferrer')
    setNotice(true)
  }
  return <section className="quote section" id="quote">
    <div className="container"><div className="quote__card">
      <div className="quote__header">
        <h2 className="quote__title">{es ? '¿En qué te ayudamos?' : 'How can we help?'}</h2>
        <p className="quote__subtitle">{es ? 'Cuéntanos qué tienes o qué necesitas. Te atenderemos en español o inglés.' : 'Tell us what you have or what you need. English and Spanish spoken.'}</p>
      </div>
      <form className="quote__form" onSubmit={submit} onChange={() => setNotice(false)}>
        <label className="quote__field"><span className="quote__label">{es ? 'Quiero' : 'I want to'}</span>
          <select className="quote__input quote__select" value={kind} onChange={e => setKind(e.target.value)}>
            <option value="car">{es ? 'Vender mi carro' : 'Sell my car'}</option>
            <option value="part">{es ? 'Comprar un repuesto' : 'Buy a part'}</option>
          </select>
        </label>
        <div className="quote__grid">
          <label className="quote__field"><span className="quote__label">{es ? 'Año' : 'Year'}</span><input name="year" type="number" min="1900" max={new Date().getFullYear() + 1} required className="quote__input" placeholder="2015" /></label>
          <label className="quote__field"><span className="quote__label">{es ? 'Marca' : 'Make'}</span><input name="make" required maxLength={60} className="quote__input" placeholder="Ford, Toyota, Honda…" /></label>
          <label className="quote__field"><span className="quote__label">{es ? 'Modelo' : 'Model'}</span><input name="model" required maxLength={60} className="quote__input" placeholder="F-150, Camry, Civic…" /></label>
          <label className="quote__field"><span className="quote__label">{es ? 'Código postal' : 'ZIP code'}</span><input name="zip" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} required className="quote__input" placeholder="77028" title={es ? '5 dígitos' : '5 digits'} /></label>
        </div>
        {kind === 'car' ? <label className="quote__field"><span className="quote__label">{es ? 'Condición del carro' : 'Vehicle condition'}</span>
          <select name="condition" className="quote__input quote__select" required defaultValue=""><option value="" disabled>{es ? 'Selecciona una opción' : 'Select an option'}</option>
            {(es ? ['Funciona', 'No funciona', 'Accidentado', 'Inundado'] : ['Running', 'Not running', 'Accident damaged', 'Flood damaged']).map(v => <option key={v}>{v}</option>)}
          </select></label> : <label className="quote__field"><span className="quote__label">{es ? 'Repuesto que necesitas' : 'Part you need'}</span><input name="part" required maxLength={120} className="quote__input" placeholder={es ? 'Motor, transmisión, puerta…' : 'Engine, transmission, door…'} /></label>}
        <label className="quote__field"><span className="quote__label">{es ? 'Detalles adicionales (opcional)' : 'Additional details (optional)'}</span><textarea name="details" maxLength={600} rows={3} className="quote__input" placeholder={es ? 'Motor, kilometraje, título o número de parte. Puedes agregar fotos en el chat.' : 'Engine, mileage, title status or part number. You can add photos in the chat.'} /></label>
        <p className="quote__subtitle">{es ? 'Se abrirá tu aplicación con el mensaje preparado. Revisa los datos y pulsa enviar allí. No se envía ni guarda una solicitud en este sitio.' : 'Your app will open with a prepared message. Review it and press send there. This site does not send or store a request.'}</p>
        <div className="inquiry-actions"><button className="quote__submit" type="submit" value="whatsapp">{es ? 'Continuar en WhatsApp' : 'Continue in WhatsApp'}</button><button className="quote__submit" type="submit" value="sms">{es ? 'Continuar por SMS' : 'Continue by SMS'}</button></div>
        {notice && <div role="status"><p>{es ? 'Completa el envío en tu aplicación. Si no se abrió, usa este enlace:' : 'Complete sending in your app. If it did not open, use this link:'}</p><a className="btn-yellow" href={preparedUrl} target={preparedUrl.startsWith('https:') ? '_blank' : undefined} rel="noopener noreferrer">{es ? 'Abrir mi mensaje' : 'Open my message'}</a><p>{es ? 'O llámanos al ' : 'Or call us at '}<a href="tel:+18324499104">(832) 449-9104</a>.</p></div>}
      </form>
    </div></div>
  </section>
}
