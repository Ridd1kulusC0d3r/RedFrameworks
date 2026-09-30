const S={items:[],adversaries:[],nodes:[],edges:[],filteredNodes:[],filteredEdges:[],selected:null,scale:1,tx:0,ty:0,dragging:false,last:null,theme:"dark"};
const $=id=>document.getElementById(id);
const esc=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const unique=a=>[...new Set(a.filter(Boolean))].sort((x,y)=>String(x).localeCompare(String(y)));
async function json(path,fallback){try{const r=await fetch(path);if(!r.ok)throw new Error(r.status);return await r.json()}catch(_){return fallback}}
function opt(select,values){for(const v of values){const o=document.createElement("option");o.value=v;o.textContent=v;select.appendChild(o)}}
function nodeColor(n){if(n.kind==="adversary")return"#efbd67";if(n.kind==="framework")return"#79b9ff";return n.status==="not-verified"?"#efbd67":"#f24861"}
function makeGraph(){
  const itemMap=new Map(S.items.map(i=>[i.id,i]));
  const relIds=new Set(S.edges.flatMap(e=>[e.from,e.to]));
  S.nodes=S.items.filter(i=>relIds.has(i.id)).map(i=>({...i,label:i.name,kind:i.kind||"entity"}));
  for(const a of S.adversaries){
    S.nodes.push({id:"adv:"+a.id,label:a.name,kind:"adversary",status:"verified",domains:["adversary-intelligence",...(a.sectors||[]).slice(0,2)],summary:a.attribution,url:a.source,attack_id:a.attack_id,aliases:a.aliases||[],actor_type:a.actor_type,source_tier:a.source_tier});
    S.edges.push({from:"adv:"+a.id,to:"mitre-attack",relation:"tracked-by-attack",confidence:"high",provenance:"MITRE ATT&CK",virtual:true});
  }
  S.nodeMap=new Map(S.nodes.map(n=>[n.id,n]));
}
function populate(){
  opt($("full-status-filter"),unique(S.nodes.map(n=>n.status)));
  opt($("full-domain"),unique(S.nodes.flatMap(n=>n.domains||[])));
  opt($("full-relation"),unique(S.edges.map(e=>e.relation)));
}
function allowedNode(n){
  const q=$("graph-global-search").value.trim().toLowerCase(),kind=$("full-kind-filter").value,status=$("full-status-filter").value,domain=$("full-domain").value;
  const layer=(n.kind==="framework"&&$("layer-frameworks").checked)||(n.kind==="tool"&&$("layer-tools").checked)||(n.kind==="adversary"&&$("layer-adversaries").checked);
  const hay=[n.label,n.id,n.kind,n.status,n.summary,n.attack_id,...(n.aliases||[]),...(n.domains||[])].filter(Boolean).join(" ").toLowerCase();
  return layer&&(!q||hay.includes(q))&&(!kind||n.kind===kind)&&(!status||n.status===status)&&(!domain||(n.domains||[]).includes(domain));
}
function apply(){
  const confidence=$("full-confidence").value,relation=$("full-relation").value;
  S.filteredNodes=S.nodes.filter(allowedNode);
  const ids=new Set(S.filteredNodes.map(n=>n.id));
  S.filteredEdges=S.edges.filter(e=>ids.has(e.from)&&ids.has(e.to)&&(!relation||e.relation===relation)&&(!confidence||(confidence==="high"?e.confidence==="high":["high","medium"].includes(e.confidence))));
  layout();render();stats();
}
function seed(){
  const groups={framework:{x:390,y:430},tool:{x:810,y:430},adversary:{x:650,y:180}};
  for(let i=0;i<S.filteredNodes.length;i++){
    const n=S.filteredNodes[i],g=groups[n.kind]||{x:650,y:450},angle=i*2.399963;
    n.x=n.x??g.x+Math.cos(angle)*(80+(i%9)*15);n.y=n.y??g.y+Math.sin(angle)*(80+(i%9)*12);n.vx=0;n.vy=0;
  }
}
function radial(){
  const kinds=["framework","tool","adversary"],centers={framework:{x:380,y:455},tool:{x:980,y:455},adversary:{x:680,y:190}};
  for(const kind of kinds){
    const rows=S.filteredNodes.filter(n=>n.kind===kind),c=centers[kind];
    rows.forEach((n,i)=>{const a=Math.PI*2*i/Math.max(rows.length,1)-Math.PI/2,r=95+Math.floor(i/14)*68;n.x=c.x+Math.cos(a)*r;n.y=c.y+Math.sin(a)*r;n.vx=n.vy=0});
  }
}
function force(){
  seed();const nodes=S.filteredNodes,edges=S.filteredEdges,map=new Map(nodes.map(n=>[n.id,n]));
  const centers={framework:{x:390,y:470},tool:{x:930,y:470},adversary:{x:670,y:190}};
  for(let tick=0;tick<150;tick++){
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d2=Math.max(dx*dx+dy*dy,400),f=1250/d2,dist=Math.sqrt(d2);
      const fx=dx/dist*f,fy=dy/dist*f;a.vx+=fx;a.vy+=fy;b.vx-=fx;b.vy-=fy;
    }
    for(const e of edges){const a=map.get(e.from),b=map.get(e.to);if(!a||!b)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.max(Math.sqrt(dx*dx+dy*dy),1),target=e.virtual?180:130,f=(d-target)*.0025;a.vx+=dx/d*f;a.vy+=dy/d*f;b.vx-=dx/d*f;b.vy-=dy/d*f}
    for(const n of nodes){const c=centers[n.kind]||{x:700,y:450};n.vx+=(c.x-n.x)*.0009;n.vy+=(c.y-n.y)*.0009;n.vx*=.86;n.vy*=.86;n.x=Math.max(45,Math.min(1355,n.x+n.vx));n.y=Math.max(45,Math.min(855,n.y+n.vy))}
  }
}
function layout(){if($("full-layout").value==="radial"){seed();radial()}else force()}
function render(){
  const map=new Map(S.filteredNodes.map(n=>[n.id,n])),vp=$("full-viewport");let out="";
  for(const e of S.filteredEdges){const a=map.get(e.from),b=map.get(e.to);if(!a||!b)continue;out+='<line class="full-edge '+esc(e.confidence||"")+(e.virtual?" virtual":"")+'" x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'"></line>'}
  for(const n of S.filteredNodes){const r=n.kind==="adversary"?16:n.kind==="framework"?13:11,label=n.label.length>18?n.label.slice(0,16)+"…":n.label;out+='<g class="full-node '+(S.selected===n.id?"selected":"")+'" data-id="'+esc(n.id)+'" transform="translate('+n.x+' '+n.y+')"><circle r="'+r+'" fill="'+nodeColor(n)+'" fill-opacity=".16" stroke="'+nodeColor(n)+'"></circle><text x="'+(r+5)+'" y="3">'+esc(label)+'</text></g>'}
  vp.innerHTML=out;vp.setAttribute("transform","translate("+S.tx+" "+S.ty+") scale("+S.scale+")");
  vp.querySelectorAll(".full-node").forEach(el=>el.addEventListener("click",ev=>{ev.stopPropagation();select(el.dataset.id)}));
}
function select(id){S.selected=id;const n=S.nodeMap.get(id);if(!n)return;const edges=S.edges.filter(e=>e.from===id||e.to===id);const rels=edges.slice(0,18).map(e=>{const other=e.from===id?e.to:e.from,o=S.nodeMap.get(other);return'<div class="graph-detail-card"><span>'+esc(e.relation)+' · '+esc(e.confidence||"unrated")+'</span><strong>'+esc(o?.label||other)+'</strong></div>'}).join("");$("full-detail").innerHTML='<span class="status-badge '+esc(n.status||"")+'">'+esc(n.kind)+'</span><h2>'+esc(n.label)+'</h2><p>'+esc(n.summary||"No summary.")+'</p><div class="tag-row">'+(n.domains||[]).slice(0,8).map(d=>'<span class="tag">'+esc(d)+'</span>').join("")+'</div><div class="graph-scoreline"><span>Status <b>'+esc(n.status||"—")+'</b></span><span>Edges <b>'+edges.length+'</b></span></div>'+rels;render()}
function stats(){
  const kinds=["framework","tool","adversary"];let html='<div class="graph-cluster-row"><b>'+S.filteredNodes.length+' visible nodes</b><span>'+S.filteredEdges.length+' visible edges</span></div>';
  for(const k of kinds){const n=S.filteredNodes.filter(x=>x.kind===k).length;html+='<div class="graph-cluster-row"><b>'+n+' '+k+(n===1?"":"s")+'</b><span>'+S.nodes.filter(x=>x.kind===k).length+' total</span></div>'}$("full-stats").innerHTML=html
}
function transform(){ $("full-viewport").setAttribute("transform","translate("+S.tx+" "+S.ty+") scale("+S.scale+")") }
function fit(){S.scale=1;S.tx=0;S.ty=0;transform()}
function bindPanZoom(){
  const svg=$("full-graph"),stage=$("full-stage");
  svg.addEventListener("wheel",e=>{e.preventDefault();S.scale=Math.max(.45,Math.min(2.6,S.scale*(e.deltaY<0?1.1:.9)));transform()},{passive:false});
  svg.addEventListener("pointerdown",e=>{S.dragging=true;S.last={x:e.clientX,y:e.clientY};stage.classList.add("dragging");svg.setPointerCapture(e.pointerId)});
  svg.addEventListener("pointermove",e=>{if(!S.dragging)return;S.tx+=e.clientX-S.last.x;S.ty+=e.clientY-S.last.y;S.last={x:e.clientX,y:e.clientY};transform()});
  svg.addEventListener("pointerup",()=>{S.dragging=false;stage.classList.remove("dragging")});
}
function theme(){const t=localStorage.getItem("rf-theme")||"dark";document.documentElement.dataset.theme=t;$("full-theme").textContent=t==="dark"?"◐":"◑"}
async function init(){
  theme();
  const [catalog,adv]=await Promise.all([json("../data/catalog.json",{items:[],relationships:[]}),json("../data/adversaries.json",{adversaries:[]})]);
  S.items=catalog.items||[];S.edges=(catalog.relationships||[]).map(e=>({...e}));S.adversaries=adv.adversaries||[];makeGraph();populate();apply();bindPanZoom();
  for(const id of["graph-global-search","full-kind-filter","full-status-filter","full-confidence","full-relation","full-domain","full-layout","layer-frameworks","layer-tools","layer-adversaries"])$(id).addEventListener(id==="graph-global-search"?"input":"change",apply);
  $("full-reset").addEventListener("click",()=>{for(const id of["graph-global-search","full-kind-filter","full-status-filter","full-confidence","full-relation","full-domain"])$(id).value="";$("full-layout").value="force";$("layer-frameworks").checked=$("layer-tools").checked=$("layer-adversaries").checked=true;S.selected=null;fit();apply()});
  $("zoom-in").addEventListener("click",()=>{S.scale=Math.min(2.6,S.scale*1.15);transform()});$("zoom-out").addEventListener("click",()=>{S.scale=Math.max(.45,S.scale*.85);transform()});$("zoom-fit").addEventListener("click",fit);
  $("full-theme").addEventListener("click",()=>{const t=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=t;localStorage.setItem("rf-theme",t);$("full-theme").textContent=t==="dark"?"◐":"◑"});
}
init();
