/* TOPwork VINA v3.0: enhanced public UI behaviors */
(function(){
'use strict';
const get=id=>document.getElementById(id);
const region=get('company-region'),text=get('company-query'),checked=get('only-checked'),reset=get('reset-filters'),shell=get('map-shell');
if(!region||!text||!checked||!reset||!shell){console.warn('TOPWORK UI elements missing');return;}
const update=()=>{if(typeof renderCompanies==='function')renderCompanies();if(typeof refreshMarkers==='function')refreshMarkers();};
checked.addEventListener('change',update);
reset.addEventListener('click',()=>{checked.checked=false;region.value='';text.value='';update();text.focus();});
shell.dataset.view='map';
document.querySelectorAll('[data-map-mode]').forEach(btn=>btn.addEventListener('click',()=>{
 const mode=btn.dataset.mapMode==='list'?'list':'map';
 shell.dataset.view=mode;
 document.querySelectorAll('[data-map-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
 if(mode==='map'&&typeof map!=='undefined'&&map){window.setTimeout(()=>map.invalidateSize(),30);}
}));
const modal=get('modal');let focusBefore=null;
if(modal){
 const observer=new MutationObserver(()=>{
  if(!modal.hidden){focusBefore=document.activeElement;const closer=modal.querySelector('button.close');if(closer)closer.focus();}
  else if(focusBefore?.isConnected){focusBefore.focus();focusBefore=null;}
 });
 observer.observe(modal,{attributes:true,attributeFilter:['hidden']});
 modal.addEventListener('keydown',e=>{
  if(e.key!=='Tab'||modal.hidden)return;
  const list=[...modal.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled])')].filter(n=>n.getClientRects().length);
  if(!list.length)return;
  if(e.shiftKey&&document.activeElement===list[0]){e.preventDefault();list[list.length-1].focus();}
  else if(!e.shiftKey&&document.activeElement===list[list.length-1]){e.preventDefault();list[0].focus();}
 });
}
const data=window.TOPWORK_DATA||{},snapshot=data.asOf;
if(snapshot){
 const date=new Date(snapshot+'T12:00:00');
 if(!Number.isNaN(date.valueOf())){
  const display=new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'}).format(date);
  const note=document.createElement('p');note.className='snapshot-note';
  note.textContent='Dữ liệu demo xuất ngày '+display+'. Đây không phải ngày xác minh tuyển dụng.';
  const heading=document.querySelector('#company-map .section-heading');
  if(heading)heading.appendChild(note);
 }
}
const verified=(data.companies||[]).filter(c=>c.verification).length;
const directory=document.querySelector('.directory-head');
if(directory){
 const hint=document.createElement('small');hint.className='directory-hint';
 hint.textContent=verified+' mục có nguồn đối chiếu địa điểm ban đầu · chưa xác nhận đang tuyển';
 directory.insertAdjacentElement('afterend',hint);
}
const numJobs=(data.jobs||[]).filter(j=>j.status==='PUBLISHED').length;
if(numJobs===0){
 const main=document.getElementById('jobs');
 const hint=document.createElement('div');hint.className='no-published';
 hint.innerHTML='<span aria-hidden="true">ⓘ</span><div><b>Chưa có đơn tuyển được xác nhận để công khai</b><p>Những thẻ phía dưới là hồ sơ vị trí tham khảo, không phải đơn đang tuyển. Gọi TOPwork để biết thông tin mới nhất.</p></div>';
 const filters=main?.querySelector('.filters');if(filters)filters.insertAdjacentElement('beforebegin',hint);
}
})();
