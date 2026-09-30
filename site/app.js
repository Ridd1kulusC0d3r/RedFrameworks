const state={
  items:[],relationships:[],resources:{books:[],certifications:[]},learningPaths:[],techniques:[],
  adversaries:[],intelligenceSources:[],
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
    return item?{name:item.name,href:"entity/"+encodeURIComponent(id)+"/"}:null;
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
    '<div class="entry-actions">'+source+'<a href="entity/'+encodeURIComponent(item.id)+'/">entity →</a>'+
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
    '<a class="technique-card" href="technique/'+esc(item.id.toLowerCase())+'/"><b>'+esc(item.id)+'</b><h3>'+esc(item.name)+'</h3>'+
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
    '<article class="adversary-card"><div class="adversary-head"><div><span class="kind-badge">'+esc(item.attack_id)+'</span><span class="status-badge verified">'+esc(item.actor_type)+'</span></div><a href="adversary/'+esc(item.id)+'/">profile →</a></div>'+
    '<h3>'+esc(item.name)+'</h3><p>'+esc(item.attribution)+'</p>'+
    '<div class="alias-row">'+(item.aliases||[]).slice(0,5).map(v=>'<span class="tag">'+esc(v)+'</span>').join("")+'</div>'+
    '<div class="adversary-meta"><div><b>Motivation</b><span>'+esc((item.motivation||[]).join(" · "))+'</span></div>'+
    '<div><b>Sectors</b><span>'+esc((item.sectors||[]).slice(0,4).join(" · "))+'</span></div>'+
    '<div><b>Defensive focus</b><span>'+esc((item.defensive_focus||[]).slice(0,4).join(" · "))+'</span></div></div>'+
    '<div class="adversary-foot"><span>ATT&CK profile v'+esc(item.profile_version||"—")+'</span><a href="'+esc(item.source)+'" target="_blank" rel="noopener">source ↗</a></div></article>'
  ).join("")||'<article class="adversary-card"><h3>No matching profiles</h3><p>Broaden the filters.</p></article>';
}

function renderIntelSources(){
  $("intel-source-grid").innerHTML=state.intelligenceSources.map(item=>
    '<a class="intel-source-card" href="'+esc(item.url)+'" target="_blank" rel="noopener"><span>'+esc(item.source_tier)+' · '+esc(item.category)+'</span><strong>'+esc(item.name)+'</strong><p>'+esc(item.note)+'</p><small>'+esc((item.focus||[]).join(" · "))+'</small></a>'
  ).join("");
}

function graphEntities(){
  const ids=new Set(state.relationships.flatMap(edge=>[edge.from,edge.to]));
  return state.items.filter(item=>ids.has(item.id)).sort((a,b)=>a.name.localeCompare(b.name));
}

function setupGraph(){
  const entities=graphEntities();
  for(const select of[$("graph-select"),$("path-from"),$("path-to")]){
    select.innerHTML="";optionize(select,entities.map(i=>i.id),id=>entities.find(i=>i.id===id)?.name||id);
  }
  $("graph-select").value=entities.some(i=>i.id==="mitre-attack")?"mitre-attack":entities[0]?.id||"";
  $("path-from").value="mitre-attack";
  $("path-to").value=entities.some(i=>i.id==="sigma")?"sigma":entities.at(-1)?.id||"";
  renderGraph();
}

function domainColor(item,index){
  const palette=["#f24861","#79b9ff","#63d89a","#efbd67","#a997ff","#67d8df"];
  const domain=(item?.domains||[])[0]||"unknown";
  let hash=0;for(const ch of domain)hash=(hash*31+ch.charCodeAt(0))>>>0;
  return palette[(hash+index)%palette.length];
}

function renderGraph(){
  const focus=$("graph-select").value,map=new Map(state.items.map(i=>[i.id,i]));
  const edges=state.relationships.filter(e=>e.from===focus||e.to===focus);
  const neighbors=unique(edges.map(e=>e.from===focus?e.to:e.from)).slice(0,18);
  const svg=$("relationship-graph"),cx=500,cy=290,r=Math.min(205+neighbors.length*3,245);
  let markup="";
  neighbors.forEach((id,index)=>{
    const angle=Math.PI*2*index/Math.max(neighbors.length,1)-Math.PI/2,x=cx+Math.cos(angle)*r,y=cy+Math.sin(angle)*r;
    const edge=edges.find(e=>(e.from===focus&&e.to===id)||(e.to===focus&&e.from===id));
    const pathClass=state.graphPath.edges.has(edgeKey(focus,id))?" path":"";
    markup+='<line class="graph-edge '+esc(edge?.confidence||"") + pathClass+'" x1="'+cx+'" y1="'+cy+'" x2="'+x+'" y2="'+y+'"></line>';
  });
  [focus,...neighbors].forEach((id,index)=>{
    let x=cx,y=cy;if(index){const angle=Math.PI*2*(index-1)/Math.max(neighbors.length,1)-Math.PI/2;x=cx+Math.cos(angle)*r;y=cy+Math.sin(angle)*r}
    const item=map.get(id),name=item?.name||id,label=name.length>23?name.slice(0,21)+"…":name,color=domainColor(item,index);
    const pathClass=state.graphPath.nodes.has(id)?" path":"";
    markup+='<g tabindex="0" role="button" class="graph-node '+(index===0?"center":"")+pathClass+'" data-id="'+esc(id)+'" transform="translate('+x+' '+y+')">'+
      '<circle r="'+(index===0?54:38)+'" style="stroke:'+color+'"></circle><text text-anchor="middle" dy="4">'+esc(label)+'</text></g>';
  });
  svg.innerHTML=markup;
  svg.querySelectorAll(".graph-node").forEach(node=>{
    const activate=()=>{if(node.dataset.id!==focus){$("graph-select").value=node.dataset.id;renderGraph()}};
    node.addEventListener("click",activate);node.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();activate()}});
  });
  const item=map.get(focus);
  const rels=edges.map(edge=>{
    const other=edge.from===focus?edge.to:edge.from,otherItem=map.get(other);
    return '<div class="graph-relation"><b>'+esc(edge.relation)+'</b><span>'+esc(edge.confidence||"unrated")+' · '+esc(edge.provenance||"curated")+'</span><br>'+
      '<a href="entity/'+encodeURIComponent(other)+'/">'+esc(otherItem?.name||other)+' →</a></div>';
  }).join("");
  $("graph-detail").innerHTML='<p class="section-kicker">Focused entity</p><h3>'+esc(item?.name||focus)+'</h3><p>'+esc(item?.summary||"Curated relationship context.")+'</p><div class="tag-row">'+
    (item?.domains||[]).slice(0,5).map(d=>'<span class="tag">'+esc(d)+'</span>').join("")+'</div><div class="graph-relations">'+rels+'</div>';
}

