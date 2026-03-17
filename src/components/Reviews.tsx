import { translations, Lang } from '../i18n'
import { ButtonText } from '../shared/ButtonText'
import './Reviews.css'

interface ReviewsProps { lang: Lang }

const avatarColors = ['#e74c3c', '#3498db', '#2ecc71']
const avatarLetters = ['J', 'M', 'S']

export default function Reviews({ lang }: ReviewsProps) {
  const t = translations[lang].reviews

  return (
    <section className="reviews section" id="reviews">
      <div className="container">
        <h2 className="reviews__title">{t.title}</h2>

        <div className="reviews__grid">
          {t.items.map((review, i) => (
            <div className="reviews__card" key={i}>
              <p className="reviews__text">"{review.text}"</p>
              <div className="reviews__author">
                <div className="reviews__avatar" style={{ background: avatarColors[i] }}>
                  {avatarLetters[i]}
                </div>
                <div>
                  <div className="reviews__stars">
                    <span>{review.stars}</span>
                    {/* {'★★★★★'.split('').map((s, j) => <span key={j}>{s}</span>)} */}
                  </div>
                  <div className="reviews__name">{review.name}</div>
                  <div className="reviews__role">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="reviews__subtitle">⏱ {t.subtitle}</p>
        <div className='btn__container'>
          <ButtonText smsStyle={true} text={lang === 'es' ? 'ESCRÍBENOS' : 'TEXT US NOW'} sendOnText='sms:+18325697359?body=Hi,%20I%20want%20an%20offer%20for%20my%20junk%20car.' />
          <ButtonText smsStyle={false} text={lang === 'es' ? 'WHATSAPP' : 'WHATSAPP US'} sendOnText='https://wa.me/18325697359?text=Hi,%20I%20want%20an%20offer%20for%20my%20junk%20car.' />
        </div>
      </div>
    </section>
  )
}
