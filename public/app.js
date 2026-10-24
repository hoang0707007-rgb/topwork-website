'use strict';
const DATA=window.TOPWORK_DATA||{companies:[],jobs:[]};
const companies=DATA.companies||[], jobs=DATA.jobs||[];
const byId=new Map(companies.map(c=>[c.id,c]));
const payInfo=window.TOPWORK_PAY_REFERENCE?.items||{};
const payFor=job=>payInfo[job?.id]||{};
const salaryCount=jobs.filter(j=>Boolean(payFor(j).salary)).length;
const bonusCount=jobs.filter(j=>Boolean(payFor(j).bonus)).length;
const factoryCount=jobs.filter(j=>Boolean(payFor(j).location)).length;

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
const salaryOnly=Boolean(el('has-salary')?.checked),bonusOnly=Boolean(el('has-bonus')?.checked);
const list=jobs.filter(j=>{
 const c=byId.get(j.cid)||{},p=payFor(j);
 return (!region||c.region===region)
 && (!salaryOnly||Boolean(p.salary))
 && (!bonusOnly||Boolean(p.bonus))
 && (!query||norm([c.name,j.title,c.region,c.place,p.salary,p.bonus,p.role,p.location].join(' ')).includes(query));
});
el('job-total').textContent=list.length+' mục';
el('job-cards').innerHTML=list.length?list.slice(0,jobLimit).map(j=>{
const c=byId.get(j.cid)||{},p=payFor(j);
const location=p.location||c.place||c.region||'Chưa rõ';
const salary=p.salary||'Chưa ghi rõ trong Excel';
const bonus=p.bonus||'Chưa ghi thưởng cụ thể';
const role=p.role||j.title;
return '<article class="job-card pay-job-card"><div class="job-top"><span class="job-avatar">'+escapeHTML((c.name||'T').slice(0,1))+'</span><span class="job-badge">SỐ LIỆU CŨ · CHƯA KIỂM CHỨNG</span></div>'
+'<div class="factory-location">⌖ '+escapeHTML(c.region||'Chưa rõ khu vực')+' <span>·</span> '+escapeHTML(location)+'</div>'
+'<h3>'+escapeHTML(c.name||'Doanh nghiệp tham khảo')+'</h3>'
+'<p class="role-text">'+escapeHTML(role)+'</p>'
+'<div class="pay-details"><div><span class="pay-label">LCB / PHỤ CẤP / CÔNG NHẬT THEO FILE</span><strong class="salary-value">'+escapeHTML(salary)+'</strong></div><div class="bonus-area"><span class="pay-label">THƯỞNG GHI TRONG FILE</span><strong>'+escapeHTML(bonus)+'</strong></div></div>'
+'<div class="job-foot"><small>Chưa xác nhận còn tuyển · Nguồn Excel nội bộ</small><button data-job="'+escapeHTML(j.id)+'">Chi tiết ↗</button></div></article>';
}).join(''):'<div class="empty">Không tìm thấy nhà máy hoặc mức thu nhập phù hợp. Hãy thay đổi từ khóa, khu vực hay bộ lọc.</div>';
el('see-more').hidden=list.length<=jobLimit;
document.querySelectorAll('[data-job]').forEach(b=>b.addEventListener('click',()=>showJob(b.dataset.job)));
}
el('job-query').addEventListener('input',()=>{jobLimit=9;renderJobs();});
el('job-region').addEventListener('change',()=>{jobLimit=9;renderJobs();});
for(const id of ['has-salary','has-bonus'])el(id)?.addEventListener('change',()=>{jobLimit=9;renderJobs();});
el('see-more').addEventListener('click',()=>{jobLimit+=9;renderJobs();});
function renderCompanies(){
const query=norm(el('company-query').value),region=el('company-region').value;
const onlyChecked=Boolean(el('only-checked')?.checked);
const list=companies.filter(c=>(!onlyChecked||c.verification)&&(!region||c.region===region)&&(!query||norm([c.name,c.region,c.place,...jobs.filter(j=>j.cid===c.id).map(j=>payFor(j).role)].join(' ')).includes(query)));
el('company-total').textContent=list.length+' mục';
el('company-list').innerHTML=list.length?list.map(c=>{
 const j=jobs.find(j=>j.cid===c.id),p=payFor(j);
 const location=p.location||c.place||'Khu vực đang xác minh';
 const salary=p.salary?'<span class="company-pay">Lương theo file: '+escapeHTML(p.salary)+'</span>':'';
 const bonus=p.bonus?'<span class="company-bonus">Thưởng theo file: '+escapeHTML(p.bonus)+'</span>':'';
 return '<button class="company-item" data-company="'+escapeHTML(c.id)+'"><span class="company-avatar">'+escapeHTML(c.name.slice(0,1))+'</span><span class="copy"><b>'+escapeHTML(c.name)+'</b><small>'+escapeHTML(c.region)+' · '+escapeHTML(location)+'</small>'+salary+bonus+'</span><span class="arrow">↗</span></button>';
}).join(''):'<p class="empty">Không có công ty nào phù hợp.</p>';
document.querySelectorAll('[data-company]').forEach(b=>b.addEventListener('click',()=>showCompany(b.dataset.company)));
}
el('company-query').addEventListener('input',renderCompanies);
el('company-region').addEventListener('change',()=>{renderCompanies();refreshMarkers();});
function modalOpen(html){el('modal-body').innerHTML=html;el('modal').hidden=false;document.body.style.overflow='hidden';}
function modalClose(){el('modal').hidden=true;document.body.style.overflow='';}
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',modalClose));
document.addEventListener('keydown',e=>{if(e.key==='Escape')modalClose();});
function showJob(id){
const j=jobs.find(v=>v.id===id);if(!j)return;const c=byId.get(j.cid)||{},p=payFor(j);
const row=(label,value)=>'<div class="detail-row"><b>'+escapeHTML(label)+'</b>'+escapeHTML(value)+'</div>';
modalOpen('<span class="detail-tag">TRÍCH BẢNG EXCEL GỐC · CHƯA XÁC MINH</span><h2 id="modal-title">'+escapeHTML(c.name||j.title)+'</h2>'
+'<p class="detail-warning">Chỉ là thông tin từ Excel TOPWORK cung cấp, không có ngày hiệu lực. Không xác nhận doanh nghiệp đang tuyển, chế độ còn áp dụng hoặc TOPwork là đối tác của doanh nghiệp.</p>'
+row('Công việc / vị trí',p.role||j.title)
+row('Nhóm khu vực trong file',c.region||'Chưa có')
+row('Nhà máy / địa chỉ theo file',p.location||c.place||'Chưa có địa chỉ cụ thể')
+row('Loại hình làm việc theo file',p.employment||'Chưa có')
+row('Lương cơ bản / phụ cấp / công nhật',p.salary||'Không ghi rõ trong file')
+row('Khoản thưởng theo file (chưa xác minh)',p.bonus||'Không ghi rõ khoản thưởng')
+(p.daily_rate?row('Công nhật theo ca',p.daily_rate):'')
+row('Số lượng cần tuyển và thời hạn', 'Không có thông tin đã xác minh')
+row('Trạng thái', 'DỮ LIỆU THAM KHẢO · Chưa xác nhận đang tuyển')
+'<p class="detail-source">Nguồn: Thông Tin DS CTY.xlsx. LCB = lương cơ bản; PC = phụ cấp; TR = triệu đồng; k = nghìn đồng. Thưởng có thể có điều kiện hoặc đã hết hiệu lực.</p>'
+'<a class="map-link" href="tel:0327661379">Gọi TOPwork để xác nhận →</a>');
}
function showCompany(id){
const c=byId.get(id);if(!c)return;
const records=jobs.filter(j=>j.cid===id),p=payFor(records[0]);
const url='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(c.name+' '+(p.location||c.place||c.region));
const row=(label,value)=>'<div class="detail-row"><b>'+escapeHTML(label)+'</b>'+escapeHTML(value)+'</div>';
modalOpen('<span class="detail-tag">HỒ SƠ NHÀ MÁY · DỮ LIỆU CŨ CHỜ DUYỆT</span><h2 id="modal-title">'+escapeHTML(c.name)+'</h2>'
+'<p class="detail-warning">Mức lương, thưởng và trạng thái tuyển chưa được doanh nghiệp xác nhận; địa điểm có thể đã thay đổi.</p>'
+row('Khu vực trong file',c.region)
+row('Địa điểm nhà máy theo Excel',p.location||c.place||'Chưa rõ')
+row('Vị trí tham khảo',p.role||records[0]?.title||'Chưa ghi công việc')
+row('LCB / phụ cấp / công nhật',p.salary||'Chưa có số liệu đọc được')
+row('Thưởng ghi trong file',p.bonus||'Chưa ghi')
+row('Đối chiếu địa điểm',c.verification?'Có nguồn đối chiếu ban đầu (không đồng nghĩa đang tuyển)':'Chưa đối chiếu đầy đủ')
+'<div class="dialog-actions"><button class="map-link" id="company-job-link" type="button">Xem chi tiết công việc ↗</button><a class="map-link outline-link" target="_blank" rel="noopener noreferrer" href="'+escapeHTML(url)+'">Tìm trên Google Maps ↗</a></div>');
el('company-job-link').addEventListener('click',()=>{
 modalClose();
 el('job-query').value=c.name;
 el('job-region').value=c.region;
 if(el('has-salary'))el('has-salary').checked=false;
 if(el('has-bonus'))el('has-bonus').checked=false;
 jobLimit=9;renderJobs();
 el('jobs').scrollIntoView({behavior:'smooth'});
});
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
if(el('pay-with-salary'))el('pay-with-salary').textContent=salaryCount+' mục có thông tin lương/công nhật';
if(el('pay-with-bonus'))el('pay-with-bonus').textContent=bonusCount+' mục ghi thưởng';
if(el('pay-with-factory'))el('pay-with-factory').textContent=factoryCount+' mục ghi địa điểm';
renderJobs();renderCompanies();createMap();
