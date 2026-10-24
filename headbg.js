/* headbg.js — fond 3D « fenêtre » avec head tracking (souris par défaut, webcam en option)
   Pour retirer : supprimer la ligne <script src="headbg.js" defer></script> dans index.html.
   Aucune donnée n'est envoyée : le suivi du visage tourne dans le navigateur. */
(function(){
  var CFG={
    enabled:true,
    opacity:.3,           // luminosité du fond (0 à 1)
    intensity:1.2,        // amplitude du mouvement
    showButton:true       // bouton « Head tracking »
  };
  if(!CFG.enabled) return;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fr=(document.documentElement.lang||'fr').slice(0,2)!=='en';
  function lang(){var l=document.documentElement.lang||'fr';return l.slice(0,2)==='en'?'en':'fr';}
  var T={fr:{on:'Head tracking',off:'Head tracking : actif',load:'Chargement…',err:'Caméra indisponible',center:'Recentrer'},
         en:{on:'Head tracking',off:'Head tracking: on',load:'Loading…',err:'Camera unavailable',center:'Recenter'}};

  var css=document.createElement('style');
  css.textContent=
   '#hb{position:fixed;inset:0;width:100vw;height:100vh;z-index:0;pointer-events:none;display:block}'+
   'section,footer{position:relative;z-index:1}'+
   '.hb-btn{position:fixed;left:1rem;bottom:1rem;z-index:9000;font:600 .62rem "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase;'+
   'color:#f2f1f6;background:rgba(8,7,13,.72);border:1px solid rgba(242,241,246,.28);padding:.45rem .7rem;cursor:pointer;backdrop-filter:blur(6px)}'+
   '.hb-btn:hover{border-color:#c9ff3d;color:#c9ff3d}.hb-btn.on{border-color:#c9ff3d;color:#c9ff3d}'+
   '.hb-btn i{display:inline-block;width:.45rem;height:.45rem;border-radius:50%;background:#555;margin-right:.45rem}.hb-btn.on i{background:#c9ff3d;box-shadow:0 0 8px #c9ff3d}';
  document.head.appendChild(css);

  var s=document.createElement('script');
  s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload=start;document.head.appendChild(s);

  function start(){
    var THREE=window.THREE,canvas=document.createElement('canvas');canvas.id='hb';
    document.body.insertBefore(canvas,document.body.firstChild);
    var renderer;
    try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:false,alpha:true});}catch(e){canvas.remove();return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    var scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(),H=2,D=3.2,W=H*innerWidth/innerHeight;
    var small=innerWidth<700,k=small?.5:1;
    var P=[],C=[],Sz=[];
    function col(h,s,l){var c=new THREE.Color();c.setHSL(h,s,l);return c}
    function add(x,y,z,c,size){P.push(x,y,z);C.push(c.r,c.g,c.b);Sz.push(size)}
    function line(a,b,n,c,size){n=Math.max(2,Math.round(n*k));for(var i=0;i<n;i++){var t=i/(n-1);add(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,c,size)}}
    var DEPTH=10,hw=H*1.3,hh=H/2,z,x,y,i;
    for(z=0;z>=-DEPTH;z-=.5){
      var c1=col(.25+(-z)*.045,.8,.55);
      line([-hw,-hh,z],[hw,-hh,z],60,c1,.04);line([-hw,hh,z],[hw,hh,z],60,c1,.03);
      line([-hw,-hh,z],[-hw,hh,z],40,c1,.035);line([hw,-hh,z],[hw,hh,z],40,c1,.035);
    }
    for(x=-hw;x<=hw+1e-3;x+=.5){line([x,-hh,0],[x,-hh,-DEPTH],90,col(.3,.8,.5),.03);line([x,hh,0],[x,hh,-DEPTH],90,col(.9,.8,.5),.022)}
    for(y=-hh;y<=hh+1e-3;y+=.5){line([-hw,y,0],[-hw,y,-DEPTH],90,col(.9,.8,.5),.03);line([hw,y,0],[hw,y,-DEPTH],90,col(.9,.8,.5),.03)}
    var N=Math.round(2400*k);
    for(i=0;i<N;i++){var u=Math.random()*6.283,v=Math.random()*6.283,R=.6,r=.17;
      add((R+r*Math.cos(v))*Math.cos(u)+.9,(R+r*Math.cos(v))*Math.sin(u),-3.2+r*Math.sin(v)*1.2,col(.24+Math.random()*.05,.9,.6),.03+Math.random()*.03)}
    N=Math.round(3200*k);
    for(i=0;i<N;i++){var a=Math.random()*6.283,b=Math.acos(2*Math.random()-1),rr=.75*Math.cbrt(Math.random());
      add(rr*Math.sin(b)*Math.cos(a)-.9,rr*Math.sin(b)*Math.sin(a)-.1,-5.8+rr*Math.cos(b),col(.9+Math.random()*.08,.8,.6),.035+Math.random()*.04)}
    N=Math.round(2000*k);
    for(i=0;i<N;i++)add((Math.random()-.5)*H*2.3,(Math.random()-.5)*H*.98,-Math.random()*DEPTH+.8,col(Math.random(),.5,.8),.012+Math.random()*.02);
    var g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));
    g.setAttribute('color',new THREE.Float32BufferAttribute(C,3));
    g.setAttribute('size',new THREE.Float32BufferAttribute(Sz,1));
    var mat=new THREE.ShaderMaterial({uniforms:{uScale:{value:1},uOp:{value:CFG.opacity}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
      vertexShader:'attribute float size;attribute vec3 color;varying vec3 vC;uniform float uScale;void main(){vC=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*uScale/max(-mv.z,.1);gl_Position=projectionMatrix*mv;}',
      fragmentShader:'varying vec3 vC;uniform float uOp;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float a=exp(-d*d*16.);gl_FragColor=vec4(vC,a*uOp);}'});
    scene.add(new THREE.Points(g,mat));

    function resize(){renderer.setSize(innerWidth,innerHeight,false);W=H*innerWidth/innerHeight;mat.uniforms.uScale.value=innerHeight*.9*renderer.getPixelRatio()}
    addEventListener('resize',resize);resize();
    function setView(hx,hy,hz){var n=.05,f=60;camera.position.set(hx,hy,hz);camera.updateMatrixWorld();
      camera.projectionMatrix.makePerspective((-W/2-hx)*n/hz,(W/2-hx)*n/hz,(H/2-hy)*n/hz,(-H/2-hy)*n/hz,n,f);
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert()}

    var head={x:0,y:0,z:D},tg={x:0,y:0,z:D},mode='mouse',lastMove=0;
    addEventListener('pointermove',function(e){if(mode!=='mouse'||e.pointerType==='touch')return;lastMove=performance.now();
      tg.x=(e.clientX/innerWidth-.5)*W*.5*CFG.intensity;tg.y=-(e.clientY/innerHeight-.5)*H*.5*CFG.intensity});

    var btn,landmarker,video,baseEye=null,lastT=-1;
    if(CFG.showButton){
      btn=document.createElement('button');btn.className='hb-btn';btn.type='button';
      btn.innerHTML='<i></i><span>'+T[lang()].on+'</span>';document.body.appendChild(btn);
      btn.onclick=enableCam;
    }
    function label(t){if(btn)btn.querySelector('span').textContent=t}
    async function enableCam(){
      if(mode==='webcam'){baseEye=null;return}
      label(T[lang()].load);
      try{
        var m=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs');
        var fs=await m.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
        landmarker=await m.FaceLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'},runningMode:'VIDEO',numFaces:1});
        video=document.createElement('video');video.playsInline=true;video.muted=true;
        video.srcObject=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:'user'}});
        await video.play();mode='webcam';baseEye=null;btn.classList.add('on');label(T[lang()].off+' · '+T[lang()].center);
      }catch(err){console.warn(err);mode='mouse';label(T[lang()].err);setTimeout(function(){label(T[lang()].on)},3000)}
    }
    function track(){
      if(mode!=='webcam'||!video||video.currentTime===lastT)return;lastT=video.currentTime;
      var r=landmarker.detectForVideo(video,performance.now()),f=r.faceLandmarks&&r.faceLandmarks[0];if(!f)return;
      var nose=f[1],eye=Math.hypot(f[33].x-f[263].x,f[33].y-f[263].y);if(!baseEye)baseEye=eye;
      tg.x=(.5-nose.x)*W*CFG.intensity*1.2;tg.y=(.5-nose.y)*H*CFG.intensity*1.1;
      tg.z=Math.min(Math.max(D*baseEye/eye,D*.6),D*1.6);
    }
    var visible=true;document.addEventListener('visibilitychange',function(){visible=!document.hidden;if(visible)loop()});
    var t0=performance.now();
    function loop(){
      if(!visible)return;
      track();
      var now=performance.now();
      if(mode==='mouse'&&(reduce||now-lastMove>4000)){ // dérive douce si aucune interaction (tactile, inactif)
        var t=(now-t0)/1000;tg.x=Math.sin(t*.25)*W*.12*(reduce?0:1);tg.y=Math.cos(t*.19)*H*.08*(reduce?0:1);}
      head.x+=(tg.x-head.x)*.1;head.y+=(tg.y-head.y)*.1;head.z+=(tg.z-head.z)*.1;
      setView(head.x,head.y,head.z);renderer.render(scene,camera);
      if(!reduce||mode==='webcam')requestAnimationFrame(loop);
    }
    loop();
  }
})();