function findGraphPath(){
  const start=$("path-from").value,target=$("path-to").value;
  const adj=new Map();
  for(const edge of state.relationships){
    if(!adj.has(edge.from))adj.set(edge.from,[]);if(!adj.has(edge.to))adj.set(edge.to,[]);
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
    $("path-result").innerHTML='<strong>'+found.length+' nodes</strong>&nbsp; '+found.map(id=>esc(map.get(id)?.name||id)).join(" → ");
    $("graph-select").value=start;renderGraph();
  }else{
    $("path-result").textContent="No curated path exists between those entities yet.";renderGraph();
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
  for(const item of state.items)list.push({kind:item.kind,label:item.name,detail:(item.domains||[]).join(" · "),href:"entity/"+item.id+"/"});
  for(const item of state.resources.books)list.push({kind:"book",label:item.title,detail:(item.authors||[]).join(", "),href:item.url});
  for(const item of state.resources.certifications)list.push({kind:"cert",label:item.name,detail:item.provider+" · "+item.level,href:item.url});
  for(const path of state.learningPaths)list.push({kind:"path",label:path.name,detail:path.audience+" · "+(path.domains||[]).join(" · "),href:"#paths"});
  for(const item of state.techniques)list.push({kind:"technique",label:item.id+" · "+item.name,detail:"ATT&CK technique intelligence",href:"technique/"+item.id.toLowerCase()+"/"});
  for(const item of state.adversaries)list.push({kind:"adversary",label:item.name,detail:item.attack_id+" · "+item.actor_type+" · "+(item.aliases||[]).slice(0,3).join(" · "),href:"adversary/"+item.id+"/"});
  for(const item of state.intelligenceSources)list.push({kind:"source",label:item.name,detail:item.category+" · "+(item.focus||[]).slice(0,3).join(" · "),href:item.url});
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
  const [catalog,resources,paths,techniques,adversaries,intelligenceSources,verification,standards,coverage,regressions,evidence,heatmap,scenarioSummary,lifecycle,changelog]=await Promise.all([
    loadJson("data/catalog.json",{items:[],relationships:[],updated:""}),
    loadJson("data/resources.json",{books:[],certifications:[]}),
    loadJson("data/learning-paths.json",{paths:[]}),
    loadJson("data/techniques.json",[]),
    loadJson("data/adversaries.json",{adversaries:[]}),
    loadJson("data/intelligence-sources.json",{sources:[]}),
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
  state.learningPaths=paths.paths||[];state.techniques=techniques||[];state.adversaries=adversaries.adversaries||[];state.intelligenceSources=intelligenceSources.sources||[];state.verification=verification;
  state.standards=standards.standards||[];state.coverage=coverage.records||[];state.regressions=regressions.regressions||[];
  state.evidence=evidence.records||[];state.heatmap=heatmap.domains||[];state.scenarioSummary=scenarioSummary.scenarios||[];state.lifecycle=lifecycle;state.changelog=changelog;

  optionize($("domain-filter"),unique(state.items.flatMap(i=>i.domains||[])));
  optionize($("status-filter"),unique(state.items.map(i=>i.status)));
  optionize($("adversary-type"),unique(state.adversaries.map(i=>i.actor_type)));
  optionize($("adversary-motivation"),unique(state.adversaries.flatMap(i=>i.motivation||[])));
  optionize($("adversary-sector"),unique(state.adversaries.flatMap(i=>i.sectors||[])));
  readLocalState();
  $("sidebar-updated").textContent="reviewed "+(catalog.updated||"—");

  renderMetrics();renderStandardsTicker();renderBookmarks();renderLearningPaths();renderTechniques();renderAdversaries();renderIntelSources();
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
  $("graph-select").addEventListener("change",renderGraph);$("find-path").addEventListener("click",findGraphPath);
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
