const state={
  items:[],relationships:[],standards:[],coverage:[],regressions:[],evidence:[],
  filtered:[],compare:new Set(),compact:false,lang:"en",preset:"all"
};

const $=id=>document.getElementById(id);
const unique=values=>[...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b));
const esc=(value="")=>String(value)
  .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
  .replaceAll('"',"&quot;").replaceAll("'","&#039;");

const I18N={
  en:{
    eyebrow:"Threat-informed · evidence-driven · continuously curated",
    hero_a:"Security knowledge",hero_b:"with provenance.",
    hero_text:"A research-grade catalog that connects methodologies, threat models, validation platforms, defensive evidence, standards intelligence and lifecycle signals.",
    explore_catalog:"Explore catalog",open_graph:"Open knowledge graph",
    standards_kicker:"Standards intelligence",standards_title:"Current ecosystem versions",
    standards_text:"Primary-source version signals tracked as data, so the repository can detect change instead of quietly becoming stale.",
    catalog_kicker:"Research catalog",catalog_title:"Explore the ecosystem",
    catalog_text:"Verified, community, commercial, legacy and NOT VERIFIED research entries live in one searchable surface with clear confidence boundaries.",
    nv_title:"NOT VERIFIED does not mean unsafe or useless.",
    nv_text:"It means RedFrameworks has not yet confirmed canonical provenance, maintenance, licensing and scope. These entries are visible for research completeness, not presented as recommendations.",
    graph_kicker:"Knowledge graph",graph_title:"Relationships with confidence",
    measurement_kicker:"Measurement intelligence",measurement_title:"From activity to evidence",
    measurement_text:"Longitudinal scorecards surface improvement, regression and evidence maturity instead of reducing a purple-team exercise to a green checkbox."
  },
  pt:{
    eyebrow:"Orientado por ameaças · baseado em evidências · curadoria contínua",
    hero_a:"Conhecimento de segurança",hero_b:"com proveniência.",
    hero_text:"Um catálogo de pesquisa que conecta metodologias, modelos de ameaça, plataformas de validação, evidência defensiva, inteligência de standards e sinais de ciclo de vida.",
    explore_catalog:"Explorar catálogo",open_graph:"Abrir grafo",
    standards_kicker:"Inteligência de standards",standards_title:"Versões atuais do ecossistema",
    standards_text:"Versões acompanhadas em fontes primárias para detectar mudanças antes que o repositório envelheça em silêncio.",
    catalog_kicker:"Catálogo de pesquisa",catalog_title:"Explore o ecossistema",
    catalog_text:"Itens verificados, comunitários, comerciais, legados e NÃO VERIFICADOS aparecem na mesma superfície com fronteiras claras de confiança.",
    nv_title:"NÃO VERIFICADO não significa inútil ou inseguro.",
    nv_text:"Significa que o RedFrameworks ainda não confirmou proveniência canônica, manutenção, licença e escopo. O item aparece para completude de pesquisa, não como recomendação.",
    graph_kicker:"Grafo de conhecimento",graph_title:"Relações com confiança",
    measurement_kicker:"Inteligência de medição",measurement_title:"Da atividade à evidência",
    measurement_text:"Scorecards longitudinais mostram melhoria, regressão e maturidade de evidência em vez de resumir um exercício a uma caixinha verde."
  },
  es:{
    eyebrow:"Informado por amenazas · basado en evidencia · curación continua",
    hero_a:"Conocimiento de seguridad",hero_b:"con procedencia.",
    hero_text:"Un catálogo de investigación que conecta metodologías, modelos de amenaza, validación, evidencia defensiva, inteligencia de estándares y señales de ciclo de vida.",
    explore_catalog:"Explorar catálogo",open_graph:"Abrir grafo",
    standards_kicker:"Inteligencia de estándares",standards_title:"Versiones actuales del ecosistema",
    standards_text:"Versiones seguidas desde fuentes primarias para detectar cambios antes de que el repositorio quede obsoleto.",
    catalog_kicker:"Catálogo de investigación",catalog_title:"Explora el ecosistema",
    catalog_text:"Elementos verificados, comunitarios, comerciales, heredados y NO VERIFICADOS conviven con límites claros de confianza.",
    nv_title:"NO VERIFICADO no significa inútil o inseguro.",
    nv_text:"Significa que RedFrameworks aún no confirmó procedencia canónica, mantenimiento, licencia y alcance. Se muestra por completitud de investigación, no como recomendación.",
    graph_kicker:"Grafo de conocimiento",graph_title:"Relaciones con confianza",
    measurement_kicker:"Inteligencia de medición",measurement_title:"De actividad a evidencia",
    measurement_text:"Los scorecards longitudinales muestran mejora, regresión y madurez de evidencia en vez de reducir un ejercicio a una casilla verde."
  }
};

