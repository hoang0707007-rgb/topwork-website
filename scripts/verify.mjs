import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const dir='public/';
const read=f=>fs.readFileSync(dir+f,'utf8');
const html=read('index.html'),css=read('styles.css'),upgrade=read('upgrade.css'),app=read('app.js'),behavior=read('upgrade.js'),raw=read('data.js');
for(const f of ['styles.css','upgrade.css','data.js','app.js','upgrade.js']){
 assert(html.includes('./'+f),'Missing relative asset '+f);
}
for(const x of ['id="company-map"','id="jobs"','id="regions"','id="guide"','id="contact"','id="only-checked"','class="faq-list"','id="map-shell"','id="company-query"']){
 assert(html.includes(x),'Missing UI area '+x);
}
assert(html.indexOf('id="company-map"')<html.indexOf('id="jobs"'),'Map should come before job previews');
assert(!html.includes('href="/styles.css"'),'Absolute root CSS path breaks GitHub Pages');
assert(upgrade.includes('.audience-grid')&&upgrade.includes('@media(max-width:560px)'),'Missing responsive design');
assert(app.includes('refreshMarkers')&&behavior.includes('only-checked'),'Missing map verification behavior');
const ctx={window:{}};vm.runInNewContext(raw,ctx,{timeout:1000});
const data=ctx.window.TOPWORK_DATA;
assert(data,'Missing public data');
assert.equal(data.companies.length,91,'Expected 91 company records');
assert.equal(data.jobs.length,91,'Expected 91 job records');
assert(data.jobs.every(j=>j.status==='DRAFT'),'Cannot publish unverified jobs');
assert(data.companies.every(c=>c.id&&c.name&&c.region),'Company schema invalid');
assert(data.jobs.every(j=>data.companies.some(c=>c.id===j.cid)),'Found orphan job record');
assert(!raw.includes('raw_bonus')&&!raw.includes('raw_contact_private'),'Internal data detected');
console.log('TOPwork v3 smoke tests PASSED; companies:',data.companies.length,'draft records:',data.jobs.length,'verified locations:',data.companies.filter(c=>c.verification).length);
