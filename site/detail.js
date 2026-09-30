const $=id=>document.getElementById(id);
const esc=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
async function load(path,fallback){try{const r=await fetch(path);if(!r.ok)throw new Error(r.status);return await r.json()}catch(_){return fallback}}
function badges(values){return(values||[]).map(v=>'<span class="badge">'+esc(v)+'</span>').join("")}
function sourceButton(url,label="Canonical source ↗"){return url?'<a class="primary-button" href="'+esc(url)+'" target="_blank" rel="noopener">'+esc(label)+'</a>':""}
async function init(){
  document.documentElement.dataset.theme=localStorage.getItem("rf-theme")||"dark";
  const p=new URLSearchParams(location.search),type=p.get("type")||"entity",id=p.get("id")||"";
  const host=$("dynamic-detail");
  if(!id){host.innerHTML='<section class="entity-hero"><h1>Missing entity ID</h1></section>';return}

  if(type==="adversary"){
    const doc=await load("data/adversaries.json",{adversaries:[]}),item=(doc.adversaries||[]).find(x=>x.id===id);
    if(!item){host.innerHTML='<section class="entity-hero"><h1>Adversary not found</h1></section>';return}
    document.title=item.name+" · RedFrameworks";
    host.innerHTML='<section class="entity-hero"><p class="section-kicker">ADVERSARY INTELLIGENCE · '+esc(item.attack_id)+'</p><h1>'+esc(item.name)+'</h1><p class="hero-summary">'+esc(item.attribution)+'</p><div class="badges">'+badges(item.aliases)+'</div><div class="hero-actions">'+sourceButton(item.source,"MITRE ATT&CK profile ↗")+'</div></section>'+
      '<section class="entity-grid"><article class="entity-panel"><span>Actor type</span><strong>'+esc(item.actor_type)+'</strong><small>'+esc((item.motivation||[]).join(" · "))+'</small></article><article class="entity-panel"><span>Focus regions</span><strong>'+esc((item.focus_regions||[]).join(" · ")||"—")+'</strong><small>Source-attributed targeting context</small></article></section>'+
      '<section class="entity-panel"><span>Sectors</span><div class="badges">'+badges(item.sectors)+'</div></section><section class="entity-panel"><span>Defensive focus</span><div class="badges">'+badges(item.defensive_focus)+'</div></section>';
    return;
  }

  if(type==="technique"){
    const rows=await load("data/techniques.json",[]),item=(rows||[]).find(x=>String(x.id).toLowerCase()===String(id).toLowerCase());
    if(!item){host.innerHTML='<section class="entity-hero"><h1>Technique not found</h1></section>';return}
    document.title=item.id+" · RedFrameworks";
    const defs=(item.defensive_context||[]).map(x=>'<li><strong>'+esc(x.relationship_type||"context")+'</strong>: '+esc((x.defensive_actions||[]).join(", "))+'</li>').join("");
    host.innerHTML='<section class="entity-hero"><p class="section-kicker">ATT&CK TECHNIQUE INTELLIGENCE</p><h1>'+esc(item.id)+' · '+esc(item.name||item.id)+'</h1><p class="hero-summary">Defensive validation and evidence context from the RedFrameworks dataset.</p><div class="hero-actions">'+sourceButton(item.url,"MITRE ATT&CK ↗")+'</div></section>'+
      '<section class="entity-grid"><article class="entity-panel"><span>Validation references</span><strong>'+((item.scenarios||[]).length+(item.scorecards||[]).length)+'</strong></article><article class="entity-panel"><span>Defensive mappings</span><strong>'+((item.defensive_context||[]).length)+'</strong></article></section>'+
      '<section class="entity-panel"><span>Defensive context</span><ul>'+(defs||"<li>No curated defensive context yet.</li>")+'</ul></section>';
    return;
  }

  const [catalog]=await Promise.all([load("data/catalog.json",{items:[],relationships:[]})]);
  const item=(catalog.items||[]).find(x=>x.id===id);
  if(!item){host.innerHTML='<section class="entity-hero"><h1>Entity not found</h1></section>';return}
  document.title=item.name+" · RedFrameworks";
  const rels=(catalog.relationships||[]).filter(e=>e.from===id||e.to===id).map(e=>{const other=e.from===id?e.to:e.from,o=(catalog.items||[]).find(x=>x.id===other);return'<li><span>'+esc(e.relation)+' · '+esc(e.confidence||"unrated")+'</span> → <a href="detail.html?type=entity&id='+encodeURIComponent(other)+'">'+esc(o?.name||other)+'</a></li>'}).join("");
  host.innerHTML='<section class="entity-hero"><p class="section-kicker">'+esc(item.kind)+' · '+esc(item.type)+'</p><h1>'+esc(item.name)+'</h1><p class="hero-summary">'+esc(item.summary||"")+'</p><div class="badges"><span class="badge">'+esc(item.status)+'</span>'+badges(item.domains)+'</div><div class="hero-actions">'+sourceButton(item.url)+'</div></section>'+
    '<section class="entity-grid"><article class="entity-panel"><span>Provenance</span><strong>'+esc(item.provenance_score??"—")+'/100</strong><small>Tier '+esc(item.evidence_tier||"—")+'</small></article><article class="entity-panel"><span>Model</span><strong>'+esc(item.model||"—")+'</strong><small>'+esc(item.last_reviewed||"—")+'</small></article></section>'+
    '<section class="entity-panel"><span>Relationships</span><ul>'+(rels||"<li>No curated relationships yet.</li>")+'</ul></section>';
}
init();