const PRESETS={
  all:{},
  pentest:{q:"ptes nist wstg assessment"},
  "threat-led":{q:"tiber cbest threat-led attack-flow"},
  purple:{q:"purple detection validation vectr sigma ttpforge"},
  cloud:{q:"cloud azure aws gcp kubernetes identity"},
  ai:{q:"ai-genai atlas pyrit garak"},
  edge:{q:"iot embedded mobile expliot mobsf"},
  research:{status:"not-verified"}
};

async function loadJson(path,fallback){
  try{
    const response=await fetch(path);
    if(!response.ok) throw new Error(String(response.status));
    return await response.json();
  }catch(_){return fallback}
}

function optionize(select,values){
  for(const value of values){
    const option=document.createElement("option");
    option.value=value;option.textContent=value;
    select.appendChild(option);
  }
}

function applyLanguage(){
  const dict=I18N[state.lang]||I18N.en;
  document.documentElement.lang=state.lang==="pt"?"pt-BR":state.lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const text=dict[el.dataset.i18n];
    if(text) el.textContent=text;
  });
  $("language").value=state.lang;
}

function readUrlState(){
  const params=new URLSearchParams(location.search);
  state.lang=params.get("lang")||localStorage.getItem("rf-lang")||"en";
  state.compact=params.get("view")==="compact";
  $("search").value=params.get("q")||"";
  $("type-filter").value=params.get("type")||"";
  $("domain-filter").value=params.get("domain")||"";
  $("status-filter").value=params.get("status")||"";
  $("sort").value=params.get("sort")||"name";
  $("catalog-grid").classList.toggle("compact",state.compact);
}

function syncUrl(){
  const params=new URLSearchParams();
  const values={
    q:$("search").value.trim(),type:$("type-filter").value,domain:$("domain-filter").value,
    status:$("status-filter").value,sort:$("sort").value,
    lang:state.lang==="en"?"":state.lang,view:state.compact?"compact":""
  };
  Object.entries(values).forEach(([key,value])=>{
    if(value && !(key==="sort"&&value==="name")) params.set(key,value);
  });
  history.replaceState(null,"",location.pathname+(params.toString()?"?"+params.toString():"")+location.hash);
}

function renderMetrics(){
  const verified=state.items.filter(i=>i.status==="verified").length;
  const notVerified=state.items.filter(i=>i.status==="not-verified").length;
  const domains=unique(state.items.flatMap(i=>i.domains||[])).length;
  const currentStandards=state.standards.filter(i=>i.status==="current").length;
  const metrics=[
    ["Catalog",state.items.length],
    ["Verified",verified],
    ["NOT VERIFIED",notVerified],
    ["Domains",domains],
    ["Relationships",state.relationships.length],
    ["Tracked standards",currentStandards]
  ];
  $("overview-metrics").innerHTML=metrics.map(([label,value])=>
    '<div class="metric"><strong>'+value+'</strong><span>'+label+'</span></div>'
  ).join("");
}

function renderStandards(){
  $("standards-grid").innerHTML=state.standards.map(item=>
    '<article class="standard-card">'+
      '<div class="std-meta"><span>'+esc(item.cadence||"tracked")+'</span><span class="std-status">'+esc(item.status||"tracked")+'</span></div>'+
      '<h3>'+esc(item.name)+'</h3>'+
      '<strong>'+esc(item.version)+'</strong>'+
      '<p>'+esc(item.note||("Updated "+(item.version_date||"—")))+'</p>'+
      (item.source?'<a href="'+esc(item.source)+'" target="_blank" rel="noopener">source ↗</a>':"")+
    '</article>'
  ).join("");
}

