const state={
  items:[],relationships:[],resources:{books:[],certifications:[]},learningPaths:[],techniques:[],
  adversaries:[],intelligenceSources:[],emulationPlans:[],
  verification:{count:0,entries:[]},standards:[],coverage:[],regressions:[],evidence:[],
  lifecycle:{events:[]},changelog:{releases:[]},heatmap:[],scenarioSummary:[],filtered:[],compare:new Set(),compact:false,
  lang:"en",resourceMode:"books",bookmarks:new Set(),graphPath:{nodes:new Set(),edges:new Set()},
  commandItems:[],commandIndex:0
};

const $=id=>document.getElementById(id);
const unique=values=>[...new Set(values.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b)));
const esc=(value="")=>String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const slug=value=>String(value||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const edgeKey=(a,b)=>[a,b].sort().join("::");

const PRESETS={
  all:{},
  pentest:{q:"penetration testing enterprise assessment"},
  web:{q:"web application api"},
  cloud:{q:"cloud azure aws gcp kubernetes identity"},
  purple:{q:"purple detection telemetry threat hunting"},
  reverse:{q:"reverse engineering malware dfir"},
  ai:{q:"ai genai atlas llm"},
  research:{status:"not-verified"}
};

const I18N={
  en:{search:"Search anything",empty:"Nothing saved yet."},
  pt:{search:"Buscar em tudo",empty:"Nada salvo ainda."},
  es:{search:"Buscar en todo",empty:"Nada guardado todavía."}
};

async function loadJson(path,fallback){
  try{
    const response=await fetch(path);
    if(!response.ok) throw new Error(String(response.status));
    return await response.json();
  }catch(_){return fallback}
}

function optionize(select,values,labelFn=value=>value){
  for(const value of values){
    const option=document.createElement("option");
    option.value=value;option.textContent=labelFn(value);select.appendChild(option);
  }
}

function applyTheme(){
  const theme=localStorage.getItem("rf-theme")||"dark";
  document.documentElement.dataset.theme=theme;
  $("theme-toggle").textContent=theme==="dark"?"◐":"◑";
}

function toggleTheme(){
  const next=document.documentElement.dataset.theme==="dark"?"light":"dark";
  document.documentElement.dataset.theme=next;localStorage.setItem("rf-theme",next);
  $("theme-toggle").textContent=next==="dark"?"◐":"◑";
}

function readLocalState(){
  state.lang=localStorage.getItem("rf-lang")||"en";
  $("language").value=state.lang;
  try{state.bookmarks=new Set(JSON.parse(localStorage.getItem("rf-bookmarks")||"[]"))}catch(_){state.bookmarks=new Set()}
  const params=new URLSearchParams(location.search);
  $("search").value=params.get("q")||"";
  $("kind-filter").value=params.get("kind")||"";
  $("domain-filter").value=params.get("domain")||"";
  $("status-filter").value=params.get("status")||"";
  $("tier-filter").value=params.get("tier")||"";
  $("sort").value=params.get("sort")||"name";
  state.compact=params.get("view")==="compact";
  $("catalog-grid").classList.toggle("compact",state.compact);
}

function syncUrl(){
  const params=new URLSearchParams();
  const values={
    q:$("search").value.trim(),kind:$("kind-filter").value,domain:$("domain-filter").value,
    status:$("status-filter").value,tier:$("tier-filter").value,sort:$("sort").value,
    view:state.compact?"compact":""
  };
  for(const [key,value] of Object.entries(values)){
    if(value && !(key==="sort"&&value==="name"))params.set(key,value);
  }
  history.replaceState(null,"",location.pathname+(params.toString()?"?"+params.toString():"")+location.hash);
}

function bookmarkKey(kind,id){return kind+":"+id}
function persistBookmarks(){localStorage.setItem("rf-bookmarks",JSON.stringify([...state.bookmarks]));renderBookmarks()}
function toggleBookmark(kind,id){
  const key=bookmarkKey(kind,id);
  state.bookmarks.has(key)?state.bookmarks.delete(key):state.bookmarks.add(key);
  persistBookmarks();renderCatalog();renderResources();
}

function resolveBookmark(key){
  const [kind,id]=key.split(":");
  if(kind==="item"){
    const item=state.items.find(row=>row.id===id);
    return item?{name:item.name,href:"detail.html?type=entity&id="+encodeURIComponent(id)}:null;
  }
  if(kind==="book"){
    const item=state.resources.books.find(row=>row.id===id);
    return item?{name:item.title,href:item.url}:null;
  }
  if(kind==="cert"){
    const item=state.resources.certifications.find(row=>row.id===id);
    return item?{name:item.name,href:item.url}:null;
  }
  return null;
}

function renderBookmarks(){
  const rows=[...state.bookmarks].map(resolveBookmark).filter(Boolean);
  $("bookmark-count").textContent=rows.length;
  $("bookmark-list").innerHTML=rows.length
    ?rows.slice(0,7).map(row=>'<a class="bookmark-item" href="'+esc(row.href)+'">'+esc(row.name)+'</a>').join("")
    :'<span class="empty-mini">'+esc(I18N[state.lang]?.empty||I18N.en.empty)+'</span>';
}

function renderMetrics(){
  const metrics=[
    ["Frameworks",state.items.filter(i=>i.kind==="framework").length],
    ["Tools",state.items.filter(i=>i.kind==="tool").length],
    ["Books",state.resources.books.length],
    ["Certifications",state.resources.certifications.length],
    ["Techniques",state.techniques.length],
    ["Adversaries",state.adversaries.length],
    ["Emulation plans",state.emulationPlans.length],
    ["CTI Sources",state.intelligenceSources.length],
    ["Relationships",state.relationships.length],
    ["NOT VERIFIED",state.items.filter(i=>i.status==="not-verified").length]
  ];
  $("overview-metrics").innerHTML=metrics.map(([label,value])=>
    '<div class="metric"><strong>'+value+'</strong><span>'+label+'</span></div>'
  ).join("");
}

function renderStandardsTicker(){
  $("standards-ticker").innerHTML=state.standards.slice(0,8).map(item=>
    '<span class="ticker-chip">'+esc(item.name)+' <b>'+esc(item.version||"tracked")+'</b></span>'
  ).join("");
}

function statusClass(status){return ["verified","not-verified","legacy","commercial"].includes(status)?status:""}

function itemCard(item){
  const saved=state.bookmarks.has(bookmarkKey("item",item.id));
  const tags=[...(item.domains||[])].slice(0,4).map(v=>'<span class="tag">'+esc(v)+'</span>').join("");
  const source=item.url
    ?'<a href="'+esc(item.url)+'" target="_blank" rel="noopener">source ↗</a>'
    :'<span class="faint">source pending</span>';
  return '<article class="entry-card '+(item.status==="not-verified"?"not-verified":"")+'">'+
    '<div class="entry-top"><div><span class="kind-badge">'+esc(item.kind)+'</span> <span class="status-badge '+statusClass(item.status)+'">'+esc(item.status)+'</span></div>'+
    '<button class="bookmark-toggle '+(saved?"saved":"")+'" data-bookmark="'+esc(item.id)+'" title="Bookmark">★</button></div>'+
    '<h3>'+esc(item.name)+'</h3>'+
    '<p>'+esc(item.summary||"No summary available.")+'</p>'+
    (item.verification_note?'<p class="verify-note">'+esc(item.verification_note)+'</p>':"")+
    '<div class="tag-row">'+tags+'</div>'+
    '<div class="entry-bottom"><div class="entry-score"><strong>'+esc(item.provenance_score??"—")+'</strong><small>provenance · tier '+esc(item.evidence_tier||"—")+'</small></div>'+
    '<div class="entry-actions">'+source+'<a href="detail.html?type=entity&id='+encodeURIComponent(item.id)+'">entity →</a>'+
    '<button class="compare-toggle" data-id="'+esc(item.id)+'" aria-pressed="'+state.compare.has(item.id)+'">'+(state.compare.has(item.id)?"selected":"compare")+'</button></div></div>'+
    '</article>';
}

function sortItems(items){
  const mode=$("sort").value;
  return [...items].sort((a,b)=>{
    if(mode==="provenance")return(b.provenance_score||0)-(a.provenance_score||0)||(a.name||"").localeCompare(b.name||"");
    if(mode==="status")return(a.status||"").localeCompare(b.status||"")||(a.name||"").localeCompare(b.name||"");
    if(mode==="review")return String(b.last_reviewed||"").localeCompare(String(a.last_reviewed||""));
    return(a.name||"").localeCompare(b.name||"");
  });
}

function applyFilters(){
  const q=$("search").value.trim().toLowerCase();
  const tokens=q.split(/\s+/).filter(Boolean);
  const kind=$("kind-filter").value,domain=$("domain-filter").value,status=$("status-filter").value,tier=$("tier-filter").value;
  state.filtered=state.items.filter(item=>{
    const hay=[item.name,item.kind,item.type,item.status,item.model,item.summary,item.evidence_tier,...(item.aliases||[]),...(item.domains||[])].join(" ").toLowerCase();
    return(!tokens.length||tokens.every(token=>hay.includes(token)))
      &&(!kind||item.kind===kind)&&(!domain||(item.domains||[]).includes(domain))
      &&(!status||item.status===status)&&(!tier||item.evidence_tier===tier);
  });
  $("result-count").textContent=state.filtered.length+" entries";
  const active=[q,kind,domain,status,tier].filter(Boolean);
  $("filter-summary").textContent=active.length?"· "+active.join(" · "):"";
  renderCatalog();syncUrl();
}

function renderCatalog(){
  $("catalog-grid").innerHTML=sortItems(state.filtered).map(itemCard).join("")||
    '<div class="entry-card"><h3>No matches</h3><p>Try removing one filter. Humans do occasionally overconstrain a query.</p></div>';
  $("catalog-grid").querySelectorAll(".bookmark-toggle").forEach(btn=>btn.addEventListener("click",()=>toggleBookmark("item",btn.dataset.bookmark)));
  $("catalog-grid").querySelectorAll(".compare-toggle").forEach(btn=>btn.addEventListener("click",()=>toggleCompare(btn.dataset.id)));
}

function activatePreset(name){
  const preset=PRESETS[name]||{};
  $("search").value=preset.q||"";$("kind-filter").value="";$("domain-filter").value="";
  $("status-filter").value=preset.status||"";$("tier-filter").value="";
  document.querySelectorAll(".preset").forEach(btn=>btn.classList.toggle("active",btn.dataset.preset===name));
  applyFilters();document.querySelector("#explore").scrollIntoView({behavior:"smooth"});
}

function toggleCompare(id){
  if(state.compare.has(id))state.compare.delete(id);else if(state.compare.size<3)state.compare.add(id);
  renderCompareDock();renderCatalog();
}

function renderCompareDock(){
  $("compare-dock").hidden=state.compare.size===0;
  $("compare-count").textContent=state.compare.size+" selected";
  $("open-compare").disabled=state.compare.size<2;
}

function openCompare(){
  const items=[...state.compare].map(id=>state.items.find(item=>item.id===id)).filter(Boolean);
  const rows=[["Kind","kind"],["Status","status"],["Type","type"],["Domains","domains"],["Model","model"],["Evidence tier","evidence_tier"],["Provenance","provenance_score"],["Upstream","upstream_health"],["Summary","summary"]];
  let markup='<table class="compare-table"><thead><tr><th>Attribute</th>'+items.map(i=>'<th>'+esc(i.name)+'</th>').join("")+'</tr></thead><tbody>';
  for(const [label,key] of rows)markup+='<tr><td>'+label+'</td>'+items.map(i=>'<td>'+esc(Array.isArray(i[key])?i[key].join(", "):(i[key]??"—"))+'</td>').join("")+'</tr>';
  $("compare-table").innerHTML=markup+"</tbody></table>";$("compare-dialog").showModal();
}

function downloadFiltered(type){
  const items=sortItems(state.filtered);let blob,name;
  if(type==="json"){blob=new Blob([JSON.stringify(items,null,2)],{type:"application/json"});name="redframeworks-query.json"}
  else{
    const fields=["id","name","kind","status","type","domains","model","evidence_tier","provenance_score","url"];
    const cell=v=>'"'+String(v??"").replaceAll('"','""')+'"';
    const csv=[fields.join(","),...items.map(i=>fields.map(f=>cell(Array.isArray(i[f])?i[f].join("|"):i[f])).join(","))].join("\n");
    blob=new Blob([csv],{type:"text/csv"});name="redframeworks-query.csv";
  }
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
}

function namesFor(ids,map,limit=4){
  const names=(ids||[]).map(id=>map.get(id)?.name||map.get(id)?.title||id);
  return names.slice(0,limit).join(" · ")+(names.length>limit?" +"+(names.length-limit):"");
}

function renderLearningPaths(){
  const items=new Map(state.items.map(i=>[i.id,i]));
  const books=new Map(state.resources.books.map(i=>[i.id,i]));
  const certs=new Map(state.resources.certifications.map(i=>[i.id,i]));
  $("learning-paths").innerHTML=state.learningPaths.map(path=>
    '<article class="path-card"><div class="path-head"><div><p class="section-kicker">'+esc(path.audience)+'</p><h3>'+esc(path.name)+'</h3></div><span class="tag">'+esc((path.domains||[]).join(" · "))+'</span></div>'+
    '<p>Relevant ecosystem map for this objective. Open individual entries for provenance and upstream context.</p>'+
    '<div class="path-stack">'+
      '<div><b>Frameworks</b><span>'+esc(namesFor(path.frameworks,items))+'</span></div>'+
      '<div><b>Tools</b><span>'+esc(namesFor(path.tools,items))+'</span></div>'+
      '<div><b>Books</b><span>'+esc(namesFor(path.books,books))+'</span></div>'+
      '<div><b>Certifications</b><span>'+esc(namesFor(path.certifications,certs))+'</span></div>'+
    '</div></article>'
  ).join("");
}

function renderTechniques(){
  const q=$("technique-search").value.trim().toLowerCase();
  const rows=state.techniques.filter(item=>!q||(item.id+" "+item.name).toLowerCase().includes(q));
  $("technique-count").textContent=rows.length+" techniques";
  $("technique-grid").innerHTML=rows.map(item=>
    '<a class="technique-card" href="detail.html?type=technique&id='+encodeURIComponent(item.id)+'"><b>'+esc(item.id)+'</b><h3>'+esc(item.name)+'</h3>'+
    '<p>'+((item.scenarios||[]).length+(item.scorecards||[]).length)+' validation refs · '+(item.defensive_context||[]).length+' defensive mappings</p></a>'
  ).join("");
}

function renderAdversaries(){
  const q=$("adversary-search").value.trim().toLowerCase();
  const type=$("adversary-type").value,motivation=$("adversary-motivation").value,sector=$("adversary-sector").value;
  const rows=state.adversaries.filter(item=>{
    const hay=[item.name,item.attack_id,item.actor_type,item.attribution,...(item.aliases||[]),...(item.motivation||[]),...(item.focus_regions||[]),...(item.sectors||[]),...(item.defensive_focus||[])].join(" ").toLowerCase();
    return(!q||hay.includes(q))&&(!type||item.actor_type===type)&&(!motivation||(item.motivation||[]).includes(motivation))&&(!sector||(item.sectors||[]).includes(sector));
  });

  const stateCount=state.adversaries.filter(i=>i.actor_type==="state-sponsored").length;
  const crimeCount=state.adversaries.filter(i=>i.actor_type==="cybercrime").length;
  const mixedCount=state.adversaries.filter(i=>!["state-sponsored","cybercrime"].includes(i.actor_type)).length;
  $("adversary-summary").innerHTML=[
    ["Tracked profiles",state.adversaries.length],["State-sponsored",stateCount],["Cybercrime",crimeCount],["Other / unresolved",mixedCount]
  ].map(([label,value])=>'<div class="adversary-metric"><strong>'+value+'</strong><span>'+esc(label)+'</span></div>').join("");

  $("adversary-grid").innerHTML=rows.map(item=>
    '<article class="adversary-card"><div class="adversary-head"><div><span class="kind-badge">'+esc(item.attack_id)+'</span><span class="status-badge verified">'+esc(item.actor_type)+'</span></div><a href="detail.html?type=adversary&id='+encodeURIComponent(item.id)+'">profile →</a></div>'+
    '<h3>'+esc(item.name)+'</h3><p>'+esc(item.attribution)+'</p>'+
    '<div class="alias-row">'+(item.aliases||[]).slice(0,5).map(v=>'<span class="tag">'+esc(v)+'</span>').join("")+'</div>'+
    '<div class="adversary-meta"><div><b>Motivation</b><span>'+esc((item.motivation||[]).join(" · "))+'</span></div>'+
    '<div><b>Sectors</b><span>'+esc((item.sectors||[]).slice(0,4).join(" · "))+'</span></div>'+
    '<div><b>Defensive focus</b><span>'+esc((item.defensive_focus||[]).slice(0,4).join(" · "))+'</span></div></div>'+
    '<div class="adversary-foot"><span>ATT&CK profile v'+esc(item.profile_version||"—")+'</span><a href="'+esc(item.source)+'" target="_blank" rel="noopener">source ↗</a></div></article>'
  ).join("")||'<article class="adversary-card"><h3>No matching profiles</h3><p>Broaden the filters.</p></article>';
}

function renderEmulationPlans(){
  const q=$("plan-search").value.trim().toLowerCase();
  const type=$("plan-type").value;
  const rows=state.emulationPlans.filter(item=>{
    const hay=[item.name,item.actor,item.attack_group_id,item.plan_type,item.provider,item.purpose,...(item.defensive_focus||[])].join(" ").toLowerCase();
    return(!q||hay.includes(q))&&(!type||item.plan_type===type);
  });
  $("emulation-plan-grid").innerHTML=rows.map(item=>
    '<article class="emulation-plan-card"><div class="plan-card-head"><span>'+esc(item.source_tier)+' · '+esc(item.plan_type)+'</span><b>'+esc(item.attack_group_id||"multi")+'</b></div>'+
    '<h4>'+esc(item.name)+'</h4><p>'+esc(item.purpose)+'</p>'+
    '<div class="tag-row">'+(item.defensive_focus||[]).slice(0,5).map(v=>'<span class="tag">'+esc(v)+'</span>').join("")+'</div>'+
    '<div class="plan-card-foot"><span>'+esc(item.provider)+'</span><a href="'+esc(item.source)+'" target="_blank" rel="noopener">official source ↗</a></div></article>'
  ).join("")||'<article class="emulation-plan-card"><h4>No matching plans</h4><p>Broaden the filters.</p></article>';
}

function renderIntelSources(){
  $("intel-source-grid").innerHTML=state.intelligenceSources.map(item=>
    '<a class="intel-source-card" href="'+esc(item.url)+'" target="_blank" rel="noopener"><span>'+esc(item.source_tier)+' · '+esc(item.category)+'</span><strong>'+esc(item.name)+'</strong><p>'+esc(item.note)+'</p><small>'+esc((item.focus||[]).join(" · "))+'</small></a>'
  ).join("");
}

function graphEntities(){
  return [...state.items].sort((a,b)=>(a.name||"").localeCompare(b.name||""));
}

function graphCluster(item){
  const text=[item?.type,...(item?.domains||[])].join(" ").toLowerCase();
  if(/ai|genai|llm|atlas/.test(text))return "AI / GenAI";
  if(/cloud|aws|azure|gcp|kubernetes|container|identity/.test(text))return "Cloud / Identity";
  if(/detection|telemetry|purple|hunting|siem|response/.test(text))return "Detection / Purple";
  if(/iot|ics|ot|embedded|mobile|firmware/.test(text))return "Edge / IoT / OT";
  if(/web|api|application|appsec|software|supply-chain/.test(text))return "AppSec / Software";
  if(/threat-intelligence|adversary|attack|emulation|cti|behavior/.test(text))return "Threat / Emulation";
  if(item?.kind==="framework")return "Frameworks";
  return "Operations / Research";
}

function graphClusterColor(name){
  return {
    "Threat / Emulation":"#f24861","Frameworks":"#a997ff","Detection / Purple":"#63d89a",
    "Cloud / Identity":"#79b9ff","AI / GenAI":"#efbd67","Edge / IoT / OT":"#67d8df",
    "AppSec / Software":"#ff8d65","Operations / Research":"#8b96a7"
  }[name]||"#8b96a7";
}

function graphFilteredEdges(){
  const confidence=$("graph-confidence")?.value||"";
  const domain=$("graph-domain")?.value||"";
  const map=new Map(state.items.map(i=>[i.id,i]));
  return state.relationships.filter(edge=>{
    if(confidence&&edge.confidence!==confidence)return false;
    if(domain){
      const a=map.get(edge.from),b=map.get(edge.to);
      if(!(a?.domains||[]).includes(domain)&&!(b?.domains||[]).includes(domain))return false;
    }
    return true;
  });
}

function setupGraph(){
  const entities=graphEntities();
  for(const select of[$("graph-select"),$("path-from"),$("path-to")]){
    select.innerHTML="";
    optionize(select,entities.map(i=>i.id),id=>entities.find(i=>i.id===id)?.name||id);
  }
  const domains=unique(entities.flatMap(item=>item.domains||[]));
  $("graph-domain").innerHTML='<option value="">All domains</option>';
  optionize($("graph-domain"),domains);
  $("graph-select").value=entities.some(i=>i.id==="mitre-attack")?"mitre-attack":entities[0]?.id||"";
  $("path-from").value=entities.some(i=>i.id==="mitre-attack")?"mitre-attack":entities[0]?.id||"";
  $("path-to").value=entities.some(i=>i.id==="sigma")?"sigma":entities.at(-1)?.id||"";
  renderGraph();
}

function renderGraphKpis(edges,nodes){
  const high=edges.filter(e=>e.confidence==="high").length;
  const medium=edges.filter(e=>e.confidence==="medium").length;
  const research=state.items.filter(i=>i.status==="not-verified").length;
  const values=[
    ["Visible nodes",nodes.length],["Visible edges",edges.length],["High confidence",high],
    ["Medium confidence",medium],["Research frontier",research]
  ];
  $("graph-kpis").innerHTML=values.map(([label,value])=>
    '<div class="graph-kpi"><strong>'+value+'</strong><span>'+esc(label)+'</span></div>'
  ).join("");
}

function graphNodeMarkup(item,x,y,radius,classes=""){
  const label=(item?.name||item?.id||"unknown");
  const short=label.length>22?label.slice(0,20)+"…":label;
  const color=graphClusterColor(graphCluster(item));
  return '<g tabindex="0" role="button" class="graph-node '+classes+'" data-id="'+esc(item.id)+'" transform="translate('+x+' '+y+')">'+
    '<circle r="'+radius+'" style="stroke:'+color+'"></circle>'+
    '<text text-anchor="middle" dy="3">'+esc(short)+'</text>'+
    '<title>'+esc(label+" · "+graphCluster(item))+'</title></g>';
}

function bindGraphNodes(svg){
  svg.querySelectorAll(".graph-node").forEach(node=>{
    const activate=()=>{
      $("graph-select").value=node.dataset.id;
      $("graph-mode").value="neighborhood";
      renderGraph();
    };
    node.addEventListener("click",activate);
    node.addEventListener("keydown",event=>{
      if(event.key==="Enter"||event.key===" "){event.preventDefault();activate()}
    });
  });
}

function renderNeighborhoodGraph(svg,focus,edges,map){
  const related=edges.filter(e=>e.from===focus||e.to===focus);
  const neighbors=unique(related.map(e=>e.from===focus?e.to:e.from)).slice(0,28);
  const cx=600,cy=340,r=Math.min(245+neighbors.length*2.4,300);
  let markup="";
  neighbors.forEach((id,index)=>{
    const angle=Math.PI*2*index/Math.max(neighbors.length,1)-Math.PI/2;
    const x=cx+Math.cos(angle)*r,y=cy+Math.sin(angle)*r;
    const edge=related.find(e=>(e.from===focus&&e.to===id)||(e.to===focus&&e.from===id));
    const pathClass=state.graphPath.edges.has(edgeKey(focus,id))?" path":"";
    markup+='<line class="graph-edge '+esc(edge?.confidence||"")+pathClass+'" x1="'+cx+'" y1="'+cy+'" x2="'+x+'" y2="'+y+'"><title>'+esc(edge?.relation||"relationship")+'</title></line>';
  });
  const focusItem=map.get(focus);
  markup+=graphNodeMarkup(focusItem,cx,cy,60,"center"+(state.graphPath.nodes.has(focus)?" path":""));
  neighbors.forEach((id,index)=>{
    const angle=Math.PI*2*index/Math.max(neighbors.length,1)-Math.PI/2;
    const x=cx+Math.cos(angle)*r,y=cy+Math.sin(angle)*r;
    markup+=graphNodeMarkup(map.get(id),x,y,40,state.graphPath.nodes.has(id)?"path":"");
  });
  svg.innerHTML=markup;
  bindGraphNodes(svg);
  $("graph-view-label").textContent="FOCUSED NEIGHBORHOOD";
  $("graph-view-title").textContent=focusItem?.name||focus;
  return [focusItem,...neighbors.map(id=>map.get(id)).filter(Boolean)];
}

function renderClusterGraph(svg,edges,map,researchOnly=false){
  const degree=new Map();
  for(const edge of edges){
    degree.set(edge.from,(degree.get(edge.from)||0)+1);
    degree.set(edge.to,(degree.get(edge.to)||0)+1);
  }
  let candidates=researchOnly
    ?state.items.filter(i=>i.status==="not-verified")
    :[...degree.keys()].map(id=>map.get(id)).filter(Boolean);
  const domain=$("graph-domain").value;
  if(domain)candidates=candidates.filter(i=>(i.domains||[]).includes(domain));
  candidates.sort((a,b)=>(degree.get(b.id)||0)-(degree.get(a.id)||0)||a.name.localeCompare(b.name));
  candidates=candidates.slice(0,researchOnly?64:56);

  const groups=new Map();
  for(const item of candidates){
    const cluster=graphCluster(item);
    if(!groups.has(cluster))groups.set(cluster,[]);
    groups.get(cluster).push(item);
  }
  const centers={
    "Threat / Emulation":[220,170],"Frameworks":[600,125],"AppSec / Software":[990,180],
    "Cloud / Identity":[1010,500],"Detection / Purple":[610,560],"Edge / IoT / OT":[210,505],
    "AI / GenAI":[860,335],"Operations / Research":[420,335]
  };
  const positions=new Map();
  for(const [cluster,items] of groups){
    const [cx,cy]=centers[cluster]||[600,340];
    const rr=Math.min(42+items.length*3.6,112);
    items.forEach((item,index)=>{
      const angle=Math.PI*2*index/Math.max(items.length,1)-Math.PI/2;
      positions.set(item.id,[cx+Math.cos(angle)*rr,cy+Math.sin(angle)*rr]);
    });
  }

  const visible=new Set(candidates.map(i=>i.id));
  let markup="";
  for(const edge of edges){
    if(!visible.has(edge.from)||!visible.has(edge.to))continue;
    const a=positions.get(edge.from),b=positions.get(edge.to);
    if(!a||!b)continue;
    const pathClass=state.graphPath.edges.has(edgeKey(edge.from,edge.to))?" path":"";
    markup+='<line class="graph-edge '+esc(edge.confidence||"")+pathClass+'" x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'"><title>'+esc(edge.relation)+'</title></line>';
  }
  for(const item of candidates){
    const pos=positions.get(item.id);
    markup+=graphNodeMarkup(item,pos[0],pos[1],researchOnly?30:34,
      (item.status==="not-verified"?"research-node ":"")+(state.graphPath.nodes.has(item.id)?"path":""));
  }
  for(const [cluster,items] of groups){
    const [cx,cy]=centers[cluster]||[600,340];
    markup+='<text class="graph-cluster-label" x="'+cx+'" y="'+(cy-128)+'" text-anchor="middle">'+esc(cluster)+' · '+items.length+'</text>';
  }
  svg.innerHTML=markup;
  bindGraphNodes(svg);
  $("graph-view-label").textContent=researchOnly?"RESEARCH FRONTIER":"DOMAIN CLUSTERS";
  $("graph-view-title").textContent=researchOnly?state.items.filter(i=>i.status==="not-verified").length+" NOT VERIFIED candidates":groups.size+" ecosystem clusters";
  return candidates;
}

function renderGraphDetail(focus,map,edges){
  const item=map.get(focus);
  if(!item){$("graph-detail").innerHTML="";return}
  const related=edges.filter(e=>e.from===focus||e.to===focus);
  const rels=related.slice(0,18).map(edge=>{
    const other=edge.from===focus?edge.to:edge.from,otherItem=map.get(other);
    const refs=(edge.source_refs||[]).join(", ");
    return '<div class="graph-relation"><div class="graph-relation-top"><b>'+esc(edge.relation)+'</b><span class="confidence-pill '+esc(edge.confidence||"")+'">'+esc(edge.confidence||"unrated")+'</span></div>'+
      '<span>'+esc(edge.provenance||"curated")+(refs?' · refs: '+esc(refs):'')+'</span><br>'+
      '<a href="detail.html?type=entity&id='+encodeURIComponent(other)+'">'+esc(otherItem?.name||other)+' →</a></div>';
  }).join("");
  $("graph-detail").innerHTML=
    '<p class="section-kicker">'+esc(graphCluster(item))+'</p><h3>'+esc(item.name||focus)+'</h3>'+
    '<p>'+esc(item.summary||"Curated relationship context.")+'</p>'+
    '<div class="graph-entity-meta"><span class="status-badge '+statusClass(item.status)+'">'+esc(item.status)+'</span>'+
    '<span class="tag">Tier '+esc(item.evidence_tier||"—")+'</span><span class="tag">Provenance '+esc(item.provenance_score??"—")+'</span></div>'+
    '<div class="tag-row">'+(item.domains||[]).slice(0,7).map(d=>'<span class="tag">'+esc(d)+'</span>').join("")+'</div>'+
    '<div class="graph-relations">'+(rels||'<span class="empty-mini">No relationship survives the current filters.</span>')+'</div>';
}

function renderGraph(){
  const mode=$("graph-mode").value;
  const map=new Map(state.items.map(i=>[i.id,i]));
  const edges=graphFilteredEdges();
  const svg=$("relationship-graph");
  const focus=$("graph-select").value;
  let visible=[];
  if(mode==="clusters")visible=renderClusterGraph(svg,edges,map,false);
  else if(mode==="research")visible=renderClusterGraph(svg,edges,map,true);
  else visible=renderNeighborhoodGraph(svg,focus,edges,map);

  renderGraphKpis(edges,visible);
  renderGraphDetail(focus,map,edges);

  const clusters=unique(visible.filter(Boolean).map(graphCluster));
  $("graph-legend").innerHTML=clusters.slice(0,8).map(name=>
    '<span><i style="--legend:'+graphClusterColor(name)+'"></i>'+esc(name)+'</span>'
  ).join("");
}

function findGraphEntity(){
  const q=$("graph-search").value.trim().toLowerCase();
  if(!q)return;
  const item=state.items.find(i=>
    i.id.toLowerCase()===q||(i.name||"").toLowerCase().includes(q)||(i.aliases||[]).some(a=>a.toLowerCase().includes(q))
  );
  if(!item){$("path-result").textContent="Entity not found in the current catalog.";return}
  $("graph-select").value=item.id;
  $("graph-mode").value="neighborhood";
  renderGraph();
  $("path-result").innerHTML='<strong>Focused:</strong>&nbsp;'+esc(item.name);
}

function resetGraph(){
  $("graph-mode").value="neighborhood";$("graph-domain").value="";$("graph-confidence").value="";$("graph-search").value="";
  const entities=graphEntities();
  $("graph-select").value=entities.some(i=>i.id==="mitre-attack")?"mitre-attack":entities[0]?.id||"";
  state.graphPath={nodes:new Set(),edges:new Set()};
  $("path-result").textContent="Select two entities to trace a relationship path.";
  renderGraph();
}

function findGraphPath(){
  const start=$("path-from").value,target=$("path-to").value;
  const adj=new Map();
  for(const edge of state.relationships){
    if(!adj.has(edge.from))adj.set(edge.from,[]);
    if(!adj.has(edge.to))adj.set(edge.to,[]);
    adj.get(edge.from).push(edge.to);adj.get(edge.to).push(edge.from);
  }
  const queue=[[start]],seen=new Set([start]);let found=null;
  while(queue.length){
    const path=queue.shift(),node=path.at(-1);
    if(node===target){found=path;break}
    for(const next of adj.get(node)||[])if(!seen.has(next)){seen.add(next);queue.push([...path,next])}
  }
  state.graphPath={nodes:new Set(),edges:new Set()};
  if(found){
    found.forEach(id=>state.graphPath.nodes.add(id));
    for(let i=0;i<found.length-1;i++)state.graphPath.edges.add(edgeKey(found[i],found[i+1]));
    const map=new Map(state.items.map(i=>[i.id,i]));
    $("path-result").innerHTML='<strong>'+Math.max(found.length-1,0)+' hops</strong>&nbsp; '+found.map(id=>esc(map.get(id)?.name||id)).join(" → ");
    $("graph-select").value=start;$("graph-mode").value="neighborhood";renderGraph();
  }else{
    $("path-result").textContent="No curated relationship path exists between those entities yet.";renderGraph();
  }
}

function deriveVerification(){
  if(state.verification.entries?.length)return;
  state.verification.entries=state.items.filter(i=>i.status==="not-verified").map(i=>({
    id:i.id,name:i.name,domains:i.domains||[],readiness_percent:i.url?35:20,
    upstream_health:i.upstream_health||"not-checked",next_actions:["canonical_url","model","evidence_tier"].filter(k=>k!=="canonical_url"||!i.url)
  }));
  state.verification.count=state.verification.entries.length;
}

function renderResearch(){
  deriveVerification();
  const entries=state.verification.entries||[];
  const ready=entries.filter(i=>i.readiness_percent>=75).length,mid=entries.filter(i=>i.readiness_percent>=50&&i.readiness_percent<75).length;
  $("research-summary").innerHTML=[
    ["NOT VERIFIED",entries.length],["75%+ ready",ready],["50–74%",mid],["Needs deep review",entries.length-ready-mid]
  ].map(([label,value])=>'<div class="research-metric"><strong>'+value+'</strong><span>'+label+'</span></div>').join("");
  const q=$("research-search").value.trim().toLowerCase(),threshold=$("research-readiness").value;
  const rows=entries.filter(item=>{
    const text=(item.name+" "+(item.domains||[]).join(" ")).toLowerCase();
    const passQ=!q||text.includes(q);
    if(threshold==="0")return passQ&&item.readiness_percent<50;
    return passQ&&(!threshold||item.readiness_percent>=Number(threshold));
  });
  $("research-grid").innerHTML=rows.map(item=>
    '<article class="research-card"><h3>'+esc(item.name)+'</h3><p>'+esc((item.domains||[]).join(" · "))+' · upstream '+esc(item.upstream_health||"not-checked")+'</p>'+
    '<div class="readiness-row"><div class="readiness-track"><div class="readiness-fill" style="width:'+Number(item.readiness_percent||0)+'%"></div></div><b>'+Number(item.readiness_percent||0)+'%</b></div>'+
    '<div class="missing-tags">'+(item.next_actions||[]).map(a=>'<span>'+esc(a)+'</span>').join("")+'</div></article>'
  ).join("")||'<article class="research-card"><h3>No matches</h3></article>';
}

function renderResources(){
  const mode=state.resourceMode,source=mode==="books"?state.resources.books:state.resources.certifications;
  const q=$("resource-search").value.trim().toLowerCase(),level=$("resource-level").value;
  const rows=source.filter(item=>{
    const name=mode==="books"?item.title:item.name;
    const hay=[name,item.publisher,item.provider,item.level,item.note,...(item.domains||[]),...(item.authors||[])].filter(Boolean).join(" ").toLowerCase();
    return(!q||hay.includes(q))&&(!level||item.level===level);
  });
  $("resource-grid").innerHTML=rows.map(item=>{
    const kind=mode==="books"?"book":"cert",id=item.id,name=mode==="books"?item.title:item.name,saved=state.bookmarks.has(bookmarkKey(kind,id));
    const owner=mode==="books"?(item.authors||[]).join(", "):item.provider;
    const meta=mode==="books"?(item.publisher+" · "+item.year):(item.provider+" · "+item.level);
    return '<article class="resource-card"><div class="resource-meta"><span>'+esc(mode.slice(0,-1))+'</span><button class="bookmark-toggle '+(saved?"saved":"")+'" data-resource-bookmark="'+kind+":"+esc(id)+'">★</button></div>'+
      '<h3>'+esc(name)+'</h3><span class="resource-authors">'+esc(owner||"")+'</span><p>'+esc(item.note||"")+'</p><div class="tag-row">'+(item.domains||[]).slice(0,4).map(d=>'<span class="tag">'+esc(d)+'</span>').join("")+
      '</div><a href="'+esc(item.url)+'" target="_blank" rel="noopener">'+esc(meta)+' · official source ↗</a></article>';
  }).join("");
  $("resource-grid").querySelectorAll("[data-resource-bookmark]").forEach(btn=>btn.addEventListener("click",()=>{
    const [kind,id]=btn.dataset.resourceBookmark.split(":");toggleBookmark(kind,id);
  }));
}

function renderCoverage(){
  const records=[...state.coverage].sort((a,b)=>String(a.date).localeCompare(String(b.date))),svg=$("coverage-chart");
  if(!records.length){svg.innerHTML='<text x="20" y="40">No scorecard metrics available.</text>';return}
  const W=760,H=320,p={l:38,r:18,t:18,b:34},x=i=>p.l+i*((W-p.l-p.r)/Math.max(records.length-1,1)),y=v=>H-p.b-(Number(v)/100)*(H-p.t-p.b);
  const metrics=[["telemetry","#79b9ff"],["detection","#f24861"],["analyst_response","#a997ff"],["containment","#efbd67"],["evidence","#63d89a"]];
  let markup="";
  for(let v=0;v<=100;v+=25)markup+='<line x1="'+p.l+'" y1="'+y(v)+'" x2="'+(W-p.r)+'" y2="'+y(v)+'" stroke="#2a3442"></line><text x="5" y="'+(y(v)+3)+'" fill="#738092" font-size="9">'+v+'</text>';
  records.forEach((row,i)=>markup+='<text x="'+x(i)+'" y="'+(H-9)+'" text-anchor="middle" fill="#738092" font-size="9">'+esc(row.phase||row.date)+'</text>');
  for(const [metric,color] of metrics){
    const points=records.map((row,i)=>x(i)+","+y(row.scores?.[metric]??0)).join(" ");
    markup+='<polyline fill="none" stroke="'+color+'" stroke-width="2.5" points="'+points+'"></polyline>';
    records.forEach((row,i)=>markup+='<circle cx="'+x(i)+'" cy="'+y(row.scores?.[metric]??0)+'" r="4" fill="'+color+'"></circle>');
  }
  svg.innerHTML=markup;$("coverage-legend").innerHTML=metrics.map(([m,c])=>'<span><i style="--c:'+c+'"></i>'+esc(m.replaceAll("_"," "))+'</span>').join("");
}

function renderEvidence(){
  $("evidence-chart").innerHTML=(state.evidence||[]).map(row=>
    '<div class="evidence-row"><b>'+esc(row.evidence_level||"E0")+'</b><div class="evidence-track"><div class="evidence-fill" style="width:'+Number(row.evidence_score||0)+'%"></div></div><b>'+Number(row.evidence_score||0)+'</b></div>'
  ).join("")||'<span class="empty-mini">No evidence trend.</span>';
}

function renderRegressions(){
  const rows=state.regressions||[];
  $("regression-panel").innerHTML=rows.length
    ?rows.slice(0,6).map(r=>'<div class="regression-item"><b>'+esc(r.metric)+' '+esc(r.delta)+'</b><span>'+esc(r.from_date)+' → '+esc(r.to_date)+' · '+esc(r.before)+' → '+esc(r.after)+'</span></div>').join("")
    :'<div class="regression-ok"><strong>0</strong><span>regressions in the loaded repository scorecards</span></div>';
}

function renderHeatmap(){
  const metrics=["telemetry","detection","analyst_response","containment","evidence"];
  if(!state.heatmap.length){$("coverage-heatmap").innerHTML='<span class="empty-mini">No domain heatmap available.</span>';return}
  let markup='<table class="heatmap-table"><thead><tr><th>Domain</th>'+metrics.map(m=>'<th>'+esc(m.replaceAll("_"," "))+'</th>').join("")+'</tr></thead><tbody>';
  for(const row of state.heatmap){
    markup+='<tr><th>'+esc(row.domain)+'</th>'+metrics.map(metric=>{
      const value=row.metrics?.[metric];
      return '<td class="heat-cell" style="--heat:'+Number(value||0)+'%">'+(value==null?"—":Number(value).toFixed(0))+'</td>';
    }).join("")+'</tr>';
  }
  $("coverage-heatmap").innerHTML=markup+'</tbody></table>';
}

function renderScenarioSummary(){
  const rows=state.scenarioSummary||[];
  $("scenario-summary").innerHTML=rows.length?rows.map(row=>
    '<div class="scenario-row"><div><strong>'+esc(row.name||row.scenario_id)+'</strong><span>'+esc(row.domain||"")+" · "+esc(row.latest_phase||"")+'</span></div>'+
    '<span>'+esc(row.evidence_level||"—")+' · '+esc(row.result||"—")+'</span><span class="scenario-score">'+esc(row.composite??"—")+'</span></div>'
  ).join(""):'<span class="empty-mini">No scenario comparison available.</span>';
}

function importScorecard(file){
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const doc=JSON.parse(String(reader.result)),scores=doc.scores;
      if(!scores||typeof scores!=="object")throw new Error("Missing scores object");
      const allowed=["telemetry","detection","analyst_response","containment","evidence"],rows=[];
      for(const key of allowed)if(scores[key]!=null){
        const value=Number(scores[key]);if(!Number.isFinite(value)||value<0||value>100)throw new Error(key+" must be 0–100");
        rows.push([key,value]);
      }
      if(!rows.length)throw new Error("No supported metrics");
      $("imported-scorecard").innerHTML='<div class="local-bars">'+rows.map(([key,value])=>
        '<div class="local-bar"><span>'+esc(key.replaceAll("_"," "))+'</span><i style="--w:'+value+'%"></i><b>'+value+'</b></div>'
      ).join("")+'</div>';
    }catch(error){$("imported-scorecard").textContent="Invalid scorecard: "+error.message}
  };
  reader.readAsText(file);
}

