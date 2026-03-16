import { useEffect, useState } from 'react'
import { translations, Lang } from '../i18n'
import './Hero.css'

import chev from "../assets/images/chev-sec1.png";
import gtr from "../assets/images/gtr-sec1.png";
import suv from "../assets/images/suv-sec1.png";
import truck from "../assets/images/truck-sec1.png";

const images = [chev, gtr, suv, truck];

interface HeroProps { lang: Lang }

export default function Hero({ lang }: HeroProps) {

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const t = translations[lang].hero

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
        setFade(false);
      }, 500);

    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="hero__bg-pattern" />
      <div className="container hero__inner">
        {/* Left */}
        <div className="hero__content">
          <div className="hero__badge animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="hero__badge-dot" />
            {t.badge}
          </div>

          <h1 className="hero__title animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <span className="hero__title-white">{t.title1}</span>
            <br />
            <span className="hero__title-yellow">{t.title2}</span>
          </h1>

          <p className="hero__subtitle animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {t.subtitle}
          </p>

          <div className="hero__actions animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <a href="#quote" className="btn-yellow hero__cta">
              {t.cta}
              <span className="hero__cta-arrow">→</span>
            </a>
            <div className="hero__trust">
              <div className="hero__avatars">
                {['J', 'M', 'S', 'R'].map((l, i) => (
                  <div key={i} className="hero__avatar" style={{ background: ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6'][i] }}>
                    {l}
                  </div>
                ))}
              </div>
              <span className="hero__trust-text">{t.reviews}</span>
            </div>
          </div>
        </div>

        {/* Right – car card */}
        <div className="hero__card animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="hero__car-img">
            <img className='hero__car-img-2' src={images[index]} alt='car' style={{
              maxWidth: 'none',
              opacity: fade ? 0 : 1,
              transition: "opacity 0.5s ease",
              objectFit: 'cover'
            }} />
          </div>
          {/* <div className="hero__offer">
            <div className="hero__offer-label">
              <span className="hero__offer-dot" />
              {t.lastOffer}
            </div>
            <div className="hero__offer-amount">$4,250.00</div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