function statusClass(status){
  return ["verified","not-verified","legacy","commercial"].includes(status)?status:"";
}

function entryCard(item){
  const tags=[item.type,...(item.domains||[])].filter(Boolean).slice(0,5)
    .map(tag=>'<span class="tag">'+esc(tag)+'</span>').join("");
  const selected=state.compare.has(item.id);
  const verification=item.verification_note
    ?'<p class="verify-note">'+esc(item.verification_note)+'</p>':"";
  const source=item.url
    ?'<a href="'+esc(item.url)+'" target="_blank" rel="noopener">source ↗</a>'
    :'<span style="color:var(--faint);font-size:10px">source pending</span>';
  return '<article class="entry-card '+(item.status==="not-verified"?"not-verified":"")+'">'+
    '<div class="entry-top"><span class="status-badge '+statusClass(item.status)+'">'+esc(item.status)+'</span>'+
    '<span class="tag">Tier '+esc(item.evidence_tier||"—")+'</span></div>'+
    '<h3>'+esc(item.name)+'</h3>'+
    '<p>'+esc(item.summary||"No summary available.")+'</p>'+
    verification+
    '<div class="tag-row">'+tags+'</div>'+
    '<div class="entry-bottom">'+
      '<div class="entry-score"><strong>'+esc(item.provenance_score??"—")+'</strong><small>provenance</small></div>'+
      '<div class="entry-links">'+source+'<a href="entity/'+encodeURIComponent(item.id)+'/">entity →</a>'+
      '<button class="compare-toggle" type="button" data-id="'+esc(item.id)+'" aria-pressed="'+selected+'">'+(selected?"selected":"compare")+'</button></div>'+
    '</div>'+
  '</article>';
}

function sortItems(items){
  const mode=$("sort").value;
  return [...items].sort((a,b)=>{
    if(mode==="provenance") return (b.provenance_score||0)-(a.provenance_score||0)||(a.name||"").localeCompare(b.name||"");
    if(mode==="status") return (a.status||"").localeCompare(b.status||"")||(a.name||"").localeCompare(b.name||"");
    if(mode==="review") return String(b.last_reviewed||"").localeCompare(String(a.last_reviewed||""))||(a.name||"").localeCompare(b.name||"");
    return (a.name||"").localeCompare(b.name||"");
  });
}

function applyFilters(){
  const q=$("search").value.trim().toLowerCase();
  const tokens=q.split(/\s+/).filter(Boolean);
  const type=$("type-filter").value,domain=$("domain-filter").value,status=$("status-filter").value;

  state.filtered=state.items.filter(item=>{
    const hay=[
      item.name,item.type,item.status,item.model,item.summary,item.verification_note,item.evidence_tier,
      ...(item.aliases||[]),...(item.domains||[])
    ].join(" ").toLowerCase();
    return (!tokens.length||tokens.every(token=>hay.includes(token)))
      &&(!type||item.type===type)
      &&(!domain||(item.domains||[]).includes(domain))
      &&(!status||item.status===status);
  });

  const active=[q&&'“'+q+'”',type,domain,status].filter(Boolean);
  $("result-count").textContent=state.filtered.length+" entries";
  $("filter-summary").textContent=active.length?"· "+active.join(" · "):"";
  $("catalog-grid").innerHTML=sortItems(state.filtered).map(entryCard).join("")
    ||'<div style="grid-column:1/-1;padding:28px;color:var(--muted);background:var(--bg-soft)">No entries match the current filters.</div>';

  $("catalog-grid").querySelectorAll(".compare-toggle").forEach(button=>{
    button.addEventListener("click",()=>toggleCompare(button.dataset.id));
  });
  syncUrl();
}

function activatePreset(name){
  state.preset=name;
  const preset=PRESETS[name]||{};
  $("search").value=preset.q||"";
  $("type-filter").value="";
  $("domain-filter").value="";
  $("status-filter").value=preset.status||"";
  document.querySelectorAll(".preset").forEach(button=>button.classList.toggle("active",button.dataset.preset===name));
  applyFilters();
}

function toggleCompare(id){
  if(state.compare.has(id)) state.compare.delete(id);
  else if(state.compare.size<3) state.compare.add(id);
  renderCompareDock();applyFilters();
}