function renderTimeline(){
  const events=[];
  for(const item of state.standards)events.push({date:item.version_date||"0000-00-00",title:item.name+" "+(item.version||""),text:"Standards intelligence · "+(item.note||item.status||"tracked")});
  for(const event of state.lifecycle.events||[])events.push({date:event.reviewed||event.date||"0000-00-00",title:(event.entity||"Lifecycle")+" · "+(event.event||"change"),text:event.note||event.status||""});
  for(const release of state.changelog.releases||[])events.push({date:release.date||"0000-00-00",title:"RedFrameworks "+release.version,text:(release.changes||[]).map(c=>c.area).filter(Boolean).slice(0,3).join(" · ")});
  events.sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  $("timeline-list").innerHTML=events.slice(0,30).map(e=>
    '<article class="timeline-item"><time>'+esc(e.date)+'</time><h3>'+esc(e.title)+'</h3><p>'+esc(e.text)+'</p></article>'
  ).join("");
}

function buildCommandIndex(){
  const list=[];
  for(const item of state.items)list.push({kind:item.kind,label:item.name,detail:(item.domains||[]).join(" · "),href:"detail.html?type=entity&id="+encodeURIComponent(item.id)});
  for(const item of state.resources.books)list.push({kind:"book",label:item.title,detail:(item.authors||[]).join(", "),href:item.url});
  for(const item of state.resources.certifications)list.push({kind:"cert",label:item.name,detail:item.provider+" · "+item.level,href:item.url});
  for(const path of state.learningPaths)list.push({kind:"path",label:path.name,detail:path.audience+" · "+(path.domains||[]).join(" · "),href:"#paths"});
  for(const item of state.techniques)list.push({kind:"technique",label:item.id+" · "+item.name,detail:"ATT&CK technique intelligence",href:"detail.html?type=technique&id="+encodeURIComponent(item.id)});
  for(const item of state.adversaries)list.push({kind:"adversary",label:item.name,detail:item.attack_id+" · "+item.actor_type+" · "+(item.aliases||[]).slice(0,3).join(" · "),href:"detail.html?type=adversary&id="+encodeURIComponent(item.id)});
  for(const item of state.intelligenceSources)list.push({kind:"source",label:item.name,detail:item.category+" · "+(item.focus||[]).slice(0,3).join(" · "),href:item.url});
  for(const item of state.emulationPlans)list.push({kind:"plan",label:item.name,detail:item.actor+" · "+item.plan_type+" · "+(item.defensive_focus||[]).slice(0,3).join(" · "),href:item.source});
  state.commandItems=list;
}

