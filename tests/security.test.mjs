import test from 'node:test'
import assert from 'node:assert/strict'
import { publicInventory } from '../server/public-inventory.mjs'
import { authorized } from '../server/access.mjs'
import { handleApi } from '../server/api.mjs'
import { decodePhoto,syncAuthorized } from '../server/photos.mjs'
const row={StockID:'1002','Año':'2017',Marca:'Polaris',Modelo:'Slingshot',Estado:'En stock',VIN:'1HGCM82633A004352',Notas:'Private notes',Ubicacion:'Private location',photos:[1,2,99,'https://example.org']}
test('Only active cars and allowlisted fields leave the private inventory',()=>{
  const data=publicInventory([row,{...row,StockID:'1003',Estado:'Agotado'}]);assert.equal(data.length,1)
  for(const key of ['VIN','Notas','Ubicacion'])assert(!Object.hasOwn(data[0],key))
  assert(!JSON.stringify(data).includes(row.VIN));assert.deepEqual(data[0].photos,[1,2])
  assert.throws(()=>publicInventory([row,row]),/Duplicate/)
  assert.equal(publicInventory([{...row,StockID:row.VIN}]).length,0)
  assert(!publicInventory([{...row,Motor:row.VIN}])[0].engine.includes(row.VIN))
})
test('Dashboard is denied when unconfigured or given a forged token',async()=>{
  assert.equal(await authorized(new Request('https://123autocash.com/admin/api/stats'),{}),false)
  const response=await handleApi(new Request('https://123autocash.com/admin/api/stats'),{DB:{}});assert.equal(response.status,403)
})

test('Private Google reader can read statistics but cannot write inventory',async()=>{
  const key='read-only-test-key-'.repeat(3);
  const env={DASHBOARD_READ_SECRET:key,INVENTORY_SYNC_SECRET:'separate-write-key-'.repeat(3),DB:{prepare:()=>({bind:()=>({all:async()=>({results:[]})}),first:async()=>null})}};
  const req=(path,method='GET',secret=key)=>new Request('https://123autocash.com'+path,{method,headers:{Authorization:'Bearer '+secret}});
  assert.equal((await handleApi(req('/admin/api/stats'),env)).status,200);
  assert.equal((await handleApi(req('/admin/api/stats','GET','wrong'),env)).status,403);
  assert.equal((await handleApi(req('/admin/api/stats','POST'),env)).status,403);
  assert.equal((await handleApi(req('/api/inventory-sync','POST'),env)).status,401);
  assert.equal((await handleApi(req('/api/photo-sync','POST'),env)).status,401);
});
test('Access requires valid signature, audience, expiry and owner email',async()=>{
  const keys=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify'])
  const jwk=await crypto.subtle.exportKey('jwk',keys.publicKey);jwk.kid='test-key'
  const original=globalThis.fetch;globalThis.fetch=async()=>Response.json({keys:[jwk]})
  const env={ACCESS_TEAM_DOMAIN:'autocash-test.cloudflareaccess.com',ACCESS_AUD:'test-audience',ADMIN_EMAIL:'owner@example.test'}
  const encode=x=>Buffer.from(JSON.stringify(x)).toString('base64url')
  const make=async extra=>{
    const h=encode({alg:'RS256',kid:'test-key'}),p=encode({iss:'https://'+env.ACCESS_TEAM_DOMAIN,aud:[env.ACCESS_AUD],exp:Math.floor(Date.now()/1000)+60,email:env.ADMIN_EMAIL,...extra})
    const sig=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',keys.privateKey,new TextEncoder().encode(h+'.'+p))
    return new Request('https://123autocash.com/admin/api/stats',{headers:{'Cf-Access-Jwt-Assertion':h+'.'+p+'.'+Buffer.from(sig).toString('base64url')}})
  }
  try{assert(await authorized(await make({}),env));assert(!await authorized(await make({email:'other@example.com'}),env));assert(!await authorized(await make({aud:['wrong']}),env));assert(!await authorized(await make({exp:0}),env))}finally{globalThis.fetch=original}
})
test('Sync requires the configured secret; images cannot be SVG or disguised HTML',async()=>{
  const env={INVENTORY_SYNC_SECRET:'x'.repeat(40)}
  assert(!await syncAuthorized(new Request('https://123autocash.com/api/inventory-sync'),env))
  assert(await syncAuthorized(new Request('https://123autocash.com/api/inventory-sync',{headers:{Authorization:'Bearer '+env.INVENTORY_SYNC_SECRET}}),env))
  assert.throws(()=>decodePhoto({stock:'1002',position:1,mime:'image/jpeg',base64:Buffer.from('<html>not an image</html>').toString('base64')}))
})
test('Telemetry rejects cross-origin and arbitrary events without persisting form data',async()=>{
  let stored
  const env={DB:{prepare:()=>({bind:(...args)=>({run:async()=>{stored=args}})})}}
  const send=(origin,event)=>new Request('https://123autocash.com/api/events',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','User-Agent':'Browser'},body:JSON.stringify({event,lang:'es',device:'mobile',source:'google',placement:'form',VIN:row.VIN,details:'Private customer data'})})
  assert.equal((await handleApi(send('https://evil.example','page_view'),env)).status,403)
  assert.equal((await handleApi(send('https://123autocash.com','arbitrary'),env)).status,400)
  assert.equal((await handleApi(send('https://123autocash.com','page_view'),env)).status,204)
  assert(!JSON.stringify(stored).includes(row.VIN));assert(!JSON.stringify(stored).includes('Private customer data'))
})

