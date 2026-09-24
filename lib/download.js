/** Call from a user interaction in the browser. */
export function downloadCsv(rows, filename) {
  const csv='\ufeff'+rows.map(row=>row.map(value=>{
    let text=String(value??'');
    if (/^[=+\-@\t\r]/.test(text)) text="'"+text;
    return '"'+text.replaceAll('"','""')+'"';
  }).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=filename;link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
