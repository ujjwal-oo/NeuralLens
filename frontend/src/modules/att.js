import { $, $$, cv, rn, bind } from '../lib/utils.js'

// Attention playground: sets up its pane's controls and returns a per-frame draw function (or null).
export default function mountAtt() {
const TK=['the','cat','chased','the','small','mouse'],EM=[[1,0,.2],[.1,1,.3],[.2,.3,1],[1,0,.2],[.2,.6,0],[.1,1,.2]];let aq=1;
function attn(){const T=+$('#atemp').value,S=EM.map(q=>{const s=EM.map(k=>2.5*q.reduce((a,x,i)=>a+x*k[i],0)/T),m=Math.max(...s),e=s.map(v=>Math.exp(v-m)),z=e.reduce((a,b)=>a+b);return e.map(v=>v/z)}),G=$('#attg');
 G.style.gridTemplateColumns='auto repeat(6,1fr)';
 G.innerHTML='<div></div>'+TK.map(t=>`<div class="th">${t}</div>`).join('')+S.map((r,i)=>`<div class="th ${i==aq?'sel':''}">${TK[i]}</div>`+r.map(v=>`<div class="cell ${i==aq?'hl':''}" data-q="${i}" style="background:rgba(36,87,214,${Math.min(1,v*1.4)});color:${v>.4?'#fff':'inherit'}">${v.toFixed(2)}</div>`).join('')).join('');
 const r=S[aq],b=r.indexOf(Math.max(...r));$('#tip-att').textContent='"'+TK[aq]+'" looks most at "'+TK[b]+'" ('+Math.round(r[b]*100)+'%). '+(T<.6?'Low temperature makes attention sharp, focusing on one word.':T>2.5?'High temperature spreads attention almost evenly, so context blurs.':'Raise or lower the temperature to sharpen or blur focus.')}
$('#attg').onclick=e=>{const q=e.target.dataset.q;if(q!=null){aq=+q;attn()}};bind('atemp',attn);
  return null
}
