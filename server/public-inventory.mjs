const vinPattern = /\b[A-HJ-NPR-Z0-9]{17}\b/gi
const safe = (value, max = 90) => String(value ?? '').replace(vinPattern, '[private]').trim().slice(0, max)

// Explicit allowlist: never spread a spreadsheet row into public data.
export function publicInventory(rows) {
  if (!Array.isArray(rows) || rows.length > 2000) throw new Error('Invalid inventory')
  const seen = new Set()
  return rows.flatMap(row => {
    const id = String(row.StockID ?? row.id ?? '').trim()
    const status = String(row.Estado ?? row.status ?? '').trim().toLowerCase()
    if (!/^[0-9]{1,10}$/.test(id) || !['en stock', 'available'].includes(status)) return []
    if (seen.has(id)) throw new Error('Duplicate stock ID')
    seen.add(id)
    const year = Number(row['Año'] ?? row.year)
    if (!Number.isInteger(year) || year < 1900 || year > new Date().getUTCFullYear() + 1) return []
    const make = safe(row.Marca ?? row.make, 40)
    const model = safe(row.Modelo ?? row.model, 60)
    if (!make || !model) return []
    const photos = Array.isArray(row.photos) ? [...new Set(row.photos.filter(n => Number.isInteger(n) && n >= 1 && n <= 6))].sort((a,b)=>a-b) : []
    return [{ id, year, make, model, trim: safe(row['Version / Trim'] ?? row.trim), engine: safe(row.Motor ?? row.engine), transmission: safe(row.Transmission ?? row.transmission), drivetrain: safe(row.Traccion ?? row.drivetrain), color: safe(row.Color ?? row.color, 30), status: 'available', photos }]
  })
}
