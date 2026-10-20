let keyCache = { host: '', until: 0, keys: [] }
const decode = text => Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
export async function authorized(request, env) {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD || !env.ADMIN_EMAIL) return false
  if (!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(env.ACCESS_TEAM_DOMAIN)) return false
  const token = request.headers.get('Cf-Access-Jwt-Assertion')
  if (!token || token.length > 12000) return false
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const header = JSON.parse(new TextDecoder().decode(decode(parts[0])))
    const claims = JSON.parse(new TextDecoder().decode(decode(parts[1])))
    const now = Math.floor(Date.now() / 1000)
    if (header.alg !== 'RS256' || typeof header.kid !== 'string') return false
    if (claims.iss !== `https://${env.ACCESS_TEAM_DOMAIN}` || !Array.isArray(claims.aud) || !claims.aud.includes(env.ACCESS_AUD)) return false
    if (typeof claims.exp !== 'number' || claims.exp <= now || (claims.nbf && claims.nbf > now)) return false
    if (String(claims.email).toLowerCase() !== env.ADMIN_EMAIL.toLowerCase()) return false
    if (keyCache.host !== env.ACCESS_TEAM_DOMAIN || keyCache.until < Date.now() || !keyCache.keys.some(k => k.kid === header.kid)) {
      const response = await fetch(`https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`)
      if (!response.ok) return false
      const { keys } = await response.json()
      if (!Array.isArray(keys)) return false
      keyCache = { host: env.ACCESS_TEAM_DOMAIN, until: Date.now() + 300000, keys }
    }
    const jwk = keyCache.keys.find(k => k.kid === header.kid && k.kty === 'RSA')
    if (!jwk) return false
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
    return crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decode(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]))
  } catch { return false }
}
