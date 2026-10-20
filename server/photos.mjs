export async function syncAuthorized(request,env) {
  if (!env.INVENTORY_SYNC_SECRET || env.INVENTORY_SYNC_SECRET.length < 32) return false
  const digest=async s=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))
  const [a,b]=await Promise.all([digest(request.headers.get('Authorization')||''),digest('Bearer '+env.INVENTORY_SYNC_SECRET)])
  return a.reduce((n,v,i)=>n | (v ^ b[i]),0)===0
}
export function decodePhoto(data) {
  if(!/^[0-9]{1,10}$/.test(data.stock)||!Number.isInteger(data.position)||data.position<1||data.position>6||!['image/jpeg','image/png','image/webp'].includes(data.mime)||typeof data.base64!=='string')throw new Error('Invalid photo')
  const bytes=Uint8Array.from(atob(data.base64),c=>c.charCodeAt(0))
  if(bytes.length>300000||bytes.length<12)throw new Error('Invalid photo size')
  const valid=data.mime==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:data.mime==='image/png'?bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71:new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP'
  if(!valid)throw new Error('Invalid image format')
  return bytes
}
