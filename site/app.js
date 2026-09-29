const state={items:[],filtered:[],relationships:[],compare:new Set(),compact:false,lang:"en"};
const $=id=>document.getElementById(id);
const unique=v=>[...new Set(v.filter(Boolean))].sort((a,b)=>a.localeCompare(b));
const esc=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const I18N={
 en:{nav_paths:"Paths",nav_visuals:"Visuals",nav_graph:"Graph",nav_catalog:"Catalog",nav_roadmap:"Roadmap",hero_eyebrow:"Curated · threat-informed · machine-readable",hero_title_1:"Offensive security,",hero_title_2:"mapped to defensive outcomes.",hero_lede:"A structured knowledge graph for methodologies, adversary models, validation platforms, defensive evidence and reviewed tooling.",explore_catalog:"Explore catalog",explore_graph:"Explore graph",decision_paths:"Decision paths",start_question:"Start with the question, not the tool.",paths_copy:"Presets focus the catalog on a security objective without pretending one tool fits every engagement.",visual_intel:"Visual intelligence",see_shape:"See the shape of the catalog.",visual_copy:"Distribution and trend views are generated from the same machine-readable data used by the catalog.",top_domains:"Top domains",live_catalog:"live catalog",coverage_trend:"Coverage trend",example_data:"example data",knowledge_graph:"Knowledge graph",connections:"See how the ecosystem connects.",focus_entity:"Focus entity",catalog:"Catalog",search_ecosystem:"Search the ecosystem.",search:"Search",type:"Type",domain:"Domain",status:"Status",model:"Model",all_types:"All types",all_domains:"All domains",all_statuses:"All statuses",all_models:"All models",sort:"Sort",compact_view:"Compact view",reset:"Reset",roadmap:"Roadmap",platform_evolution:"Platform evolution.",evidence_discipline:"Evidence discipline",claims_provenance:"Claims need provenance.",compare_hint:"Select up to 3 entries.",clear:"Clear",compare:"Compare",factual_comparison:"Factual comparison"},
 pt:{nav_paths:"Trilhas",nav_visuals:"Visuais",nav_graph:"Grafo",nav_catalog:"Catálogo",nav_roadmap:"Roadmap",hero_eyebrow:"Curado · orientado por ameaças · legível por máquina",hero_title_1:"Segurança ofensiva,",hero_title_2:"ligada a resultados defensivos.",hero_lede:"Um grafo de conhecimento estruturado para metodologias, modelos adversários, validação, evidências defensivas e ferramentas revisadas.",explore_catalog:"Explorar catálogo",explore_graph:"Explorar grafo",decision_paths:"Trilhas de decisão",start_question:"Comece pela pergunta, não pela ferramenta.",paths_copy:"Os presets focam o catálogo em um objetivo sem fingir que uma ferramenta resolve todos os cenários.",visual_intel:"Inteligência visual",see_shape:"Veja a forma do catálogo.",visual_copy:"Distribuição e tendências são geradas pelos mesmos dados estruturados do catálogo.",top_domains:"Principais domínios",live_catalog:"catálogo ao vivo",coverage_trend:"Evolução de cobertura",example_data:"dados de exemplo",knowledge_graph:"Grafo de conhecimento",connections:"Veja como o ecossistema se conecta.",focus_entity:"Entidade em foco",catalog:"Catálogo",search_ecosystem:"Pesquise o ecossistema.",search:"Buscar",type:"Tipo",domain:"Domínio",status:"Status",model:"Modelo",all_types:"Todos os tipos",all_domains:"Todos os domínios",all_statuses:"Todos os status",all_models:"Todos os modelos",sort:"Ordenar",compact_view:"Visão compacta",reset:"Limpar",roadmap:"Roadmap",platform_evolution:"Evolução da plataforma.",evidence_discipline:"Disciplina de evidência",claims_provenance:"Toda afirmação precisa de proveniência.",compare_hint:"Selecione até 3 itens.",clear:"Limpar",compare:"Comparar",factual_comparison:"Comparação factual"},
 es:{nav_paths:"Rutas",nav_visuals:"Visuales",nav_graph:"Grafo",nav_catalog:"Catálogo",nav_roadmap:"Roadmap",hero_eyebrow:"Curado · informado por amenazas · legible por máquina",hero_title_1:"Seguridad ofensiva,",hero_title_2:"conectada a resultados defensivos.",hero_lede:"Un grafo de conocimiento estructurado para metodologías, modelos adversarios, validación, evidencia defensiva y herramientas revisadas.",explore_catalog:"Explorar catálogo",explore_graph:"Explorar grafo",decision_paths:"Rutas de decisión",start_question:"Empieza por la pregunta, no por la herramienta.",paths_copy:"Los presets enfocan el catálogo en un objetivo sin fingir que una herramienta sirve para todo.",visual_intel:"Inteligencia visual",see_shape:"Observa la forma del catálogo.",visual_copy:"La distribución y las tendencias se generan desde los mismos datos estructurados.",top_domains:"Dominios principales",live_catalog:"catálogo en vivo",coverage_trend:"Tendencia de cobertura",example_data:"datos de ejemplo",knowledge_graph:"Grafo de conocimiento",connections:"Observa cómo se conecta el ecosistema.",focus_entity:"Entidad principal",catalog:"Catálogo",search_ecosystem:"Busca en el ecosistema.",search:"Buscar",type:"Tipo",domain:"Dominio",status:"Estado",model:"Modelo",all_types:"Todos los tipos",all_domains:"Todos los dominios",all_statuses:"Todos los estados",all_models:"Todos los modelos",sort:"Ordenar",compact_view:"Vista compacta",reset:"Restablecer",roadmap:"Roadmap",platform_evolution:"Evolución de la plataforma.",evidence_discipline:"Disciplina de evidencia",claims_provenance:"Las afirmaciones necesitan procedencia.",compare_hint:"Selecciona hasta 3 elementos.",clear:"Limpiar",compare:"Comparar",factual_comparison:"Comparación factual"}
};
function optionize(el,vals){for(const v of vals){const o=document.createElement("option");o.value=v;o.textContent=v;el.appendChild(o)}}
function t(key){return I18N[state.lang]?.[key]||I18N.en[key]||key}
function applyLanguage(){
 document.documentElement.lang=state.lang==="pt"?"pt-BR":state.lang;
 document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(I18N[state.lang]?.[key])el.textContent=I18N[state.lang][key]});
 $("language").value=state.lang;
}
function readUrl(){
 const p=new URLSearchParams(location.search);
 state.lang=p.get("lang")||localStorage.getItem("rf-lang")||"en";
 $("search").value=p.get("q")||"";
 $("type-filter").value=p.get("type")||"";
 $("domain-filter").value=p.get("domain")||"";
 $("status-filter").value=p.get("status")||"";
 $("model-filter").value=p.get("model")||"";
 $("sort").value=p.get("sort")||"name";
 state.compact=p.get("view")==="compact";
 $("catalog").classList.toggle("compact",state.compact);
 $("density").textContent=state.compact?"Card view":t("compact_view");
}
function syncUrl(){
 const p=new URLSearchParams();
 const values={q:$("search").value,type:$("type-filter").value,domain:$("domain-filter").value,status:$("status-filter").value,model:$("model-filter").value,sort:$("sort").value,lang:state.lang,view:state.compact?"compact":""};
 Object.entries(values).forEach(([k,v])=>{if(v&&!(k==="sort"&&v==="name")&&!(k==="lang"&&v==="en"))p.set(k,v)});
 history.replaceState(null,"",location.pathname+(p.toString()?"?"+p.toString():"")+location.hash);
}
function stats(items){
 const verified=items.filter(i=>i.status==="verified").length,legacy=items.filter(i=>i.status==="legacy").length,watch=items.filter(i=>i.status==="watchlist").length,domains=unique(items.flatMap(i=>i.domains||[])).length,avg=Math.round(items.reduce((s,i)=>s+(i.provenance_score||0),0)/Math.max(items.length,1));
 $("stats").innerHTML=[["Entries",items.length],["Verified",verified],["Domains",domains],["Avg provenance",avg],["Watchlist",watch],["Legacy",legacy]].map(([l,v])=>'<div class="stat"><strong>'+v+(l==="Avg provenance"?"%":"")+'</strong><span>'+l+'</span></div>').join("");
}
function card(i){
 const badges=[i.type,i.status,i.model,...(i.domains||[])].filter(Boolean).slice(0,7).map(v=>'<span class="badge '+esc(i.status||"")+'">'+esc(v)+'</span>').join("");
 const selected=state.compare.has(i.id);
 return '<article class="card"><div><div class="badges">'+badges+'</div><h3>'+esc(i.name)+'</h3></div><p>'+esc(i.summary||"No summary available.")+'</p><div><div class="card-meta"><span class="provenance">Provenance '+esc(i.provenance_score??"—")+'</span><span>Tier '+esc(i.evidence_tier||"—")+' · '+esc(i.last_reviewed||"—")+'</span></div><div class="card-actions"><a href="entity/'+encodeURIComponent(i.id)+'/">Entity →</a><button class="compare-toggle" data-id="'+esc(i.id)+'" aria-pressed="'+selected+'">'+(selected?"Selected":"Compare")+'</button></div></div></article>'
}
function sorted(items){
 const m=$("sort").value;
 return [...items].sort((a,b)=>m==="status"?(a.status||"").localeCompare(b.status||"")||(a.name||"").localeCompare(b.name||""):m==="review"?String(b.last_reviewed||"").localeCompare(String(a.last_reviewed||""))||(a.name||"").localeCompare(b.name||""):m==="provenance"?(b.provenance_score||0)-(a.provenance_score||0):(a.name||"").localeCompare(b.name||""))
}
function apply(){
 const q=$("search").value.trim().toLowerCase(),tokens=q.split(/\s+/).filter(Boolean),type=$("type-filter").value,domain=$("domain-filter").value,status=$("status-filter").value,model=$("model-filter").value;
 state.filtered=state.items.filter(i=>{const hay=[i.name,i.type,i.status,i.model,i.summary,i.evidence_tier,...(i.aliases||[]),...(i.domains||[])].join(" ").toLowerCase();return(!tokens.length||tokens.some(token=>hay.includes(token)))&&(!type||i.type===type)&&(!domain||(i.domains||[]).includes(domain))&&(!status||i.status===status)&&(!model||i.model===model)});
 const active=[q&&'search "'+q+'"',type,domain,status,model].filter(Boolean);
 $("result-count").textContent=state.filtered.length+" entries";$("filter-summary").textContent=active.length?"· "+active.join(" · "):"";
 $("catalog").innerHTML=sorted(state.filtered).map(card).join("")||'<div class="panel" style="padding:20px">No entries match the current filters.</div>';
 $("catalog").querySelectorAll(".compare-toggle").forEach(btn=>btn.addEventListener("click",()=>toggleCompare(btn.dataset.id)));
 syncUrl();
}
function toggleCompare(id){
 if(state.compare.has(id))state.compare.delete(id);else if(state.compare.size<3)state.compare.add(id);
 renderCompareDock();apply();
}
function renderCompareDock(){
 const dock=$("compare-dock");dock.hidden=state.compare.size===0;$("compare-count").textContent=state.compare.size+" selected";$("open-compare").disabled=state.compare.size<2;
}
function openCompare(){
 const items=[...state.compare].map(id=>state.items.find(i=>i.id===id)).filter(Boolean);
 const rows=[["Type","type"],["Domains","domains"],["Status","status"],["Model","model"],["Evidence tier","evidence_tier"],["Provenance","provenance_score"],["Reviewed","last_reviewed"],["Summary","summary"]];
 let out='<table class="compare-table"><thead><tr><th>Attribute</th>'+items.map(i=>'<th>'+esc(i.name)+'</th>').join("")+'</tr></thead><tbody>';
 for(const [label,key] of rows)out+='<tr><td>'+label+'</td>'+items.map(i=>'<td>'+esc(Array.isArray(i[key])?i[key].join(", "):i[key]??"—")+'</td>').join("")+'</tr>';
 out+="</tbody></table>";$("compare-table").innerHTML=out;$("compare-dialog").showModal();
}
function download(type){
 const items=sorted(state.filtered);let blob,name;
 if(type==="json"){blob=new Blob([JSON.stringify(items,null,2)],{type:"application/json"});name="redframeworks-filtered.json"}
 else{const fields=["id","name","type","domains","status","model","evidence_tier","provenance_score","last_reviewed","url","summary"];const cell=v=>'"'+String(v??"").replaceAll('"','""')+'"';const csv=[fields.join(","),...items.map(i=>fields.map(f=>cell(Array.isArray(i[f])?i[f].join("|"):i[f])).join(","))].join("\n");blob=new Blob([csv],{type:"text/csv"});name="redframeworks-filtered.csv"}
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
}
function graphSetup(){
 const ids=new Set(state.relationships.flatMap(e=>[e.from,e.to])),ents=state.items.filter(i=>ids.has(i.id)).sort((a,b)=>a.name.localeCompare(b.name));
 for(const i of ents){const o=document.createElement("option");o.value=i.id;o.textContent=i.name;$("graph-select").appendChild(o)}
 $("graph-select").value=ids.has("mitre-attack")?"mitre-attack":ents[0]?.id||"";$("graph-select").addEventListener("change",graph);graph();
}
function graph(){
 const focus=$("graph-select").value,map=new Map(state.items.map(i=>[i.id,i])),edges=state.relationships.filter(e=>e.from===focus||e.to===focus),neighbors=unique(edges.map(e=>e.from===focus?e.to:e.from)).slice(0,12),svg=$("relationship-graph"),cx=450,cy=210,r=Math.min(155+neighbors.length*4,185);let out="";
 neighbors.forEach((id,n)=>{const a=Math.PI*2*n/Math.max(neighbors.length,1)-Math.PI/2,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;out+='<line class="graph-edge" x1="'+cx+'" y1="'+cy+'" x2="'+x+'" y2="'+y+'"></line>'});
 [focus,...neighbors].forEach((id,n)=>{let x=cx,y=cy;if(n){const a=Math.PI*2*(n-1)/Math.max(neighbors.length,1)-Math.PI/2;x=cx+Math.cos(a)*r;y=cy+Math.sin(a)*r}const name=map.get(id)?.name||id,label=name.length>22?name.slice(0,20)+"…":name;out+='<g tabindex="0" role="button" aria-label="'+esc(name)+'" class="graph-node '+(n===0?"center":"")+'" data-id="'+esc(id)+'" transform="translate('+x+' '+y+')"><circle r="'+(n===0?48:35)+'"></circle><text text-anchor="middle" dy="4">'+esc(label)+'</text></g>'});
 svg.innerHTML=out;svg.querySelectorAll(".graph-node").forEach(node=>{const activate=()=>{if(node.dataset.id!==focus){$("graph-select").value=node.dataset.id;graph()}};node.addEventListener("click",activate);node.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();activate()}})});
 const f=map.get(focus),rels=edges.map(e=>{const other=e.from===focus?e.to:e.from;return'<li><b>'+esc(e.relation)+'</b> · <a href="entity/'+encodeURIComponent(other)+'/">'+esc(map.get(other)?.name||other)+'</a></li>'}).join("");
 $("graph-detail").innerHTML='<p class="kicker">'+t("focus_entity")+'</p><h3>'+esc(f?.name||focus)+'</h3><p>'+esc(f?.summary||"Explore curated relationships.")+'</p><ul>'+rels+"</ul>";
}
function domainChart(){
 const counts={};state.items.filter(i=>i.status!=="watchlist").forEach(i=>(i.domains||[]).forEach(d=>counts[d]=(counts[d]||0)+1));
 const top=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,8),max=top[0]?.[1]||1;
 $("domain-chart").innerHTML=top.map(([name,count])=>'<div class="bar-row"><label title="'+esc(name)+'">'+esc(name)+'</label><div class="bar-track"><div class="bar-fill" style="width:'+(count/max*100)+'%"></div></div><b>'+count+'</b></div>').join("");
}
async function trendChart(){
 try{
  const res=await fetch("data/coverage-trend.json"),data=await res.json(),periods=data.periods||[],metrics=[["telemetry","#ff778c"],["detection","#8fc5ff"],["analyst_response","#5dd59a"]];
  const W=620,H=260,pad=38,x=n=>pad+n*((W-pad*2)/Math.max(periods.length-1,1)),y=v=>H-pad-(v/100)*(H-pad*2);let out="";
  for(let v=0;v<=100;v+=25){out+='<line class="axis" x1="'+pad+'" y1="'+y(v)+'" x2="'+(W-pad)+'" y2="'+y(v)+'"></line><text x="4" y="'+(y(v)+3)+'">'+v+'</text>'}
  periods.forEach((p,n)=>out+='<text x="'+x(n)+'" y="'+(H-8)+'" text-anchor="middle">'+esc(p.period)+'</text>');
  metrics.forEach(([metric,color])=>{const pts=periods.map((p,n)=>x(n)+","+y(p[metric])).join(" ");out+='<polyline class="series" stroke="'+color+'" points="'+pts+'"></polyline>';periods.forEach((p,n)=>out+='<circle class="point" fill="'+color+'" cx="'+x(n)+'" cy="'+y(p[metric])+'" r="5"></circle>')});
  $("trend-chart").innerHTML=out;$("trend-legend").innerHTML=metrics.map(([m,c])=>'<span style="--dot:'+c+'">'+esc(m.replaceAll("_"," "))+'</span>').join("");
 }catch(e){$("trend-chart").outerHTML='<p class="lede">Trend data unavailable.</p>'}
}
async function init(){
 const res=await fetch("data/catalog.json"),data=await res.json();state.items=data.items||[];state.relationships=data.relationships||[];
 optionize($("type-filter"),unique(state.items.map(i=>i.type)));optionize($("domain-filter"),unique(state.items.flatMap(i=>i.domains||[])));optionize($("status-filter"),unique(state.items.map(i=>i.status)));optionize($("model-filter"),unique(state.items.map(i=>i.model)));
 readUrl();applyLanguage();$("updated-label").textContent="Dataset reviewed "+(data.updated||"—");stats(state.items);domainChart();await trendChart();graphSetup();
 for(const id of["search","type-filter","domain-filter","status-filter","model-filter","sort"])$(id).addEventListener(id==="search"?"input":"change",apply);
 document.querySelectorAll(".path-card").forEach(btn=>btn.addEventListener("click",()=>{$("search").value=btn.dataset.query;for(const id of["type-filter","domain-filter","status-filter","model-filter"])$(id).value="";apply();document.querySelector("#catalog-section").scrollIntoView({behavior:"smooth"})}));
 $("density").addEventListener("click",()=>{state.compact=!state.compact;$("catalog").classList.toggle("compact",state.compact);$("density").textContent=state.compact?"Card view":t("compact_view");syncUrl()});
 $("reset").addEventListener("click",()=>{$("search").value="";for(const id of["type-filter","domain-filter","status-filter","model-filter"])$(id).value="";$("sort").value="name";apply()});
 $("language").addEventListener("change",()=>{state.lang=$("language").value;localStorage.setItem("rf-lang",state.lang);applyLanguage();syncUrl();graph()});
 $("export-json").addEventListener("click",()=>download("json"));$("export-csv").addEventListener("click",()=>download("csv"));
 $("open-compare").addEventListener("click",openCompare);$("close-compare").addEventListener("click",()=>$("compare-dialog").close());$("clear-compare").addEventListener("click",()=>{state.compare.clear();renderCompareDock();apply()});
 apply();renderCompareDock();
}
init().catch(err=>{$("result-count").textContent="Catalog failed to load";$("catalog").innerHTML='<div class="panel" style="padding:20px">'+esc(err.message)+"</div>"});
