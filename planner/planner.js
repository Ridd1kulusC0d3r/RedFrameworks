const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function get(p,f){try{const r=await fetch(p);return r.ok?await r.json():f}catch{return f}}
let state={actors:[],campaigns:[],packs:[],detections:[],plans:[]};
function options(el,rows,label="name"){el.innerHTML=rows.map(x=>'<option value="'+esc(x.id)+'">'+esc(x[label])+'</option>').join("")}
function build(){
 const actor=state.actors.find(x=>x.id===$("planner-adversary").value),pack=state.packs.find(x=>x.id===$("planner-pack").value);
 if(!actor||!pack)return;
 const campaigns=state.campaigns.filter(c=>(c.actor_ids||[]).includes(actor.id));
 const plans=state.plans.filter(p=>p.attack_group_id===actor.attack_id);
 const detections=state.detections.filter(d=>(pack.detections||[]).includes(d.id));
 $("planner-output").innerHTML=
 '<section class="entity-panel"><span>Threat context</span><h2>'+esc(actor.name)+'</h2><p>'+esc(actor.attribution)+'</p><div class="badges">'+(actor.defensive_focus||[]).map(x=>'<span class="badge">'+esc(x)+'</span>').join("")+'</div></section>'+
 '<section class="entity-grid"><article class="entity-panel"><span>Campaigns</span><strong>'+campaigns.length+'</strong><ul>'+campaigns.map(x=>'<li>'+esc(x.name)+' · '+esc(x.first_seen)+' → '+esc(x.last_seen)+'</li>').join("")+'</ul></article>'+
 '<article class="entity-panel"><span>Authoritative emulation references</span><strong>'+plans.length+'</strong><ul>'+plans.map(x=>'<li>'+esc(x.name)+'</li>').join("")+'</ul></article></section>'+
 '<section class="entity-panel"><span>Validation domain</span><h2>'+esc(pack.name)+'</h2><p>'+esc(pack.description)+'</p><h3>Detection and telemetry priorities</h3>'+
 detections.map(d=>'<div class="graph-relation"><b>'+esc(d.attack_id)+' · '+esc(d.name)+'</b><span>'+esc((d.telemetry||[]).join(" · "))+'</span></div>').join("")+
 '<h3>Evidence checklist</h3><ul><li>Source event retained</li><li>Detection result recorded</li><li>Analyst disposition captured</li><li>Containment or response decision documented</li><li>Retest result linked</li></ul></section>';
}
(async()=>{
 const [a,c,p,d,e]=await Promise.all([get("../data/adversaries.json",{adversaries:[]}),get("../data/campaigns.json",{campaigns:[]}),get("../data/domain-packs.json",{packs:[]}),get("../data/detection-intelligence.json",{detections:[]}),get("../data/emulation-plans.json",{plans:[]})]);
 state={actors:a.adversaries||[],campaigns:c.campaigns||[],packs:p.packs||[],detections:d.detections||[],plans:e.plans||[]};
 options($("planner-adversary"),state.actors);options($("planner-pack"),state.packs);
 $("planner-build").addEventListener("click",build);build();
})();