import { $, $$, cv, rn, bind } from '../lib/utils.js'

// CNN playground: sets up its pane's controls and returns a per-frame draw function (or null).
export default function mountCnn() {
const KS={'Vertical edges':[-1,0,1,-2,0,2,-1,0,1],'Horizontal edges':[-1,-2,-1,0,0,0,1,2,1],'Blur':[1,1,1,1,1,1,1,1,1].map(v=>v/9),'Sharpen':[0,-1,0,-1,5,-1,0,-1,0],'Identity':[0,0,0,0,1,0,0,0,0]};
const shape=()=>{const g=Array(64).fill(0);for(let c=1;c<7;c++){g[8+c]=1;g[48+c]=1}for(let i=1;i<7;i++)g[i*8+7-i]=1;return g};
let img=shape(),ker=KS['Vertical edges'].slice();
$('#kp').innerHTML=Object.keys(KS).map(k=>`<option>${k}</option>`).join('');
$('#kp').onchange=e=>{ker=KS[e.target.value].slice();cnn()};
$('#ck').innerHTML=ker.map((_,i)=>`<input type="number" step=".1" data-i="${i}" aria-label="filter weight ${i+1}">`).join('');
$$('#ck input').forEach(el=>el.oninput=()=>{ker[el.dataset.i]=+el.value||0;cnn(true)});
let paint=null;
$('#cin').innerHTML=img.map((_,i)=>`<div class="cell" data-i="${i}"></div>`).join('');
$('#cin').addEventListener('pointerdown',e=>{const i=e.target.dataset.i;if(i==null)return;paint=img[i]?0:1;img[i]=paint;cnn();e.preventDefault()});
$('#cin').addEventListener('pointerover',e=>{const i=e.target.dataset.i;if(paint!==null&&i!=null&&e.buttons){img[i]=paint;cnn()}});
addEventListener('pointerup',()=>paint=null);
$('#clr').onclick=()=>{img=Array(64).fill(0);cnn()};$('#shape').onclick=()=>{img=shape();cnn()};
$('#relu').onchange=()=>cnn();$('#pool').onchange=()=>cnn();
let fm=[];
function cnn(keep){$$('#cin .cell').forEach((c,i)=>c.classList.toggle('on',!!img[i]));
 if(!keep)$$('#ck input').forEach((el,i)=>el.value=+ker[i].toFixed(2));
 let o=[];for(let r=0;r<6;r++)for(let c=0;c<6;c++){let s=0;for(let a=0;a<3;a++)for(let b=0;b<3;b++)s+=img[(r+a)*8+c+b]*ker[a*3+b];o.push($('#relu').checked?Math.max(0,s):s)}
 let n=6;if($('#pool').checked){const p=[];for(let r=0;r<3;r++)for(let c=0;c<3;c++)p.push(Math.max(o[2*r*6+2*c],o[2*r*6+2*c+1],o[(2*r+1)*6+2*c],o[(2*r+1)*6+2*c+1]));o=p;n=3}
 fm=o;const m=Math.max(.001,...o.map(Math.abs)),G=$('#cout');G.style.gridTemplateColumns=`repeat(${n},1fr)`;
 G.innerHTML=o.map((v,i)=>`<div class="cell" data-i="${i}" style="background:${v>=0?`rgba(36,87,214,${Math.abs(v)/m})`:`rgba(224,122,31,${Math.abs(v)/m})`};color:${Math.abs(v)/m>.5?'#fff':'inherit'}">${v.toFixed(1)}</div>`).join('');
 const hasEdge=o.some(v=>Math.abs(v)>.5);$('#tip-cnn').textContent=hasEdge?'Hover a feature map cell to see the 3×3 patch of pixels it came from.':'The filter found nothing here. Draw some shapes, or pick a different filter.'}
$('#cout').addEventListener('pointerover',e=>{const i=e.target.dataset.i;if(i==null||$('#pool').checked)return;$$('#cin .cell').forEach(c=>c.classList.remove('hl'));const r=Math.floor(i/6),c=i%6;let t=[];
 for(let a=0;a<3;a++)for(let b=0;b<3;b++){$$('#cin .cell')[(r+a)*8+c+b].classList.add('hl');if(img[(r+a)*8+c+b]&&ker[a*3+b])t.push((+ker[a*3+b]).toFixed(1))}
 $('#tip-cnn').textContent='Lit pixels under this patch pick up filter weights ['+(t.join(' + ')||'none')+'], giving '+fm[i].toFixed(1)+'.'});
cnn();
  return null
}
