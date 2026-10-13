import { $, $$, cv, rn, bind } from '../lib/utils.js'

// Optimizers playground: sets up its pane's controls and returns a per-frame draw function (or null).
export default function mountOpt() {
let Q,oStart=[-4.5,2.2];const og=p=>[.1*p[0],2*p[1]];
function oinit(){Q={s:{p:[...oStart],tr:[[...oStart]]},m:{p:[...oStart],v:[0,0],tr:[[...oStart]]},a:{p:[...oStart],m:[0,0],v:[0,0],t:0,tr:[[...oStart]]},n:0}}
function ostep(){if(Q.n>=150)return;const lr=+$('#olr').value;let g=og(Q.s.p);Q.s.p=Q.s.p.map((x,i)=>x-lr*g[i]);Q.s.tr.push([...Q.s.p]);
 g=og(Q.m.p);Q.m.v=Q.m.v.map((v,i)=>.9*v+g[i]);Q.m.p=Q.m.p.map((x,i)=>x-lr*.5*Q.m.v[i]);Q.m.tr.push([...Q.m.p]);
 const a=Q.a;g=og(a.p);a.t++;a.m=a.m.map((m,i)=>.9*m+.1*g[i]);a.v=a.v.map((v,i)=>.999*v+.001*g[i]*g[i]);
 a.p=a.p.map((x,i)=>x-lr*(a.m[i]/(1-.9**a.t))/(Math.sqrt(a.v[i]/(1-.999**a.t))+1e-8));a.tr.push([...a.p]);Q.n++}
function odraw(){const c=$('#optc'),g=c.getContext('2d'),W=c.width,H=c.height,px=x=>(x+5)/10*W,py=y=>(3-y)/6*H;g.clearRect(0,0,W,H);g.font='13px Space Grotesk,sans-serif';
 g.strokeStyle=cv('line');g.lineWidth=1;[.2,.6,1.2,2.4,4,6,8].forEach(k=>{g.beginPath();g.ellipse(px(0),py(0),Math.sqrt(k/.05)/10*W,Math.sqrt(k)/6*H,0,0,6.283);g.stroke()});
 [[Q.s,'mute','SGD'],[Q.m,'a','Momentum'],[Q.a,'b','Adam']].forEach(([o,col,n],i)=>{g.strokeStyle=cv(col);g.fillStyle=cv(col);g.lineWidth=2.5;g.beginPath();o.tr.forEach((p,j)=>j?g.lineTo(px(p[0]),py(p[1])):g.moveTo(px(p[0]),py(p[1])));g.stroke();
  g.beginPath();g.arc(px(o.p[0]),py(o.p[1]),5,0,6.283);g.fill();g.fillText(n+': loss '+(.05*o.p[0]**2+o.p[1]**2).toFixed(3),12,20+i*18)});
 $('#tip-opt').textContent=+$('#olr').value>.9?'A high learning rate makes SGD bounce wildly across the valley. Try lowering it.':'Step '+Q.n+'. Momentum and Adam travel along the shallow axis faster than SGD. Click the map to pick a new start.'}
bind('olr',oinit);$('#orst').onclick=oinit;$('#optc').onclick=e=>{const r=e.target.getBoundingClientRect();oStart=[(e.clientX-r.left)/r.width*10-5,3-(e.clientY-r.top)/r.height*6];oinit()};oinit();
  return ()=>{ostep();odraw()}
}
