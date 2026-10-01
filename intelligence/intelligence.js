const $=id=>document.getElementById(id),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
(async()=>{const r=await fetch("../data/visual-intelligence.json"),d=await r.json();
 $("actor-types").innerHTML=Object.entries(d.actor_types||{}).map(([k,v])=>'<div class="research-metric"><strong>'+v+'</strong><span>'+esc(k)+'</span></div>').join("");
 const max=Math.max(...(d.top_sectors||[]).map(x=>x.count),1);
 $("sector-heatmap").innerHTML='<table class="heatmap-table"><thead><tr><th>Sector</th><th>Tracked actors</th><th>Intensity</th></tr></thead><tbody>'+
 (d.top_sectors||[]).map(x=>'<tr><th>'+esc(x.sector)+'</th><td>'+x.count+'</td><td class="heat-cell" style="--heat:'+Math.round(x.count/max*100)+'%">'+esc((x.actors||[]).slice(0,6).join(", "))+'</td></tr>').join("")+'</tbody></table>';
 $("campaign-timeline").innerHTML=(d.campaign_timeline||[]).map(x=>'<article class="timeline-item"><time>'+esc(x.first_seen)+' → '+esc(x.last_seen)+'</time><h3>'+esc(x.name)+' · '+esc(x.attack_id)+'</h3><p>'+esc((x.sectors||[]).join(" · "))+'</p></article>').join("");
})().catch(e=>document.body.insertAdjacentHTML("beforeend","<p>"+esc(e.message)+"</p>"));