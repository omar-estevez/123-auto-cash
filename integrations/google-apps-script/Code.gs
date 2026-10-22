// Private source. Only explicitly selected public fields leave Google Sheets.
const CONFIG = {
  spreadsheetId: '1I42k5kQQEnaNn6iKIu0dYfMRK5aQjLMfLmDnKjJ0XI4',
  sheet: 'Vehiculos',
  photosFolder: '1uxGCkZ8NbytxUZKwo_qG3nZJJ9rWrpEI',
  site: 'https://123autocash.com',
};
function syncInventory() {
  const lock=LockService.getScriptLock(); if(!lock.tryLock(1000))return;
  try {
    const secret=PropertiesService.getScriptProperties().getProperty('INVENTORY_SYNC_SECRET');
    if(!secret||secret.length<32)throw new Error('Configure INVENTORY_SYNC_SECRET in script properties.');
    const allowed=['StockID','Año','Marca','Modelo','Version / Trim','Motor','Transmission','Traccion','Color','Estado'];
    const headers=sheetRead_(["'"+CONFIG.sheet+"'!A1:AG1"])[0].values[0];
    allowed.forEach(h=>{if(headers.indexOf(h)<0)throw new Error('Missing column: '+h);});
    // Read only allowlisted columns; never read VIN or private notes into rows.
    const ranges=allowed.map(h=>{
      let n=headers.indexOf(h)+1,col='';while(n){n--;col=String.fromCharCode(65+n%26)+col;n=Math.floor(n/26);}
      return "'"+CONFIG.sheet+"'!"+col+'2:'+col+'2001';
    });
    const columns=sheetRead_(ranges);
    const count=Math.max(0,...columns.map(c=>(c.values||[]).length));
    if(count>=2000)throw new Error('Inventory exceeds the configured row limit.');
    const values=Array.from({length:count},()=>[]);
    allowed.forEach((h,j)=>{
      const col=headers.indexOf(h);
      (columns[j].values||[]).forEach((r,i)=>{values[i][col]=r[0]||'';});
    });
    const rows=values.filter(r=>String(r[headers.indexOf('Estado')]).trim().toLowerCase()==='en stock').map(r=>{
      const out={}; allowed.forEach(h=>out[h]=r[headers.indexOf(h)]);out.photos=[];return out;
    });
    const ids=new Set(rows.map(r=>r.StockID));
    if(ids.size!==rows.length)throw new Error('Duplicate StockID. Correct it before syncing.');
    rows.forEach(r=>{if(!/^[0-9]{1,10}$/.test(r.StockID)||!r.Marca||!r.Modelo||!/^\d{4}$/.test(r['Año']))throw new Error('Check required fields for stock '+r.StockID);});
    const files=DriveApp.getFolderById(CONFIG.photosFolder).getFiles(),groups={},photos={};
    while(files.hasNext()){
      const file=files.next();
      const match=file.getName().trim().match(/^([0-9]{1,10})(?=[-_.\s]|$)/);
      if(!match||!ids.has(match[1])||!file.getMimeType().startsWith('image/'))continue;
      if(!groups[match[1]])groups[match[1]]=[];
      groups[match[1]].push(file);
    }
    Object.keys(groups).forEach(stock=>{
      groups[stock].sort((a,b)=>a.getName().localeCompare(b.getName())||a.getId().localeCompare(b.getId()))
        .slice(0,6).forEach((file,index)=>{photos[stock+'-'+(index+1)]=file;});
    });
    rows.forEach(row=>{
      for(let position=1;position<=6;position++){
        const file=photos[row.StockID+'-'+position]; if(!file)continue;
        const cacheKey='photo-'+row.StockID+'-'+position;
        const signature=file.getId()+':'+file.getLastUpdated().getTime();
        if(PropertiesService.getScriptProperties().getProperty(cacheKey)===signature){row.photos.push(position);continue;}
        const thumbnail=photoThumbnail_(file);
        if(!thumbnail)throw new Error('Photo thumbnail is not ready for stock '+row.StockID);
        const bytes=thumbnail.getBytes();
        if(bytes.length>300000)throw new Error('Photo thumbnail is too large for stock '+row.StockID);
        post_('/api/photo-sync',{stock:row.StockID,position:position,mime:thumbnail.getContentType(),base64:Utilities.base64Encode(bytes)},secret);
        PropertiesService.getScriptProperties().setProperty(cacheKey,signature);
        row.photos.push(position);
      }
    });
    const result=post_('/api/inventory-sync',{vehicles:rows},secret);
    console.log('Synced '+result.count+' parts vehicles.');
  } finally {lock.releaseLock();}
}
function sheetRead_(ranges){
  const url='https://sheets.googleapis.com/v4/spreadsheets/'+CONFIG.spreadsheetId+'/values:batchGet?valueRenderOption=FORMATTED_VALUE&'+ranges.map(r=>'ranges='+encodeURIComponent(r)).join('&');
  const response=UrlFetchApp.fetch(url,{headers:{Authorization:'Bearer '+ScriptApp.getOAuthToken()},muteHttpExceptions:true});
  if(response.getResponseCode()!==200)throw new Error('Sheet read failed: '+response.getResponseCode());
  return JSON.parse(response.getContentText()).valueRanges;
}
function photoThumbnail_(file){
  const token=ScriptApp.getOAuthToken();
  const meta=UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(file.getId())+'?fields=thumbnailLink',{headers:{Authorization:'Bearer '+token}});
  const link=JSON.parse(meta.getContentText()).thumbnailLink;
  if(!link||!/^https:\/\/[a-z0-9.-]+\.googleusercontent\.com\//i.test(link))throw new Error('Google thumbnail unavailable.');
  // Keep Google's small preview rather than the potentially full-size DriveApp blob.
  return UrlFetchApp.fetch(link,{headers:{Authorization:'Bearer '+token},followRedirects:false}).getBlob();
}
function post_(path,data,secret){
  const response=UrlFetchApp.fetch(CONFIG.site+path,{method:'post',contentType:'application/json',headers:{Authorization:'Bearer '+secret},payload:JSON.stringify(data),muteHttpExceptions:true});
  if(response.getResponseCode()!==200)throw new Error('Sync failed: '+response.getResponseCode());
  return JSON.parse(response.getContentText());
}
function installInventorySync(){
  syncInventory();
  if(!ScriptApp.getProjectTriggers().some(t=>t.getHandlerFunction()==='syncInventory'))ScriptApp.newTrigger('syncInventory').timeBased().everyMinutes(15).create();
}