function renderCommandResults(){
  const q=$("command-input").value.trim().toLowerCase();
  const rows=state.commandItems.filter(item=>!q||(item.label+" "+item.detail+" "+item.kind).toLowerCase().includes(q)).slice(0,12);
  state.commandIndex=Math.min(state.commandIndex,Math.max(rows.length-1,0));
  $("command-results").innerHTML=rows.map((item,index)=>
    '<a class="command-result '+(index===state.commandIndex?"active":"")+'" data-command-index="'+index+'" href="'+esc(item.href)+'">'+
    '<span>'+esc(item.kind.slice(0,2).toUpperCase())+'</span><div><strong>'+esc(item.label)+'</strong><small>'+esc(item.detail)+'</small></div><small>'+esc(item.kind)+'</small></a>'
  ).join("")||'<div class="command-result"><span>--</span><div><strong>No matches</strong><small>Try a broader query.</small></div></div>';
}

function openCommand(){
  $("command-dialog").showModal();$("command-input").value="";state.commandIndex=0;renderCommandResults();setTimeout(()=>$("command-input").focus(),0);
}

function setupCommandPalette(){
  const trigger=()=>openCommand();
  $("command-trigger").addEventListener("click",trigger);$("hero-command").addEventListener("click",trigger);
  document.addEventListener("keydown",event=>{
    if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();openCommand()}
  });
  $("command-input").addEventListener("input",()=>{state.commandIndex=0;renderCommandResults()});
  $("command-input").addEventListener("keydown",event=>{
    const rows=[...$("command-results").querySelectorAll(".command-result[href]")];
    if(event.key==="ArrowDown"){event.preventDefault();state.commandIndex=Math.min(state.commandIndex+1,rows.length-1);renderCommandResults()}
    else if(event.key==="ArrowUp"){event.preventDefault();state.commandIndex=Math.max(state.commandIndex-1,0);renderCommandResults()}
    else if(event.key==="Enter"&&rows[state.commandIndex]){event.preventDefault();rows[state.commandIndex].click()}
  });
}

