import { $, $$, cv, rn, bind } from '../lib/utils.js'

// RNN / LSTM playground: sets up its pane's controls and returns a per-frame draw function (or null).
export default function mountRnn() {
function rnnDraw(){const bf=+$('#bf').value,bi=+$('#bi').value,w=+$('#rw').value,sg=z=>1/(1+Math.exp(-z)),T=30,x=t=>t>=2&&t<5?1:0;
 let c=0,r=0;const C=[],R=[];for(let t=0;t<T;t++){c=sg(bf)*c+sg(bi)*Math.tanh(1.5*x(t));C.push(c);r=Math.tanh(w*r+x(t));R.push(r)}
 const cv_=$('#rnnc'),g=cv_.getContext('2d'),W=cv_.width,H=cv_.height,ym=2,px=t=>30+t/(T-1)*(W-45),py=v=>H-26-v/ym*(H-40);g.clearRect(0,0,W,H);
 g.font='12px Space Grotesk,sans-serif';g.fillStyle=cv('mute');g.strokeStyle=cv('line');g.lineWidth=1;
 for(let v=0;v<=2;v++){g.beginPath();g.moveTo(30,py(v));g.lineTo(W-8,py(v));g.stroke();g.fillText(v,10,py(v)+4)}
 for(let t=0;t<T;t+=5)g.fillText(t,px(t)-4,H-8);
 g.fillStyle=cv('line');for(let t=0;t<T;t++)if(x(t))g.fillRect(px(t)-5,py(1),10,py(0)-py(1));
 const L=(d,col)=>{g.strokeStyle=col;g.lineWidth=2.5;g.beginPath();d.forEach((v,t)=>t?g.lineTo(px(t),py(v)):g.moveTo(px(t),py(v)));g.stroke()};
 L(R,cv('b'));L(C,cv('a'));g.fillStyle=cv('a');g.fillText('LSTM memory',W-110,18);g.fillStyle=cv('b');g.fillText('RNN memory',W-110,34);g.fillStyle=cv('mute');g.fillText('gray = input signal',W-110,50);
 const pk=a=>Math.max(...a)||1,lm=C[T-1]/pk(C),rm=R[T-1]/pk(R);
 $('#s-f').textContent=sg(bf).toFixed(2);$('#s-i').textContent=sg(bi).toFixed(2);$('#s-lm').textContent=Math.round(lm*100)+'%';$('#s-rm').textContent=Math.round(rm*100)+'%';
 $('#tip-rnn').textContent=sg(bf)>.9?'The forget gate is near 1, so the LSTM keeps its memory almost untouched. This is how it bridges long gaps.':sg(bf)<.3?'The forget gate is near 0, so the LSTM wipes its memory every step, behaving like it has no memory at all.':'A mid-range forget gate leaks memory each step. Push the bias up to make the LSTM hold on longer.';
 if(w<.9)$('#tip-rnn').textContent+=' The RNN keeps shrinking its signal by the recurrent weight each step, which is the vanishing memory problem.'}
['bf','bi','rw'].forEach(i=>bind(i,rnnDraw));
  return rnnDraw
}
