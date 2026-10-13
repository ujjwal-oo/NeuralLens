import { $, $$, cv, rn, bind } from '../lib/utils.js'

// Neural network playground: sets up its pane's controls and returns a per-frame draw function (or null).
export default function mountAnn() {
const A={ds:'circle',H:4,lr:.5,act:'tanh',run:true,ep:0,hist:[],X:[],Y:[],loss:0,acc:0};
function data(){const X=[],Y=[];for(let i=0;i<200;i++){let x,y,l;
 if(A.ds=='circle'){const r=Math.sqrt(Math.random()),t=Math.random()*6.283;x=r*Math.cos(t);y=r*Math.sin(t);l=r<.55?1:0}
 else if(A.ds=='xor'){x=Math.random()*2-1;y=Math.random()*2-1;l=x*y>0?1:0}
 else{const k=i%2,t=Math.random(),g=t*3.2+k*3.14159;x=t*Math.cos(g)+rn()*.04;y=t*Math.sin(g)+rn()*.04;l=k}
 X.push([x,y]);Y.push(l)}A.X=X;A.Y=Y}
function init(){const H=A.H;A.W1=Array.from({length:H},()=>[rn()*.8,rn()*.8]);A.b1=Array(H).fill(0);A.W2=Array.from({length:H},()=>rn()*.8);A.b2=0;A.ep=0;A.hist=[]}
const f=z=>A.act=='tanh'?Math.tanh(z):Math.max(0,z),df=(z,a)=>A.act=='tanh'?1-a*a:(z>0?1:0);
const fwd=(x,y)=>{let s=A.b2;for(let j=0;j<A.H;j++)s+=A.W2[j]*f(A.W1[j][0]*x+A.W1[j][1]*y+A.b1[j]);return 1/(1+Math.exp(-s))};
function step(){const H=A.H,n=A.X.length,g1=Array.from({length:H},()=>[0,0]),gb1=Array(H).fill(0),g2=Array(H).fill(0);let gb2=0,L=0,ok=0;
 for(let i=0;i<n;i++){const [x,y]=A.X[i],t=A.Y[i],z=[],a=[];let s=A.b2;
  for(let j=0;j<H;j++){z[j]=A.W1[j][0]*x+A.W1[j][1]*y+A.b1[j];a[j]=f(z[j]);s+=A.W2[j]*a[j]}
  const p=1/(1+Math.exp(-s)),e=p-t;L-=t?Math.log(p+1e-9):Math.log(1-p+1e-9);ok+=(p>.5)==(t==1);gb2+=e;
  for(let j=0;j<H;j++){g2[j]+=e*a[j];const dz=e*A.W2[j]*df(z[j],a[j]);g1[j][0]+=dz*x;g1[j][1]+=dz*y;gb1[j]+=dz}}
 const r=A.lr/n;for(let j=0;j<H;j++){A.W1[j][0]-=r*g1[j][0];A.W1[j][1]-=r*g1[j][1];A.b1[j]-=r*gb1[j];A.W2[j]-=r*g2[j]}A.b2-=r*gb2;
 A.loss=L/n;A.acc=ok/n;A.ep++;A.hist.push(Math.min(A.loss,1.5))}
const hc=document.createElement('canvas');hc.width=hc.height=30;
function drawAnn(){const c=$('#annc'),g=c.getContext('2d'),W=c.width;g.clearRect(0,0,W,W);
 const hx=hc.getContext('2d'),im=hx.createImageData(30,30);
 for(let i=0;i<30;i++)for(let j=0;j<30;j++){const p=fwd((j+.5)/15-1,1-(i+.5)/15),k=(i*30+j)*4;im.data.set(p>.5?[36,87,214,Math.round(40+(p-.5)*240)]:[224,122,31,Math.round(40+(.5-p)*240)],k)}
 hx.putImageData(im,0,0);g.imageSmoothingEnabled=true;g.drawImage(hc,0,0,W,W);
 A.X.forEach(([x,y],i)=>{g.beginPath();g.arc((x+1)/2*W,(1-y)/2*W,4.5,0,6.283);g.fillStyle=A.Y[i]?'#2457d6':'#e07a1f';g.fill();g.strokeStyle=cv('panel');g.lineWidth=1.5;g.stroke()});
 const l=$('#annl'),q=l.getContext('2d'),w=l.width,h=l.height,d=A.hist.slice(-300);q.clearRect(0,0,w,h);q.strokeStyle=cv('a');q.lineWidth=2;q.beginPath();
 d.forEach((v,i)=>{const X=i/Math.max(1,d.length-1)*(w-8)+4,Y=h-6-v/1.5*(h-12);i?q.lineTo(X,Y):q.moveTo(X,Y)});q.stroke();
 $('#s-ep').textContent=A.ep;$('#s-l').textContent=A.loss.toFixed(3);$('#s-a').textContent=Math.round(A.acc*100)+'%';
 const h2=A.hist,rise=h2.length>40&&h2[h2.length-1]>h2[h2.length-40]+.02;let t;
 if(A.ep<20)t='Training just started. Watch the shaded regions reshape as the weights update.';
 else if(A.lr>=2&&rise)t='Loss is bouncing or rising. The learning rate is too high, so each update overshoots. Lower it.';
 else if(A.acc<.8&&A.ep>300&&A.H<4)t='With only '+A.H+' neuron(s) the boundary cannot bend enough. This is underfitting. Add neurons.';
 else if(A.acc<.8&&A.ep>300)t='Progress has stalled. Try restarting for a new random start, switching activation, or raising the learning rate.';
 else if(A.acc>.97)t='Almost every point is on the correct side. Try a harder dataset or fewer neurons to see where it breaks.';
 else t='Loss is falling steadily, so the model is learning. A lower learning rate means slower but steadier progress.';
 $('#tip-ann').textContent=t}
function restart(){data();init()}
bind('H',v=>{A.H=v;init()});bind('lr',v=>A.lr=v);
$('#ds').onchange=e=>{A.ds=e.target.value;restart()};$('#act').onchange=e=>{A.act=e.target.value;init()};
$('#reset').onclick=init;$('#play').onclick=e=>{A.run=!A.run;e.target.textContent=A.run?'Pause':'Play'};
restart();
  return ()=>{if(A.run)for(let k=0;k<4;k++)step();drawAnn()}
}
