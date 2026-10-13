import { $, $$, cv, rn, bind } from '../lib/utils.js'

// GAN playground: sets up its pane's controls and returns a per-frame draw function (or null).
export default function mountGan() {
let Gn,gRun=true;const gs=z=>1/(1+Math.exp(-Math.max(-30,Math.min(30,z))));
function ginit(){Gn={a:1,b:-2,w2:0,w1:0,c:0}}
const Dn=x=>{const u=x/4;return gs(Gn.w2*u*u+Gn.w1*u+Gn.c)};
function gstep(){const B=64,lg=+$('#lg').value,ld=+$('#ld').value,mu=+$('#mu').value,sd=+$('#sd').value,d=[0,0,0];let ga=0,gb=0;
 for(let i=0;i<B;i++){const xr=mu+sd*rn(),z=rn(),xf=Gn.a*z+Gn.b,pr=Dn(xr),pf=Dn(xf),ur=xr/4,uf=xf/4;
  d[0]+=-(1-pr)*ur*ur+pf*uf*uf;d[1]+=-(1-pr)*ur+pf*uf;d[2]+=-(1-pr)+pf;
  const dx=-(1-pf)*(2*Gn.w2*uf+Gn.w1)/4;ga+=dx*z;gb+=dx}
 Gn.w2-=ld*d[0]/B;Gn.w1-=ld*d[1]/B;Gn.c-=ld*d[2]/B;Gn.a-=lg*ga/B*4;Gn.b-=lg*gb/B*4;Gn.a=Math.max(.05,Math.min(4,Gn.a))}
function ganDraw(){const mu=+$('#mu').value,sd=+$('#sd').value,c=$('#ganc'),g=c.getContext('2d'),W=c.width,H=c.height,lo=-6,hi=10,px=x=>30+(x-lo)/(hi-lo)*(W-40),py=p=>H-26-p*(H-44);g.clearRect(0,0,W,H);
 g.font='12px Space Grotesk,sans-serif';g.fillStyle=cv('mute');g.strokeStyle=cv('line');g.lineWidth=1;
 for(let x=lo;x<=hi;x+=2){g.fillText(x,px(x)-4,H-8)}g.beginPath();g.moveTo(30,py(0));g.lineTo(W-8,py(0));g.stroke();
 g.beginPath();g.moveTo(px(lo),py(0));for(let x=lo;x<=hi;x+=.1)g.lineTo(px(x),py(Math.exp(-.5*((x-mu)/sd)**2)/(sd*2.5066)));g.lineTo(px(hi),py(0));g.globalAlpha=.3;g.fillStyle=cv('a');g.fill();g.globalAlpha=1;g.strokeStyle=cv('a');g.lineWidth=2;g.stroke();
 const N=400,bins=Array(32).fill(0);for(let i=0;i<N;i++){const k=Math.floor((Gn.a*rn()+Gn.b-lo)/.5);if(k>=0&&k<32)bins[k]++}
 g.globalAlpha=.65;g.fillStyle=cv('b');bins.forEach((n,k)=>{const h=n/(N*.5)*(H-44);g.fillRect(px(lo+k*.5)+1,py(0)-h,px(lo+.5)-px(lo)-2,h)});g.globalAlpha=1;
 g.strokeStyle=cv('ink');g.lineWidth=2;g.beginPath();for(let x=lo;x<=hi;x+=.2){const y=py(Dn(x));x>lo?g.lineTo(px(x),y):g.moveTo(px(x),y)}g.stroke();
 g.setLineDash([4,4]);g.lineWidth=1;g.beginPath();g.moveTo(30,py(.5));g.lineTo(W-8,py(.5));g.stroke();g.setLineDash([]);
 $('#s-fm').textContent=Gn.b.toFixed(2)+' (real '+mu+')';$('#s-fs').textContent=Gn.a.toFixed(2)+' (real '+sd+')';
 const dm=Math.abs(Gn.b-mu),ds=Math.abs(Gn.a-sd);
 $('#tip-gan').textContent=dm<.4&&ds<.4?'The fakes now match the real data, so the detective can only guess (the line hovers near 50%). That is the goal of a GAN.':Dn(Gn.b)<.2?'The detective easily spots the fakes (line is low where orange sits). The generator is being pushed toward higher scores, so it drifts right.':'The generator is chasing the detective. If both learn at similar speeds, the orange bars settle onto the blue curve. Try making one much faster.'}
['mu','sd','lg','ld'].forEach(i=>bind(i));ginit();
$('#greset').onclick=ginit;$('#gplay').onclick=e=>{gRun=!gRun;e.target.textContent=gRun?'Pause':'Play'};
  return ()=>{if(gRun)for(let k=0;k<2;k++)gstep();ganDraw()}
}
