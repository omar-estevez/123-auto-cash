import { translations, Lang } from '../i18n'
import './QuoteForm.css'
import { ButtonText } from '../shared/ButtonText'

interface QuoteFormProps { lang: Lang }

export default function QuoteForm({ lang }: QuoteFormProps) {
  const t = translations[lang].quote
  // const [submitted, setSubmitted] = useState(false)
  // const [form, setForm] = useState({ year: '', make: '', model: '', condition: '', phone: '' })

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   setForm({ ...form, [e.target.name]: e.target.value })
  // }

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setSubmitted(true)
  //   setTimeout(() => setSubmitted(false), 4000)
  // }

  return (
    <section className="quote section" id="quote">
      <div className="container">
        <div className="quote__card">
          <div className="quote__header">
            <h2 className="quote__title">{t.title}</h2>
            <p className="quote__subtitle">⏱ {t.subtitle}</p>
          </div>

          <div className='btn__container'>
            <ButtonText smsStyle={true}
              text={lang === 'es' ? 'ESCRÍBENOS' : 'TEXT US NOW'}
              sendOnText={lang === 'es' ? 'sms:+18324499104?body=Hola%2C%20quiero%20vender%20mi%20auto%20o%20consultar%20repuestos.%20%C2%BFMe%20puedes%20ayudar%3F' : 'sms:+18324499104?body=Hi%2C%20I%20want%20to%20sell%20my%20car%20or%20check%20parts%20availability.%20Can%20you%20help%20me%3F'}
            />
            <ButtonText
              smsStyle={false}
              text={lang === 'es' ? 'WHATSAPP' : 'WHATSAPP US'}
              sendOnText={lang === 'es' ? 'https://wa.me/18324499104?text=Hola%2C%20quiero%20vender%20mi%20auto%20o%20consultar%20repuestos.%20%C2%BFMe%20puedes%20ayudar%3F' : 'https://wa.me/18324499104?text=Hi%2C%20I%20want%20to%20sell%20my%20car%20or%20check%20parts%20availability.%20Can%20you%20help%20me%3F'}
            />
          </div>


          {/* <form className="quote__form" onSubmit={handleSubmit}>
            <div className="quote__grid">
              <div className="quote__field">
                <label className="quote__label">{t.year}</label>
                <input
                  name="year"
                  className="quote__input"
                  placeholder={t.yearPlaceholder}
                  value={form.year}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="quote__field">
                <label className="quote__label">{t.make}</label>
                <input
                  name="make"
                  className="quote__input"
                  placeholder={t.makePlaceholder}
                  value={form.make}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="quote__field">
                <label className="quote__label">{t.model}</label>
                <input
                  name="model"
                  className="quote__input"
                  placeholder={t.modelPlaceholder}
                  value={form.model}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="quote__field">
                <label className="quote__label">{t.condition}</label>
                <select
                  name="condition"
                  className="quote__input quote__select"
                  value={form.condition}
                  onChange={handleChange}
                  required
                >
                  <option value="">— {t.condition} —</option>
                  {t.conditions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="quote__field quote__field--full">
              <label className="quote__label">{t.phone}</label>
              <input
                name="phone"
                type="tel"
                className="quote__input"
                placeholder={t.phonePlaceholder}
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className={`quote__submit ${submitted ? 'quote__submit--success' : ''}`}>
              {submitted
                ? (lang === 'en' ? '✓ QUOTE SENT!' : '✓ ¡COTIZACIÓN ENVIADA!')
                : t.submit}
            </button>
          </form> */}
        </div>
      </div>
    </section>
  )
}