function renderCompareDock(){
  $("compare-dock").hidden=state.compare.size===0;
  $("compare-count").textContent=state.compare.size+" selected";
  $("open-compare").disabled=state.compare.size<2;
}

function openCompare(){
  const items=[...state.compare].map(id=>state.items.find(item=>item.id===id)).filter(Boolean);
  const rows=[
    ["Status","status"],["Type","type"],["Domains","domains"],["Model","model"],
    ["Evidence tier","evidence_tier"],["Provenance","provenance_score"],
    ["Upstream health","upstream_health"],["Reviewed","last_reviewed"],["Summary","summary"]
  ];
  let html='<table class="compare-table"><thead><tr><th>Attribute</th>'+
    items.map(item=>'<th>'+esc(item.name)+'</th>').join("")+'</tr></thead><tbody>';
  for(const [label,key] of rows){
    html+='<tr><td>'+label+'</td>'+items.map(item=>
      '<td>'+esc(Array.isArray(item[key])?item[key].join(", "):(item[key]??"—"))+'</td>'
    ).join("")+'</tr>';
  }
  html+="</tbody></table>";
  $("compare-table").innerHTML=html;
  $("compare-dialog").showModal();
}

function downloadFiltered(type){
  const items=sortItems(state.filtered);
  let blob,name;
  if(type==="json"){
    blob=new Blob([JSON.stringify(items,null,2)],{type:"application/json"});
    name="redframeworks-filtered.json";
  }else{
    const fields=["id","name","status","type","domains","model","evidence_tier","provenance_score","last_reviewed","url","summary"];
    const cell=value=>'"'+String(value??"").replaceAll('"','""')+'"';
    const csv=[
      fields.join(","),
      ...items.map(item=>fields.map(field=>cell(Array.isArray(item[field])?item[field].join("|"):item[field])).join(","))
    ].join("\n");
    blob=new Blob([csv],{type:"text/csv"});name="redframeworks-filtered.csv";
  }
  const url=URL.createObjectURL(blob),anchor=document.createElement("a");
  anchor.href=url;anchor.download=name;anchor.click();URL.revokeObjectURL(url);
}

function setupGraph(){
  const linkedIds=new Set(state.relationships.flatMap(edge=>[edge.from,edge.to]));
  const entities=state.items.filter(item=>linkedIds.has(item.id)).sort((a,b)=>a.name.localeCompare(b.name));
  $("graph-select").innerHTML="";
  optionize($("graph-select"),entities.map(item=>item.id));
  [...$("graph-select").options].forEach(option=>{
    const item=entities.find(entity=>entity.id===option.value);
    if(item) option.textContent=item.name;
  });
  $("graph-select").value=linkedIds.has("mitre-attack")?"mitre-attack":entities[0]?.id||"";
  renderGraph();
}

