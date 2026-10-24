'use strict';
const DATA=window.TOPWORK_DATA||{companies:[],jobs:[]};
const companies=DATA.companies||[], jobs=DATA.jobs||[];
const byId=new Map(companies.map(c=>[c.id,c]));
const el=id=>document.getElementById(id);
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const norm=s=>String(s||'').normalize('NFC').toLocaleLowerCase('vi');
const regionList=[...new Set(companies.map(c=>c.region).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'vi'));
const byRegion=new Map();
for(const c of companies){if(!byRegion.has(c.region))byRegion.set(c.region,[]);byRegion.get(c.region).push(c);}
let jobLimit=9,map,markerLayer;
function regionOptions(id){el(id).innerHTML='<option value="">Tất cả khu vực</option>'+regionList.map(r=>'<option value="'+escapeHTML(r)+'">'+escapeHTML(r)+'</option>').join('');}
for(const id of ['hero-region','job-region','company-region'])regionOptions(id);
el('stat-companies').textContent=companies.length;
el('stat-regions').textContent=regionList.length;
el('stat-jobs').textContent=jobs.length;
const top=[...byRegion].sort((a,b)=>b[1].length-a[1].length).slice(0,8);
el('region-cards').innerHTML=top.map(([r,list],i)=>'<button class="region-card" data-region="'+escapeHTML(r)+'"><small>KHU VỰC '+String(i+1).padStart(2,'0')+'</small><b>'+escapeHTML(r)+'</b><span>'+list.length+' mục doanh nghiệp →</span></button>').join('');
function setRegion(region){
el('company-region').value=region;el('job-region').value=region;el('hero-region').value=region;
jobLimit=9;renderJobs();renderCompanies();refreshMarkers();el('company-map').scrollIntoView({behavior:'smooth'});}
document.querySelectorAll('[data-region]').forEach(x=>x.addEventListener('click',()=>setRegion(x.dataset.region)));
document.querySelectorAll('[data-region-button]').forEach(x=>x.addEventListener('click',()=>setRegion(x.dataset.regionButton)));
function renderJobs(){
const query=norm(el('job-query').value),region=el('job-region').value;
const list=jobs.filter(j=>{const c=byId.get(j.cid)||{};return (!region||c.region===region)&&(!query||norm([c.name,j.title,c.region].join(' ')).includes(query));});
el('job-total').textContent=list.length+' mục';
el('job-cards').innerHTML=list.length?list.slice(0,jobLimit).map(j=>{const c=byId.get(j.cid)||{};return '<article class="job-card"><div class="job-top"><span class="job-avatar">'+escapeHTML((c.name||'T').slice(0,1))+'</span><span class="job-badge">CHỜ XÁC MINH</span></div><h3>'+escapeHTML(j.title)+'</h3><p>'+escapeHTML(c.name||'Doanh nghiệp tham khảo')+'</p><small>⌖ '+escapeHTML(c.region||'Chưa rõ khu vực')+'</small><div class="job-foot"><small>Chưa mở nhận hồ sơ</small><button data-job="'+escapeHTML(j.id)+'">Xem chi tiết ↗</button></div></article>';}).join(''):'<div class="empty">Không tìm thấy vị trí phù hợp. Hãy đổi từ khóa hoặc khu vực.</div>';
el('see-more').hidden=list.length<=jobLimit;
document.querySelectorAll('[data-job]').forEach(b=>b.addEventListener('click',()=>showJob(b.dataset.job)));
}
el('job-query').addEventListener('input',()=>{jobLimit=9;renderJobs();});
el('job-region').addEventListener('change',()=>{jobLimit=9;renderJobs();});
el('see-more').addEventListener('click',()=>{jobLimit+=9;renderJobs();});
function renderCompanies(){
const query=norm(el('company-query').value),region=el('company-region').value;
const onlyChecked=Boolean(document.getElementById('only-checked')?.checked);const list=companies.filter(c=>(!onlyChecked||c.verification)&&(!region||c.region===region)&&(!query||norm([c.name,c.region,c.place].join(' ')).includes(query)));
el('company-total').textContent=list.length+' mục';
el('company-list').innerHTML=list.length?list.map(c=>'<button class="company-item" data-company="'+escapeHTML(c.id)+'"><span class="company-avatar">'+escapeHTML(c.name.slice(0,1))+'</span><span class="copy"><b>'+escapeHTML(c.name)+'</b><small>'+escapeHTML(c.region)+' · Chờ duyệt</small></span><span class="arrow">↗</span></button>').join(''):'<p class="empty">Không có công ty nào phù hợp.</p>';
document.querySelectorAll('[data-company]').forEach(b=>b.addEventListener('click',()=>showCompany(b.dataset.company)));
}
el('company-query').addEventListener('input',renderCompanies);
el('company-region').addEventListener('change',()=>{renderCompanies();refreshMarkers();});
function modalOpen(html){el('modal-body').innerHTML=html;el('modal').hidden=false;document.body.style.overflow='hidden';}
function modalClose(){el('modal').hidden=true;document.body.style.overflow='';}
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',modalClose));
document.addEventListener('keydown',e=>{if(e.key==='Escape')modalClose();});
function showJob(id){
const j=jobs.find(v=>v.id===id);if(!j)return;const c=byId.get(j.cid)||{};
modalOpen('<span class="detail-tag">HỒ SƠ VỊ TRÍ • CHƯA DUYỆT</span><h2 id="modal-title">'+escapeHTML(j.title)+'</h2><p>Thông tin tham khảo từ danh mục nội bộ. Chưa xác nhận đây là đơn tuyển dụng hiện hành.</p><div class="detail-row"><b>Doanh nghiệp</b>'+escapeHTML(c.name||'Chưa cập nhật')+'</div><div class="detail-row"><b>Khu vực</b>'+escapeHTML(c.region||'Chưa rõ')+'</div><div class="detail-row"><b>Lương, thưởng, số lượng và thời hạn tuyển</b>Chưa được xác minh để công khai.</div><div class="detail-row"><b>Ứng tuyển</b>Chưa mở nhận hồ sơ trên website demo.</div>');
}
function showCompany(id){
const c=byId.get(id);if(!c)return;
const count=jobs.filter(j=>j.cid===id).length;
const url='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(c.name+' '+(c.place||c.region));
modalOpen('<span class="detail-tag">DANH MỤC DOANH NGHIỆP • CHỜ DUYỆT</span><h2 id="modal-title">'+escapeHTML(c.name)+'</h2><p>Danh mục này không chứng minh quan hệ hợp tác hoặc tình trạng tuyển dụng hiện tại.</p><div class="detail-row"><b>Khu vực</b>'+escapeHTML(c.region)+'</div><div class="detail-row"><b>Địa điểm tham khảo</b>'+escapeHTML(c.place||'Chưa rõ')+'</div><div class="detail-row"><b>Kiểm tra địa điểm</b>'+(c.verification?'Đã có nguồn đối chiếu địa điểm ban đầu; chưa xác nhận đang tuyển':'Địa điểm chưa được đối chiếu đầy đủ')+'</div><div class="detail-row"><b>Hồ sơ vị trí tham khảo</b>'+count+' mục, chưa xác minh</div><div class="detail-row"><b>Chú ý</b>Vị trí ghim của khu vực không phải địa chỉ chính xác nhà máy.</div><a class="map-link" target="_blank" rel="noopener noreferrer" href="'+escapeHTML(url)+'">Tìm trên Google Maps ↗</a>');
}
el('search-form').addEventListener('submit',e=>{e.preventDefault();el('job-query').value=el('hero-keyword').value;el('job-region').value=el('hero-region').value;jobLimit=9;renderJobs();el('jobs').scrollIntoView({behavior:'smooth'});});
el('menu').addEventListener('click',()=>{const open=el('nav').classList.toggle('open');el('menu').setAttribute('aria-expanded',String(open));});
el('nav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{el('nav').classList.remove('open');el('menu').setAttribute('aria-expanded','false');}));
function createMap(){
if(!window.L){el('map').innerHTML='<div class="map-fallback">Không thể tải bản đồ nền. Danh sách công ty và các liên kết Google Maps vẫn hoạt động.</div>';return;}
try{
map=L.map('map',{scrollWheelZoom:false}).setView([20.85,106.05],7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:17,attribution:'© OpenStreetMap contributors'}).addTo(map);
markerLayer=L.layerGroup().addTo(map);
refreshMarkers();
}catch(e){el('map').innerHTML='<div class="map-fallback">Bản đồ đang không khả dụng. Vui lòng dùng danh sách doanh nghiệp.</div>';}
}
function refreshMarkers(){
if(!map||!markerLayer)return;
markerLayer.clearLayers();const region=el('company-region').value,points=[];
for(const [name,allItems] of byRegion.entries()){
if(region&&region!==name)continue;
const items=document.getElementById('only-checked')?.checked?allItems.filter(c=>c.verification):allItems;
if(!items.length)continue;
const c=items.find(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lng)&&x.lat&&x.lng);if(!c)continue;
const coordinates=[c.lat,c.lng];points.push(coordinates);
const marker=L.circleMarker(coordinates,{radius:Math.min(21,9+Math.sqrt(items.length)*1.5),fillColor:'#0d8fbf',fillOpacity:.86,color:'#fff',weight:3});
marker.bindPopup('<b>'+escapeHTML(name)+'</b><br>'+items.length+' mục doanh nghiệp<br><small>Vị trí tâm khu vực, không phải nhà máy</small>');
marker.on('click',()=>{el('company-region').value=name;renderCompanies();});
markerLayer.addLayer(marker);
}
if(points.length>1)map.fitBounds(points,{padding:[35,35],maxZoom:8});
else if(points.length===1)map.setView(points[0],9);
}
renderJobs();renderCompanies();createMap();
