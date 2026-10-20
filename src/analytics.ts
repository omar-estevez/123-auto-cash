type EventName = 'page_view'|'phone'|'whatsapp'|'sms'|'email'|'quote_car_whatsapp'|'quote_car_sms'|'quote_part_whatsapp'|'quote_part_sms'|'inventory_inquiry'|'inventory_filter'|'language'|'directions'|'quote_open'
export function track(event: EventName, placement = 'other', stock = '') {
  if (typeof window === 'undefined' || location.pathname.startsWith('/admin') || !['123autocash.com','www.123autocash.com'].includes(location.hostname)) return
  if (navigator.doNotTrack === '1' || (navigator as Navigator & {globalPrivacyControl?:boolean}).globalPrivacyControl) return
  let source='direct'
  try { const host=new URL(document.referrer).hostname; source=host===location.hostname?'direct':/google\./.test(host)?'google':/bing\./.test(host)?'bing':/facebook|instagram|tiktok/.test(host)?'social':'other' } catch { /* No referrer. */ }
  const data={event,placement,stock,lang:location.pathname.startsWith('/es')?'es':'en',device:matchMedia('(max-width: 800px)').matches?'mobile':'desktop',source}
  fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),keepalive:true}).catch(()=>{})
}
export function startAnalytics() {
  track('page_view')
  document.addEventListener('click',event=>{
    const link=(event.target as HTMLElement).closest?.('a')
    if (!link || link.dataset.tracked) return
    const href=link.getAttribute('href') || ''
    const placement=link.closest('nav')?'nav':link.closest('.hero')?'hero':link.closest('footer')?'footer':link.closest('.fab-container')?'floating':link.closest('#parts')?'parts':link.closest('#quote')?'form':'other'
    const name: EventName | null = href.startsWith('tel:')?'phone':href.includes('wa.me/')?'whatsapp':href.startsWith('sms:')?'sms':href.startsWith('mailto:')?'email':href.includes('google.com/maps')?'directions':link.hasAttribute('hreflang')?'language':href==='#quote'?'quote_open':null
    if(name) track(name,placement)
  })
}
