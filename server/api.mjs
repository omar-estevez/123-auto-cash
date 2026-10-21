import { authorized } from './access.mjs'
import { publicInventory } from './public-inventory.mjs'
import { syncAuthorized,decodePhoto } from './photos.mjs'

const events = new Set(['page_view','phone','whatsapp','sms','email','quote_car_whatsapp','quote_car_sms','quote_part_whatsapp','quote_part_sms','inventory_inquiry','inventory_filter','language','directions','quote_open'])
const json = (body, status = 200, extra = {}) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra } })
const chicagoDate = () => new Intl.DateTimeFormat('en-CA', {timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())
async function body(request, limit) {
  if (Number(request.headers.get('Content-Length')) > limit) throw new Error('Too large')
  const reader = request.body?.getReader()
  if (!reader) throw new Error('Missing body')
  let text = '', size = 0
  const decoder = new TextDecoder()
  while (true) { const { value, done } = await reader.read(); if (done) break; size += value.byteLength; if (size > limit) { await reader.cancel(); throw new Error('Too large') }; text += decoder.decode(value, {stream:true}) }
  return JSON.parse(text + decoder.decode())
}
export async function handleApi(request, env) {
  const url = new URL(request.url)
  const path = url.pathname
  if (!path.startsWith('/api/') && !path.startsWith('/admin/api/')) return null
  // A separate read-only key is held only by the owner's private Google panel.
  const privateReader = path === '/admin/api/stats' && request.method === 'GET' && await syncAuthorized(request,{INVENTORY_SYNC_SECRET:env.DASHBOARD_READ_SECRET})
  if (path.startsWith('/admin/api/') && !privateReader && !await authorized(request, env)) return json({error:'Sign in with the authorized administrator account.'},403)
  if (!env.DB) return json({error:'Service is not configured yet.'},503)
  try {
    if (path === '/api/events' && request.method === 'POST') {
      if (request.headers.get('Origin') !== url.origin || request.headers.get('Sec-Fetch-Site') === 'cross-site') return json({error:'Forbidden'},403)
      if (request.headers.get('DNT') === '1' || request.headers.get('Sec-GPC') === '1') return new Response(null,{status:204})
      const ua=request.headers.get('User-Agent') || ''
      if (/bot|crawler|spider|headless/i.test(ua)) return new Response(null,{status:204})
      const value = await body(request, 1024)
      if (!events.has(value.event) || !['en','es'].includes(value.lang) || !['mobile','desktop'].includes(value.device)) return json({error:'Invalid event'},400)
      const stock = /^[0-9]{1,10}$/.test(value.stock || '') ? value.stock : ''
      const source = ['google','bing','social','direct','other'].includes(value.source) ? value.source : 'other'
      const placement = ['nav','hero','form','inventory','parts','footer','floating','other'].includes(value.placement) ? value.placement : 'other'
      // Store counters only: no IP, visitor identifier, query, VIN or form content.
      await env.DB.prepare('INSERT INTO metrics(day,event,lang,device,source,placement,stock,count) VALUES(?,?,?,?,?,?,?,1) ON CONFLICT(day,event,lang,device,source,placement,stock) DO UPDATE SET count=count+1').bind(chicagoDate(),value.event,value.lang,value.device,source,placement,stock).run()
      return new Response(null,{status:204})
    }
    if (path === '/api/inventory' && request.method === 'GET') {
      const record = await env.DB.prepare("SELECT payload,updated_at FROM inventory WHERE id=1").first()
      if (!record) return json({error:'Inventory is not connected yet.'},503)
      // Reapply the allowlist even to stored data.
      return json({vehicles:publicInventory(JSON.parse(record.payload)),updatedAt:record.updated_at},200,{'Cache-Control':'public, max-age=60'})
    }
    if (path === '/admin/api/stats' && request.method === 'GET') {
      const days = ['7','30','90'].includes(url.searchParams.get('days')) ? Number(url.searchParams.get('days')) : 30
      const today=chicagoDate()
      const since=new Date(`${today}T12:00:00Z`); since.setUTCDate(since.getUTCDate()-days+1)
      const rows = await env.DB.prepare('SELECT day,event,lang,device,source,placement,stock,count FROM metrics WHERE day >= ? AND day <= ? ORDER BY day').bind(since.toISOString().slice(0,10),today).all()
      const inventory=await env.DB.prepare('SELECT updated_at FROM inventory WHERE id=1').first()
      return json({rows:rows.results,days,today,timezone:'America/Chicago',inventoryUpdatedAt:inventory?.updated_at ?? null})
    }
    const photoPath = path.match(/^\/api\/inventory-photo\/([0-9]{1,10})\/([1-6])$/)
    if (photoPath && request.method === 'GET') {
      const inventory=await env.DB.prepare('SELECT payload FROM inventory WHERE id=1').first()
      const vehicle=inventory&&publicInventory(JSON.parse(inventory.payload)).find(v=>v.id===photoPath[1]&&v.photos.includes(Number(photoPath[2])))
      if (!vehicle) return json({error:'Not found'},404)
      const photo=await env.DB.prepare('SELECT mime,bytes FROM photos WHERE stock=? AND position=?').bind(photoPath[1],Number(photoPath[2])).first()
      if (!photo) return json({error:'Not found'},404)
      return new Response(Array.isArray(photo.bytes)?new Uint8Array(photo.bytes):photo.bytes,{headers:{'Content-Type':photo.mime,'X-Content-Type-Options':'nosniff','Cache-Control':'public,max-age=60'}})
    }
    if (path === '/api/photo-sync' && request.method === 'POST') {
      if (!await syncAuthorized(request,env)) return json({error:'Unauthorized'},401)
      const data=await body(request,450000)
      const bytes=decodePhoto(data)
      await env.DB.prepare('INSERT INTO photos(stock,position,mime,bytes) VALUES(?,?,?,?) ON CONFLICT(stock,position) DO UPDATE SET mime=excluded.mime,bytes=excluded.bytes').bind(data.stock,data.position,data.mime,bytes.buffer).run()
      return json({ok:true})
    }
    if (path === '/api/inventory-sync' && request.method === 'POST') {
      if (!env.INVENTORY_SYNC_SECRET || env.INVENTORY_SYNC_SECRET.length < 32) return json({error:'Sync not configured'},503)
      const provided = request.headers.get('Authorization') || ''
      const expected = 'Bearer ' + env.INVENTORY_SYNC_SECRET
      const digest = async s => new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))
      const [a,b]=await Promise.all([digest(provided),digest(expected)])
      if (a.reduce((n,v,i)=>n | (v ^ b[i]),0)!==0) return json({error:'Unauthorized'},401)
      const data = await body(request, 750000)
      const vehicles = publicInventory(data.vehicles)
      const updatedAt = new Date().toISOString()
      await env.DB.prepare('INSERT INTO inventory(id,payload,updated_at) VALUES(1,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,updated_at=excluded.updated_at').bind(JSON.stringify(vehicles),updatedAt).run()
      return json({count:vehicles.length,updatedAt})
    }
    return json({error:'Not found'},404)
  } catch { return json({error:'The request could not be processed.'},400) }
}
