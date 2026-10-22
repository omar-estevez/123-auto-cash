import { useEffect, useMemo, useState } from 'react'
import type { Lang } from '../i18n'
import initial from '../data/inventory.json'
import publishedPhotos from '../data/inventory-photos.json'
import { track } from '../analytics'

type Vehicle = typeof initial.vehicles[number] & {photos?:number[]}
type InventoryData={updatedAt:string,vehicles:Vehicle[]}
function VehiclePhotos({vehicle,es,live}:{vehicle:Vehicle,es:boolean,live:boolean}) {
  const [index,setIndex]=useState(0),[failed,setFailed]=useState(false)
  const localPhotos=(publishedPhotos as Record<string,string[]>)[vehicle.id]||[]
  const photos=vehicle.photos?.length?vehicle.photos.map(position=>`/api/inventory-photo/${vehicle.id}/${position}`):live?[]:localPhotos
  useEffect(()=>{setIndex(0);setFailed(false)},[vehicle.id,live,vehicle.photos?.join(',')])
  if(!photos.length||failed)return <div className="inventory__photo"><span aria-hidden="true">↗</span><p>{es?'Solicita fotos de la parte':'Ask for photos of the part'}</p><small>STOCK #{vehicle.id}</small></div>
  return <div className="inventory__gallery"><img loading="lazy" width="400" height="250" src={photos[index]||photos[0]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} — ${es?'carro para partes':'parts vehicle'} #${vehicle.id}`} onError={()=>setFailed(true)} /><span>STOCK #{vehicle.id}</span>{photos.length>1&&<button aria-label={es?'Ver siguiente foto':'View next photo'} onClick={()=>setIndex(n=>(n+1)%photos.length)}>{index+1}/{photos.length} →</button>}</div>
}
export default function Inventory({lang}:{lang:Lang}) {
  const es=lang==='es'
  const [data,setData]=useState<InventoryData>(initial)
  const [live,setLive]=useState(false)
  const [make,setMake]=useState('')
  const [year,setYear]=useState('')
  const [query,setQuery]=useState('')
  const [limit,setLimit]=useState(12)
  useEffect(()=>{const controller=new AbortController(); fetch('/api/inventory',{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error();return r.json()}).then(value=>{if(Array.isArray(value.vehicles)&&value.updatedAt){setData(value);setLive(true)}}).catch(()=>{});return()=>controller.abort()},[])
  const makes=useMemo(()=>[...new Set(data.vehicles.map(v=>v.make))].sort(),[data])
  const years=useMemo(()=>[...new Set(data.vehicles.map(v=>v.year))].sort((a,b)=>b-a),[data])
  const vehicles=data.vehicles.filter(v=>(!make||v.make===make)&&(!year||String(v.year)===year)&&`${v.make} ${v.model} ${v.engine} ${v.id}`.toLowerCase().includes(query.trim().toLowerCase()))
  const inquire=(v:Vehicle)=>`https://wa.me/18324499104?text=${encodeURIComponent(es?`Hola, busco partes del ${v.year} ${v.make} ${v.model}, stock #${v.id}. La parte que necesito es: `:`Hello, I need parts for the ${v.year} ${v.make} ${v.model}, stock #${v.id}. The part I need is: `)}`
  return <section className="section inventory" id="inventory"><div className="container">
    <div className="inventory__heading"><div><span className="tag">{es?'CARROS PARA PARTES':'PARTS VEHICLES'}</span><h2>{es?'Encuentra el carro. Consulta tu parte.':'Find the vehicle. Ask for your part.'}</h2></div><p>{es?'Vehículos para desarme. No se venden completos. Confirma existencia y compatibilidad de cada pieza.':'Dismantling inventory. Vehicles are not sold complete. Confirm availability and fitment of each part.'}</p></div>
    <div className="inventory__filters">
      <label>{es?'Buscar modelo, motor o stock':'Search model, engine or stock'}<input type="search" value={query} onChange={e=>{setQuery(e.target.value);setLimit(12)}} placeholder={es?'Ej. Ram 1500, Corolla, 5.7L':'e.g. Ram 1500, Corolla, 5.7L'} /></label>
      <label>{es?'Marca':'Make'}<select value={make} onChange={e=>{setMake(e.target.value);setLimit(12);track('inventory_filter','inventory')}}><option value="">{es?'Todas las marcas':'All makes'}</option>{makes.map(m=><option key={m}>{m}</option>)}</select></label>
      <label>{es?'Año':'Year'}<select value={year} onChange={e=>{setYear(e.target.value);setLimit(12);track('inventory_filter','inventory')}}><option value="">{es?'Todos los años':'All years'}</option>{years.map(y=><option key={y}>{y}</option>)}</select></label>
    </div>
    <p className="inventory__count" role="status">{vehicles.length} {es?'vehículos para consultar':'vehicles to inquire about'} · {es?'Actualizado':'Updated'} {new Date(data.updatedAt).toLocaleDateString(es?'es-US':'en-US',{timeZone:'America/Chicago'})}{!live && (es?' · Confirma la disponibilidad actual':' · Confirm current availability')}</p>
    <div className="inventory__grid">{vehicles.slice(0,limit).map(v=><article className="inventory__card" key={v.id}>
      <VehiclePhotos vehicle={v} es={es} live={live} />
      <div className="inventory__body"><p className="inventory__year">{v.year} · {es?'SOLO PARTES':'PARTS ONLY'}</p><h3>{v.make} {v.model}</h3><p>{v.trim}</p><dl><div><dt>{es?'Motor':'Engine'}</dt><dd>{v.engine||'—'}</dd></div><div><dt>{es?'Transmisión':'Transmission'}</dt><dd>{v.transmission||'—'}</dd></div><div><dt>{es?'Tracción':'Drivetrain'}</dt><dd>{v.drivetrain||'—'}</dd></div></dl><a className="btn-yellow" data-tracked="true" onClick={()=>track('inventory_inquiry','inventory',v.id)} href={inquire(v)} target="_blank" rel="noopener noreferrer">{es?'Consultar partes →':'Ask about parts →'}</a></div>
    </article>)}</div>
    {vehicles.length===0&&<div className="inventory__empty"><h3>{es?'No hay coincidencias con esos filtros':'No vehicles match these filters'}</h3><p>{es?'Podemos ayudarte a consultar otras partes.':'We can help you check for other parts.'}</p><button className="btn-yellow" onClick={()=>{setMake('');setYear('');setQuery('')}}>{es?'Limpiar filtros':'Clear filters'}</button><a href="#quote">{es?'Consultar una parte':'Ask about a part'}</a></div>}
    {vehicles.length>limit&&<button className="btn-yellow inventory__more" onClick={()=>setLimit(n=>n+12)}>{es?'Mostrar más vehículos':'Show more vehicles'}</button>}
  </div></section>
}
