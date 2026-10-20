import assert from 'node:assert/strict';
const base='http://127.0.0.1:8787';
for(const [path,status] of [['/',200],['/es/',200],['/admin/',200],['/admin/api/stats',403],['/api/inventory',503],['/not-a-real-page',404]]) {
 const r=await fetch(base+path);assert.equal(r.status,status,path);console.log(path,r.status);
}
const r=await fetch(base+'/api/events',{method:'POST',headers:{Origin:base,'Content-Type':'application/json','User-Agent':'Local integration verification'},body:JSON.stringify({event:'page_view',lang:'es',device:'mobile',source:'direct',placement:'other'})});
assert.equal(r.status,204); console.log('Local D1 event accepted:',r.status);