function renderGraph(){
  const focus=$("graph-select").value;
  const itemMap=new Map(state.items.map(item=>[item.id,item]));
  const edges=state.relationships.filter(edge=>edge.from===focus||edge.to===focus);
  const neighbors=unique(edges.map(edge=>edge.from===focus?edge.to:edge.from)).slice(0,16);
  const svg=$("relationship-graph"),cx=500,cy=280,r=Math.min(195+neighbors.length*4,235);
  let markup="";

  neighbors.forEach((id,index)=>{
    const angle=Math.PI*2*index/Math.max(neighbors.length,1)-Math.PI/2;
    const x=cx+Math.cos(angle)*r,y=cy+Math.sin(angle)*r;
    const edge=edges.find(e=>(e.from===focus&&e.to===id)||(e.to===focus&&e.from===id));
    markup+='<line class="graph-edge '+esc(edge?.confidence||"")+'" x1="'+cx+'" y1="'+cy+'" x2="'+x+'" y2="'+y+'"></line>';
  });

  [focus,...neighbors].forEach((id,index)=>{
    let x=cx,y=cy;
    if(index){
      const angle=Math.PI*2*(index-1)/Math.max(neighbors.length,1)-Math.PI/2;
      x=cx+Math.cos(angle)*r;y=cy+Math.sin(angle)*r;
    }
    const item=itemMap.get(id),name=item?.name||id,label=name.length>24?name.slice(0,22)+"…":name;
    markup+='<g tabindex="0" role="button" class="graph-node '+(index===0?"center":"")+'" data-id="'+esc(id)+'" transform="translate('+x+' '+y+')">'+
      '<circle r="'+(index===0?54:37)+'"></circle><text text-anchor="middle" dy="4">'+esc(label)+'</text></g>';
  });

  svg.innerHTML=markup;
  svg.querySelectorAll(".graph-node").forEach(node=>{
    const activate=()=>{if(node.dataset.id!==focus){$("graph-select").value=node.dataset.id;renderGraph()}};
    node.addEventListener("click",activate);
    node.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();activate()}});
  });

  const focusItem=itemMap.get(focus);
  const relationMarkup=edges.map(edge=>{
    const other=edge.from===focus?edge.to:edge.from;
    const otherItem=itemMap.get(other);
    const direction=edge.from===focus?"outbound":"inbound";
    return '<div class="graph-relation"><b>'+esc(edge.relation)+'</b>'+
      '<span>'+esc(direction)+' · '+esc(edge.confidence||"unrated")+' · '+esc(edge.provenance||"curated")+'</span><br>'+
      '<a href="entity/'+encodeURIComponent(other)+'/">'+esc(otherItem?.name||other)+' →</a></div>';
  }).join("");

  $("graph-detail").innerHTML=
    '<span class="graph-label">FOCUSED ENTITY</span>'+
    '<h3>'+esc(focusItem?.name||focus)+'</h3>'+
    '<p>'+esc(focusItem?.summary||"Curated relationship context.")+'</p>'+
    '<div class="tag-row">'+(focusItem?.domains||[]).slice(0,4).map(domain=>'<span class="tag">'+esc(domain)+'</span>').join("")+'</div>'+
    '<div class="graph-relations">'+(relationMarkup||'<p>No curated relationships yet.</p>')+'</div>';
}

function renderCoverage(){
  const records=[...state.coverage].sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  const svg=$("coverage-chart");
  if(!records.length){svg.innerHTML='<text x="20" y="40">No scorecard metrics available.</text>';return}
  const W=760,H=320,pad={l:38,r:18,t:18,b:34};
  const x=index=>pad.l+index*((W-pad.l-pad.r)/Math.max(records.length-1,1));
  const y=value=>H-pad.b-(Number(value)/100)*(H-pad.t-pad.b);
  const metrics=[
    ["telemetry","#7fbcff"],["detection","#f04f67"],["analyst_response","#a997ff"],
    ["containment","#f0bd67"],["evidence","#67d99c"]
  ];
  let markup="";
  for(let value=0;value<=100;value+=25){
    markup+='<line class="axis" x1="'+pad.l+'" y1="'+y(value)+'" x2="'+(W-pad.r)+'" y2="'+y(value)+'"></line>'+
      '<text x="5" y="'+(y(value)+3)+'">'+value+'</text>';
  }
  records.forEach((record,index)=>{
    markup+='<text x="'+x(index)+'" y="'+(H-9)+'" text-anchor="middle">'+esc(record.phase||record.date)+'</text>';
  });
  metrics.forEach(([metric,color])=>{
    const points=records.map((record,index)=>x(index)+","+y(record.scores?.[metric]??0)).join(" ");
    markup+='<polyline fill="none" stroke="'+color+'" stroke-width="2.6" points="'+points+'"></polyline>';
    records.forEach((record,index)=>{
      markup+='<circle cx="'+x(index)+'" cy="'+y(record.scores?.[metric]??0)+'" r="4.5" fill="'+color+'" stroke="#0d1016" stroke-width="2"></circle>';
    });
  });
  svg.innerHTML=markup;
  $("coverage-legend").innerHTML=metrics.map(([metric,color])=>
    '<span><i style="--c:'+color+'"></i>'+esc(metric.replaceAll("_"," "))+'</span>'
  ).join("");
}