function setupNavigation(){
  const links=[...document.querySelectorAll(".nav-link")],sections=links.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible)links.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+visible.target.id));
  },{rootMargin:"-25% 0px -62% 0px",threshold:[0,.2,.5]});
  sections.forEach(section=>observer.observe(section));
}

async function init(){
  applyTheme();
  const [catalog,resources,paths,techniques,adversaries,intelligenceSources,emulationPlans,verification,standards,coverage,regressions,evidence,heatmap,scenarioSummary,lifecycle,changelog]=await Promise.all([
    loadJson("data/catalog.json",{items:[],relationships:[],updated:""}),
    loadJson("data/resources.json",{books:[],certifications:[]}),
    loadJson("data/learning-paths.json",{paths:[]}),
    loadJson("data/techniques.json",[]),
    loadJson("data/adversaries.json",{adversaries:[]}),
    loadJson("data/intelligence-sources.json",{sources:[]}),
    loadJson("data/emulation-plans.json",{plans:[]}),
    loadJson("data/verification-queue.json",{count:0,entries:[]}),
    loadJson("data/standards-intelligence.json",{standards:[]}),
    loadJson("data/coverage-series.json",{records:[]}),
    loadJson("data/regressions.json",{regressions:[]}),
    loadJson("data/evidence-trend.json",{records:[]}),
    loadJson("data/coverage-heatmap.json",{domains:[]}),
    loadJson("data/scenario-summary.json",{scenarios:[]}),
    loadJson("api/v3/lifecycle.json",{events:[]}),
    loadJson("api/v3/changelog.json",{releases:[]})
  ]);
  state.items=catalog.items||[];state.relationships=catalog.relationships||[];state.resources=resources;
  state.learningPaths=paths.paths||[];state.techniques=techniques||[];state.adversaries=adversaries.adversaries||[];state.intelligenceSources=intelligenceSources.sources||[];state.emulationPlans=emulationPlans.plans||[];state.verification=verification;
  state.standards=standards.standards||[];state.coverage=coverage.records||[];state.regressions=regressions.regressions||[];
  state.evidence=evidence.records||[];state.heatmap=heatmap.domains||[];state.scenarioSummary=scenarioSummary.scenarios||[];state.lifecycle=lifecycle;state.changelog=changelog;

  optionize($("domain-filter"),unique(state.items.flatMap(i=>i.domains||[])));
  optionize($("status-filter"),unique(state.items.map(i=>i.status)));
  optionize($("adversary-type"),unique(state.adversaries.map(i=>i.actor_type)));
  optionize($("adversary-motivation"),unique(state.adversaries.flatMap(i=>i.motivation||[])));
  optionize($("adversary-sector"),unique(state.adversaries.flatMap(i=>i.sectors||[])));
  optionize($("plan-type"),unique(state.emulationPlans.map(i=>i.plan_type)));
  readLocalState();
  $("sidebar-updated").textContent="reviewed "+(catalog.updated||"—");

  renderMetrics();renderStandardsTicker();renderBookmarks();renderLearningPaths();renderTechniques();renderAdversaries();renderEmulationPlans();renderIntelSources();
  setupGraph();renderResearch();renderResources();renderCoverage();renderEvidence();renderRegressions();renderHeatmap();renderScenarioSummary();renderTimeline();
  buildCommandIndex();setupCommandPalette();setupNavigation();

  for(const id of["search","kind-filter","domain-filter","status-filter","tier-filter","sort"]){
    $(id).addEventListener(id==="search"?"input":"change",applyFilters);
  }
  document.querySelectorAll(".preset").forEach(btn=>btn.addEventListener("click",()=>activatePreset(btn.dataset.preset)));
  $("reset").addEventListener("click",()=>{
    $("search").value="";$("kind-filter").value="";$("domain-filter").value="";$("status-filter").value="";$("tier-filter").value="";$("sort").value="name";
    document.querySelectorAll(".preset").forEach(btn=>btn.classList.toggle("active",btn.dataset.preset==="all"));applyFilters();
  });
  $("density").addEventListener("click",()=>{state.compact=!state.compact;$("catalog-grid").classList.toggle("compact",state.compact);$("density").textContent=state.compact?"Cards":"Compact";syncUrl()});
  $("export-json").addEventListener("click",()=>downloadFiltered("json"));$("export-csv").addEventListener("click",()=>downloadFiltered("csv"));
  $("technique-search").addEventListener("input",renderTechniques);
  $("adversary-search").addEventListener("input",renderAdversaries);
  $("adversary-type").addEventListener("change",renderAdversaries);
  $("adversary-motivation").addEventListener("change",renderAdversaries);
  $("adversary-sector").addEventListener("change",renderAdversaries);
  $("plan-search").addEventListener("input",renderEmulationPlans);
  $("plan-type").addEventListener("change",renderEmulationPlans);
  $("graph-select").addEventListener("change",renderGraph);
  $("graph-mode").addEventListener("change",renderGraph);
  $("graph-domain").addEventListener("change",renderGraph);
  $("graph-confidence").addEventListener("change",renderGraph);
  $("graph-search").addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();findGraphEntity()}});
  $("graph-search").addEventListener("search",()=>{if(!$("graph-search").value)renderGraph()});
  $("graph-reset").addEventListener("click",resetGraph);
  $("find-path").addEventListener("click",findGraphPath);
  $("research-search").addEventListener("input",renderResearch);$("research-readiness").addEventListener("change",renderResearch);
  document.querySelectorAll(".resource-tab").forEach(btn=>btn.addEventListener("click",()=>{state.resourceMode=btn.dataset.resource;document.querySelectorAll(".resource-tab").forEach(b=>b.classList.toggle("active",b===btn));renderResources()}));
  $("resource-search").addEventListener("input",renderResources);$("resource-level").addEventListener("change",renderResources);
  $("scorecard-file").addEventListener("change",event=>importScorecard(event.target.files?.[0]));
  $("theme-toggle").addEventListener("click",toggleTheme);$("language").addEventListener("change",()=>{state.lang=$("language").value;localStorage.setItem("rf-lang",state.lang);renderBookmarks()});
  $("clear-compare").addEventListener("click",()=>{state.compare.clear();renderCompareDock();renderCatalog()});
  $("open-compare").addEventListener("click",openCompare);$("close-compare").addEventListener("click",()=>$("compare-dialog").close());

  applyFilters();renderCompareDock();
}

init().catch(error=>{
  console.error(error);
  $("catalog-grid").innerHTML='<article class="entry-card"><h3>Portal failed to load</h3><p>'+esc(error.message)+'</p></article>';
});
