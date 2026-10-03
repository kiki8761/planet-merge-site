(()=>{
let cleanup=()=>{};
window.stopSolarCelebration=()=>cleanup();
window.celebrateSun=(originX,originY)=>{
 cleanup();
 const layer=document.createElement('div');layer.className='solar-celebration';layer.setAttribute('aria-hidden','true');
 const sky=document.createElement('canvas');const title=document.createElement('div');title.className='solar-title';
 title.innerHTML='<span>☀</span><strong>你造出了太阳！</strong><small>这一刻，整个宇宙为你闪耀</small>';
 layer.append(sky,title);document.body.append(layer);
 const ctx=sky.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let width=innerWidth,height=innerHeight,raf=0,start=null;
 function resize(){width=innerWidth;height=innerHeight;const d=Math.min(devicePixelRatio||1,2);sky.width=width*d;sky.height=height*d;ctx.setTransform(d,0,0,d,0,0)}
 resize();window.addEventListener('resize',resize);
 const fx=Number.isFinite(originX)?originX:width/2,fy=Number.isFinite(originY)?originY:height*.45;
 const ox=Math.max(0,Math.min(width,fx)),oy=Math.max(height*.2,Math.min(height*.8,fy));
 const colors=['#fff7cd','#ffd575','#fff','#aed9ff','#cabaff'];
 const stars=Array.from({length:reduced?36:200},(_,i)=>{
  const angle=Math.random()*Math.PI*2,speed=(.18+Math.random()*.82)*Math.max(width,height)*.85;
  return {angle,speed,size:1+Math.random()*3.5,delay:i<140?0:.4+Math.random()*.5,color:colors[i%colors.length],spin:Math.random()*6,life:2.3+Math.random()*2};
 });
 cleanup=()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);layer.remove();cleanup=()=>{}};
 function draw(now){
  if(start===null)start=now;const t=(now-start)/1000;
  if(t>5){cleanup();return}
  ctx.clearRect(0,0,width,height);
  const fade=Math.min(1,t*3)*Math.min(1,(5-t)/1.2);
  title.style.opacity=String(fade);title.style.transform=reduced?'none':`translateY(${(1-Math.min(t,1))*16}px)`;
  const glow=ctx.createRadialGradient(ox,oy,0,ox,oy,Math.max(width,height)*.85);
  glow.addColorStop(0,`rgba(255,192,73,${fade*.22})`);glow.addColorStop(.45,`rgba(100,115,255,${fade*.09})`);glow.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
  if(!reduced){
   for(let i=0;i<3;i++){const age=t-i*.18;if(age<0||age>2.2)continue;ctx.globalAlpha=(1-age/2.2)*.42;ctx.strokeStyle=i%2?'#b8d9ff':'#ffe4a1';ctx.lineWidth=2-i*.4;ctx.beginPath();ctx.arc(ox,oy,30+age*Math.max(width,height)*.5,0,Math.PI*2);ctx.stroke()}
  }
  for(const p of stars){
   const age=t-p.delay;if(age<0||age>p.life)continue;
   const travel=reduced?p.speed*.5:p.speed*(1-Math.exp(-age*1.2))*.85;
   const x=ox+Math.cos(p.angle)*travel,y=oy+Math.sin(p.angle)*travel+(reduced?0:age*age*12);
   ctx.globalAlpha=Math.min(1,age*8)*Math.pow(1-age/p.life,.7)*fade;ctx.strokeStyle=p.color;ctx.fillStyle=p.color;
   if(!reduced&&age<1.3){ctx.lineWidth=p.size*.4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(p.angle)*24*(1-age/1.3),y-Math.sin(p.angle)*24*(1-age/1.3));ctx.stroke()}
   ctx.save();ctx.translate(x,y);ctx.rotate(p.spin+(reduced?0:age*.4));ctx.beginPath();const r=p.size*(1+Math.sin(age*5+p.spin)*.25);
   for(let j=0;j<8;j++){const a=j*Math.PI/4,rr=j%2?r*.25:r*2;const px=Math.cos(a)*rr,py=Math.sin(a)*rr;j?ctx.lineTo(px,py):ctx.moveTo(px,py)}
   ctx.closePath();ctx.fill();ctx.restore();
  }
  ctx.globalAlpha=1;raf=requestAnimationFrame(draw);
 }
 raf=requestAnimationFrame(draw);
};
})();