function renderEvidence(){
  const records=[...state.evidence].sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  if(!records.length){$("evidence-chart").innerHTML='<p style="color:var(--muted)">No evidence trend available.</p>';return}
  $("evidence-chart").innerHTML=records.map(record=>
    '<div class="evidence-row"><b>'+esc(record.evidence_level||"E0")+'</b>'+
      '<div class="evidence-track"><div class="evidence-fill" style="width:'+Number(record.evidence_score||0)+'%"></div></div>'+
      '<b>'+Number(record.evidence_score||0)+'</b></div>'
  ).join("");
}

function renderRegressions(){
  const regressions=state.regressions||[];
  if(!regressions.length){
    $("regression-panel").innerHTML='<div class="regression-ok"><strong>0</strong><span>regressions detected in the loaded scorecard series</span></div>';
    return;
  }
  $("regression-panel").innerHTML=regressions.slice(0,6).map(item=>
    '<div class="regression-item"><b>'+esc(item.metric)+' · '+esc(item.delta)+'</b>'+
    '<span>'+esc(item.from_date)+' → '+esc(item.to_date)+' · '+esc(item.before)+' → '+esc(item.after)+'</span></div>'
  ).join("");
}

function setupNavigation(){
  const links=[...document.querySelectorAll(".nav-link")];
  const sections=links.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    links.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+visible.target.id));
  },{rootMargin:"-25% 0px -60% 0px",threshold:[0,.2,.5]});
  sections.forEach(section=>observer.observe(section));
}

async function init(){
  const [catalog,standards,coverage,regressions,evidence]=await Promise.all([
    loadJson("data/catalog.json",{items:[],relationships:[],updated:""}),
    loadJson("data/standards-intelligence.json",{standards:[]}),
    loadJson("data/coverage-series.json",{records:[]}),
    loadJson("data/regressions.json",{regressions:[]}),
    loadJson("data/evidence-trend.json",{records:[]})
  ]);

  state.items=catalog.items||[];
  state.relationships=catalog.relationships||[];
  state.standards=standards.standards||[];
  state.coverage=coverage.records||[];
  state.regressions=regressions.regressions||[];
  state.evidence=evidence.records||[];

  optionize($("type-filter"),unique(state.items.map(item=>item.type)));
  optionize($("domain-filter"),unique(state.items.flatMap(item=>item.domains||[])));
  optionize($("status-filter"),unique(state.items.map(item=>item.status)));

  readUrlState();applyLanguage();
  $("sidebar-updated").textContent="reviewed "+(catalog.updated||"—");

  renderMetrics();renderStandards();setupGraph();renderCoverage();renderEvidence();renderRegressions();setupNavigation();

  for(const id of["search","type-filter","domain-filter","status-filter","sort"]){
    $(id).addEventListener(id==="search"?"input":"change",applyFilters);
  }
  $("graph-select").addEventListener("change",renderGraph);
  $("reset").addEventListener("click",()=>{
    $("search").value="";$("type-filter").value="";$("domain-filter").value="";$("status-filter").value="";$("sort").value="name";
    state.preset="all";document.querySelectorAll(".preset").forEach(button=>button.classList.toggle("active",button.dataset.preset==="all"));applyFilters();
  });
  $("density").addEventListener("click",()=>{
    state.compact=!state.compact;$("catalog-grid").classList.toggle("compact",state.compact);
    $("density").textContent=state.compact?"Cards":"Compact";syncUrl();
  });
  $("export-json").addEventListener("click",()=>downloadFiltered("json"));
  $("export-csv").addEventListener("click",()=>downloadFiltered("csv"));
  $("show-not-verified").addEventListener("click",()=>activatePreset("research"));
  document.querySelectorAll(".preset").forEach(button=>button.addEventListener("click",()=>activatePreset(button.dataset.preset)));
  $("language").addEventListener("change",()=>{
    state.lang=$("language").value;localStorage.setItem("rf-lang",state.lang);applyLanguage();syncUrl();
  });
  $("clear-compare").addEventListener("click",()=>{state.compare.clear();renderCompareDock();applyFilters()});
  $("open-compare").addEventListener("click",openCompare);
  $("close-compare").addEventListener("click",()=>$("compare-dialog").close());

  applyFilters();renderCompareDock();
}

init().catch(error=>{
  console.error(error);
  $("catalog-grid").innerHTML='<div style="padding:28px;color:var(--red-2)">Catalog failed to load.</div>';
});
