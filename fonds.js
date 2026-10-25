/* fonds.js — fonds au choix pour kimmaurice.com, choisis par le visiteur :
     • « Fenêtre 3D » : la fenêtre en profondeur, avec head tracking (souris, ou webcam en option)
     • « Hors Champ TV » : la télé d'archives, que le visiteur peut mixer avec son téléphone (QR)
     • « Les deux » : la télé au fond, un voile sombre, puis la fenêtre 3D par-dessus
   Ordre des couches : télé → voile → fenêtre 3D → contenu du site.
   Le choix du visiteur est retenu dans son navigateur.
   Installation : remplacer les lignes headbg.js et hors-champ-tv-fond.js dans index.html par
     <script src="fonds.js" defer></script>
   Aucune donnée n'est envoyée : le suivi du visage tourne dans le navigateur. */
(function(){
  'use strict';
  var CFG={
    defaut:'deux',             // fond au premier passage : 'fenetre', 'tele' ou 'deux'
    opaciteFenetre:.3,         // luminosité de la fenêtre 3D (0 à 1)
    intensite:1.2,             // amplitude du mouvement de la fenêtre 3D
    opaciteTele:1,             // opacité de la télé (0 à 1)
    voile:.8,                  // voile noir entre la télé et le texte (0 = aucun, 1 = noir complet)
    couleurVoile:'0,0,0',      // couleur du voile (rgb) : noir
    pageTele:'/hors-champ-tv/hors-champ-tv.html',
    playlist:'https://open.spotify.com/playlist/7cDQVIXpJ0aDcwmSuCEyHC'   // '' pour retirer le bouton Playlist
  };
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tactile=window.matchMedia&&matchMedia('(hover: none) and (pointer: coarse)').matches;

  // --- Langue : suit le bouton FR/EN du site ---
  var langBtn=document.getElementById('langBtn');
  function lang(){return langBtn&&langBtn.textContent.trim()==='FR'?'en':'fr';}
  var T={
    fr:{fond:'Fond',fen:'Fenêtre 3D',tv:'Hors Champ TV',deux:'Les deux',ht:'Head tracking',htOn:'Head tracking : actif · Recentrer',load:'Chargement…',err:'Caméra indisponible',
        tel:'Mixe avec ton téléphone',sp:'Playlist',telOn:'Téléphone connecté',pop:'Scanne avec l\'appareil photo de ton téléphone : zappe, mélange les deux chaînes, ajoute des effets.',
        prep:'Préparation…',errTel:'Connexion impossible pour l\'instant. Réessaie dans un moment.',fermer:'Fermer',titre:'● TÉLÉCOMMANDE'},
    en:{fond:'Background',fen:'3D window',tv:'Hors Champ TV',deux:'Both',ht:'Head tracking',htOn:'Head tracking: on · Recenter',load:'Loading…',err:'Camera unavailable',
        tel:'Mix it with your phone',sp:'Playlist',telOn:'Phone connected',pop:'Scan with your phone camera: zap, blend both channels, add effects.',
        prep:'Getting ready…',errTel:'Can\'t connect right now. Try again in a moment.',fermer:'Close',titre:'● REMOTE'}
  };
  function t(k){return T[lang()][k];}

  // --- Styles ---
  var css=document.createElement('style');
  css.textContent=
   '#fd-fonds{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}'+
   '#fd-fonds>*{position:absolute;inset:0;width:100%;height:100%;display:block;border:0}'+
   '#fd-voile{transition:opacity .6s}'+
   'section,footer{position:relative;z-index:1}'+
   '.fd-barre{position:fixed;left:1rem;bottom:1rem;z-index:9000;display:flex;flex-wrap:wrap;gap:.4rem;align-items:flex-end;max-width:calc(100vw - 2rem)}'+
   '.fd-btn,.fd-choix{font:600 .62rem "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:#f2f1f6;background:rgba(8,7,13,.72);'+
     'border:1px solid rgba(242,241,246,.28);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}'+
   '.fd-btn{padding:.45rem .7rem;cursor:pointer}'+
   '.fd-btn:hover,.fd-btn.on{border-color:#c9ff3d;color:#c9ff3d}'+
   '.fd-btn:focus-visible,.fd-choix button:focus-visible{outline:2px solid #c9ff3d;outline-offset:2px}'+
   '.fd-btn i{display:inline-block;width:.45rem;height:.45rem;border-radius:50%;background:#555;margin-right:.45rem}'+
   '.fd-btn.on i{background:#c9ff3d;box-shadow:0 0 8px #c9ff3d}'+
   '.fd-choix{display:flex;align-items:stretch}'+
   '.fd-choix span{padding:.45rem .6rem;opacity:.55;border-right:1px solid rgba(242,241,246,.18)}'+
   '.fd-choix button{font:inherit;letter-spacing:inherit;text-transform:inherit;color:inherit;background:none;border:0;padding:.45rem .65rem;cursor:pointer;opacity:.6}'+
   '.fd-choix button:hover{opacity:1}'+
   '.fd-choix button[aria-pressed="true"]{opacity:1;color:#c9ff3d}'+
   '.fd-pop{position:absolute;left:0;bottom:calc(100% + .5rem);width:250px;box-sizing:border-box;padding:16px;background:rgba(5,6,5,.9);border:1px solid #2f7a4a;'+
     'backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 10px 40px rgba(0,0,0,.4);display:grid;gap:10px;text-align:center;color:#e9e4d6;font:11px/1.55 "IBM Plex Mono",monospace}'+
   '.fd-pop[hidden],.fd-sp[hidden]{display:none}'+
   '.fd-sp{position:absolute;left:0;bottom:calc(100% + .5rem);width:min(352px,calc(100vw - 2rem));background:rgba(8,7,13,.85);border:1px solid rgba(242,241,246,.28);padding:6px;box-sizing:border-box;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}'+
   '.fd-sp iframe{display:block;width:100%;height:152px;border:0;border-radius:10px}'+
   '.fd-pop b{font:400 1.1rem/1 "IBM Plex Mono",monospace;letter-spacing:.08em;color:#6dff9a;text-shadow:0 0 8px rgba(109,255,154,.5)}'+
   '.fd-pop .qr{width:176px;height:176px;justify-self:center;background:#fff;padding:8px;box-sizing:border-box;display:grid;place-items:center}'+
   '.fd-pop .qr img{width:100%;height:100%;image-rendering:pixelated}'+
   '.fd-pop p{margin:0;color:#9fb3a5}'+
   '.fd-pop .fermer{justify-self:center;background:none;border:0;color:#9fb3a5;text-decoration:underline;cursor:pointer;font:inherit}'+
   '[hidden].fd-btn{display:none}'+
   '.fd-mob{display:none}'+
   /* Téléphone : un seul petit bouton « Fond » sous l'en-tête, qui ouvre un panneau */
   '@media(max-width:767px){'+
     '.fd-mob{display:flex;align-items:center;gap:.4rem;position:fixed;right:.75rem;top:calc(60px + .6rem);z-index:9001;padding:.5rem .7rem;font-size:.6rem}'+
     '.fd-mob b{display:inline-block;width:.55rem;height:.55rem;border-radius:50%;background:linear-gradient(90deg,#c9ff3d 50%,transparent 50%);border:1px solid #c9ff3d}'+
     '.fd-barre{left:.75rem;right:.75rem;bottom:auto;top:calc(60px + 3.3rem);max-width:none;flex-direction:column;align-items:stretch;gap:.5rem;padding:.6rem;'+
       'background:rgba(8,7,13,.94);border:1px solid rgba(242,241,246,.22);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);'+
       'visibility:hidden;opacity:0;transform:translateY(-6px);transition:opacity .2s,transform .2s,visibility 0s .2s}'+
     '.fd-barre.ouvert{visibility:visible;opacity:1;transform:none;transition:opacity .2s,transform .2s}'+
     '.fd-choix{display:grid;grid-template-columns:repeat(3,1fr);font-size:.62rem}'+
     '.fd-choix span{display:none}'+
     '.fd-choix button{padding:.75rem .3rem;border-right:1px solid rgba(242,241,246,.14)}'+
     '.fd-choix button:last-child{border-right:0}'+
     '.fd-btn{font-size:.62rem;padding:.75rem .7rem;text-align:left}'+
     '.fd-sp{position:static;width:100%;padding:0;border:0;background:none}'+
   '}'+
   '@media(max-width:767px) and (prefers-reduced-motion:reduce){.fd-barre{transition:none}}';
     '.fd-btn,.fd-choix{font-size:.56rem}.fd-btn,.fd-choix span,.fd-choix button{padding:.35rem .5rem}}';
  document.head.appendChild(css);

  // --- Barre de choix ---
  var barre=document.createElement('div');barre.className='fd-barre';
  barre.innerHTML=
    '<div class="fd-choix" role="group"><span class="l-fond"></span>'+
    '<button type="button" data-f="fenetre"></button><button type="button" data-f="tele"></button><button type="button" data-f="deux"></button></div>'+
    '<button type="button" class="fd-btn" id="fd-ht"><i></i><span></span></button>'+
    '<button type="button" class="fd-btn" id="fd-tel" hidden><i></i><span></span></button>'+
    '<button type="button" class="fd-btn" id="fd-spb" hidden><span></span></button>'+
    '<div class="fd-sp" hidden></div>'+
    '<div class="fd-pop" hidden role="dialog"><b class="l-titre"></b><div class="qr"></div><p class="l-texte"></p><button type="button" class="fermer"></button></div>';
  document.body.appendChild(barre);
  // Téléphone : bouton qui ouvre / ferme le panneau
  var bMob=document.createElement('button');bMob.type='button';bMob.className='fd-btn fd-mob';
  bMob.setAttribute('aria-expanded','false');bMob.innerHTML='<b></b><span></span>';
  document.body.appendChild(bMob);
  function panneau(o){barre.classList.toggle('ouvert',o);bMob.setAttribute('aria-expanded',String(o));bMob.classList.toggle('on',o)}
  bMob.onclick=function(e){e.stopPropagation();panneau(!barre.classList.contains('ouvert'))};
  document.addEventListener('click',function(e){if(barre.classList.contains('ouvert')&&!barre.contains(e.target))panneau(false)});
  // Couches de fond : télé, voile, fenêtre 3D (dans cet ordre)
  var couche=document.createElement('div');couche.id='fd-fonds';couche.setAttribute('aria-hidden','true');
  var voile=document.createElement('div');voile.id='fd-voile';voile.style.background='rgba('+CFG.couleurVoile+','+CFG.voile+')';voile.style.opacity='0';
  couche.appendChild(voile);
  document.body.insertBefore(couche,document.body.firstChild);
  // Le contenu du site passe toujours devant le fond (même les blocs sans position, comme la barre de chiffres)
  Array.prototype.forEach.call(document.body.children,function(el){
    if(el===couche||el===barre||/^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(el.tagName))return;
    var cs=getComputedStyle(el);
    if(cs.position==='static'){el.style.position='relative';el.style.zIndex='1'}
    else if(cs.position==='relative'&&cs.zIndex==='auto')el.style.zIndex='1';
  });
  var bHt=barre.querySelector('#fd-ht'),bTel=barre.querySelector('#fd-tel'),pop=barre.querySelector('.fd-pop');
  var bSp=barre.querySelector('#fd-spb'),sp=barre.querySelector('.fd-sp');
  var etatHt='off',etatTel={n:0},texteTel='';
  function libelles(){
    barre.querySelector('.l-fond').textContent=t('fond');
    barre.querySelector('[data-f="fenetre"]').textContent=t('fen');
    barre.querySelector('[data-f="tele"]').textContent=t('tv');
    barre.querySelector('[data-f="deux"]').textContent=t('deux');
    barre.querySelector('.fd-choix').setAttribute('aria-label',t('fond'));
    bHt.querySelector('span').textContent=etatHt==='on'?t('htOn'):etatHt==='load'?t('load'):etatHt==='err'?t('err'):t('ht');
    bTel.querySelector('span').textContent=etatTel.n>0?t('telOn'):t('tel');
    bSp.querySelector('span').textContent='♫ '+t('sp');
    bMob.querySelector('span').textContent=t('fond');
    barre.querySelector('.l-titre').textContent=t('titre');
    barre.querySelector('.fermer').textContent=t('fermer');
    barre.querySelector('.l-texte').textContent=texteTel?t(texteTel):'';
  }
  if(langBtn)langBtn.addEventListener('click',function(){setTimeout(libelles,0)});

  var choix=CFG.defaut;
  try{var memo=localStorage.getItem('kim-fond');if(memo==='fenetre'||memo==='tele'||memo==='deux')choix=memo;}catch(e){}
  barre.querySelectorAll('.fd-choix button').forEach(function(b){b.onclick=function(){appliquer(b.dataset.f,true)}});

  function appliquer(f,memoriser){
    choix=f;
    if(memoriser)try{localStorage.setItem('kim-fond',f)}catch(e){}
    barre.querySelectorAll('.fd-choix button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.f===f))});
    var fen=f!=='tele',tv=f!=='fenetre';
    if(fen)Fenetre.demarrer();else Fenetre.arreter();
    if(tv)Tele.demarrer();else Tele.arreter();
    voile.style.opacity=tv?'1':'0';
    bHt.hidden=!fen;
    bTel.hidden=!tv||tactile;
    pop.hidden=true;
    libelles();
  }

  /* =================== Fenêtre 3D (head tracking) =================== */
  var Fenetre=(function(){
    var pret=false,actif=false,canvas,renderer,scene,camera,mat,H=2,D=3.2,W;
    var head={x:0,y:0,z:D},tg={x:0,y:0,z:D},mode='mouse',lastMove=0,landmarker,video,baseEye=null,lastT=-1,t0=performance.now();
    function charger(){
      return new Promise(function(ok,ko){
        if(window.THREE)return ok();
        var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        s.onload=ok;s.onerror=ko;document.head.appendChild(s);
      });
    }
    function construire(){
      var THREE=window.THREE;canvas=document.createElement('canvas');canvas.id='hb';
      couche.appendChild(canvas);
      try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:false,alpha:true});}catch(e){canvas.remove();return false;}
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
      scene=new THREE.Scene();camera=new THREE.PerspectiveCamera();W=H*innerWidth/innerHeight;
      var small=innerWidth<700,k=small?.5:1,P=[],C=[],Sz=[];
      function col(h,s,l){var c=new THREE.Color();c.setHSL(h,s,l);return c}
      function add(x,y,z,c,size){P.push(x,y,z);C.push(c.r,c.g,c.b);Sz.push(size)}
      function line(a,b,n,c,size){n=Math.max(2,Math.round(n*k));for(var i=0;i<n;i++){var u=i/(n-1);add(a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u,c,size)}}
      var DEPTH=10,hw=H*1.3,hh=H/2,z,x,y,i,N;
      for(z=0;z>=-DEPTH;z-=.5){var c1=col(.25+(-z)*.045,.8,.55);
        line([-hw,-hh,z],[hw,-hh,z],60,c1,.04);line([-hw,hh,z],[hw,hh,z],60,c1,.03);
        line([-hw,-hh,z],[-hw,hh,z],40,c1,.035);line([hw,-hh,z],[hw,hh,z],40,c1,.035);}
      for(x=-hw;x<=hw+1e-3;x+=.5){line([x,-hh,0],[x,-hh,-DEPTH],90,col(.3,.8,.5),.03);line([x,hh,0],[x,hh,-DEPTH],90,col(.9,.8,.5),.022)}
      for(y=-hh;y<=hh+1e-3;y+=.5){line([-hw,y,0],[-hw,y,-DEPTH],90,col(.9,.8,.5),.03);line([hw,y,0],[hw,y,-DEPTH],90,col(.9,.8,.5),.03)}
      N=Math.round(2400*k);
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
      mat=new THREE.ShaderMaterial({uniforms:{uScale:{value:1},uOp:{value:CFG.opaciteFenetre}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
        vertexShader:'attribute float size;attribute vec3 color;varying vec3 vC;uniform float uScale;void main(){vC=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*uScale/max(-mv.z,.1);gl_Position=projectionMatrix*mv;}',
        fragmentShader:'varying vec3 vC;uniform float uOp;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float a=exp(-d*d*16.);gl_FragColor=vec4(vC,a*uOp);}'});
      scene.add(new THREE.Points(g,mat));
      addEventListener('resize',resize);resize();
      addEventListener('pointermove',function(e){if(!actif||mode!=='mouse'||e.pointerType==='touch')return;lastMove=performance.now();
        tg.x=(e.clientX/innerWidth-.5)*W*.5*CFG.intensite;tg.y=-(e.clientY/innerHeight-.5)*H*.5*CFG.intensite});
      document.addEventListener('visibilitychange',function(){if(!document.hidden&&actif)boucle()});
      return true;
    }
    function resize(){if(!renderer)return;renderer.setSize(innerWidth,innerHeight,false);W=H*innerWidth/innerHeight;mat.uniforms.uScale.value=innerHeight*.9*renderer.getPixelRatio()}
    function setView(hx,hy,hz){var n=.05,f=60;camera.position.set(hx,hy,hz);camera.updateMatrixWorld();
      camera.projectionMatrix.makePerspective((-W/2-hx)*n/hz,(W/2-hx)*n/hz,(H/2-hy)*n/hz,(-H/2-hy)*n/hz,n,f);
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert()}
    function track(){
      if(mode!=='webcam'||!video||video.currentTime===lastT)return;lastT=video.currentTime;
      var r=landmarker.detectForVideo(video,performance.now()),f=r.faceLandmarks&&r.faceLandmarks[0];if(!f)return;
      var nose=f[1],eye=Math.hypot(f[33].x-f[263].x,f[33].y-f[263].y);if(!baseEye)baseEye=eye;
      tg.x=(.5-nose.x)*W*CFG.intensite*1.2;tg.y=(.5-nose.y)*H*CFG.intensite*1.1;
      tg.z=Math.min(Math.max(D*baseEye/eye,D*.6),D*1.6);
    }
    var enBoucle=false;
    function boucle(){
      if(!actif||document.hidden){enBoucle=false;return}
      enBoucle=true;
      track();
      var now=performance.now();
      if(mode==='mouse'&&(reduce||now-lastMove>4000)){var s=(now-t0)/1000;tg.x=Math.sin(s*.25)*W*.12*(reduce?0:1);tg.y=Math.cos(s*.19)*H*.08*(reduce?0:1);}
      head.x+=(tg.x-head.x)*.1;head.y+=(tg.y-head.y)*.1;head.z+=(tg.z-head.z)*.1;
      setView(head.x,head.y,head.z);renderer.render(scene,camera);
      if(!reduce||mode==='webcam')requestAnimationFrame(boucle);else enBoucle=false;
    }
    function demarrer(){
      actif=true;
      if(pret){canvas.style.display='';if(!enBoucle)boucle();return}
      charger().then(function(){if(pret)return;pret=construire();if(pret&&actif){canvas.style.display='';boucle()}else if(pret)canvas.style.display='none'}).catch(function(){});
    }
    function arreter(){
      actif=false;if(canvas)canvas.style.display='none';
      if(video&&video.srcObject){video.srcObject.getTracks().forEach(function(tr){tr.stop()});video.srcObject=null}
      if(mode==='webcam'){mode='mouse';tg.z=D;etatHt='off';bHt.classList.remove('on');libelles()}
    }
    async function webcam(){
      if(mode==='webcam'){baseEye=null;return}
      etatHt='load';libelles();
      try{
        if(!landmarker){
          var m=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs');
          var fs=await m.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
          landmarker=await m.FaceLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'},runningMode:'VIDEO',numFaces:1});
        }
        video=video||document.createElement('video');video.playsInline=true;video.muted=true;
        video.srcObject=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:'user'}});
        await video.play();mode='webcam';baseEye=null;etatHt='on';bHt.classList.add('on');libelles();
        if(!enBoucle)boucle();
      }catch(err){console.warn(err);mode='mouse';etatHt='err';libelles();setTimeout(function(){if(etatHt==='err'){etatHt='off';libelles()}},3000)}
    }
    return {demarrer:demarrer,arreter:arreter,webcam:webcam};
  })();
  bHt.onclick=function(){Fenetre.webcam()};

  /* =================== Hors Champ TV (avec QR téléphone) =================== */
  var Tele=(function(){
    var cadre=null,pret=false,attente=false;
    function demarrer(){
      if(cadre)return;
      pret=false;
      cadre=document.createElement('iframe');cadre.id='hct-fond';
      cadre.src=new URL(CFG.pageTele+'?fond',location.href).href;
      cadre.title='Hors Champ TV';cadre.setAttribute('aria-hidden','true');cadre.setAttribute('allow','autoplay');cadre.tabIndex=-1;
      cadre.style.opacity=CFG.opaciteTele;
      couche.insertBefore(cadre,couche.firstChild);
    }
    function arreter(){if(cadre){cadre.remove();cadre=null;pret=false;etatTel.n=0;bTel.classList.remove('on')}}
    function demanderQR(){
      if(!cadre)return;
      if(!pret){attente=true;return}
      cadre.contentWindow.postMessage({source:'hct-site',type:'qr'},location.origin);
    }
    addEventListener('message',function(e){
      if(!cadre||e.source!==cadre.contentWindow||!e.data||e.data.source!=='hct')return;
      var m=e.data,qr=pop.querySelector('.qr');
      if(m.type==='pret'){pret=true;if(attente){attente=false;demanderQR()}}
      else if(m.type==='qr'){
        qr.innerHTML='';
        if(m.img){var img=document.createElement('img');img.alt='QR';img.src=m.img;qr.appendChild(img)}
        texteTel='pop';libelles();
      }
      else if(m.type==='erreur'){texteTel='errTel';libelles()}
      else if(m.type==='connexion'){etatTel.n=m.n;bTel.classList.toggle('on',m.n>0);if(m.n>0)pop.hidden=true;libelles()}
    });
    return {demarrer:demarrer,arreter:arreter,demanderQR:demanderQR};
  })();
  bTel.onclick=function(){
    if(!pop.hidden){pop.hidden=true;return}
    pop.hidden=false;
    if(!pop.querySelector('.qr').firstChild){texteTel='prep';libelles();Tele.demanderQR()}
  };
  pop.querySelector('.fermer').onclick=function(){pop.hidden=true;bTel.focus()};
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){pop.hidden=true;sp.hidden=true;panneau(false)}});

  // --- Playlist Spotify (lecteur intégré, chargé au premier clic) ---
  var mSp=/open\.spotify\.com\/(?:intl-[a-z-]+\/)?(playlist|album|track)\/([A-Za-z0-9]+)/.exec(CFG.playlist||'');
  if(mSp){
    bSp.hidden=false;
    bSp.onclick=function(){
      pop.hidden=true;
      if(!sp.firstChild){
        var f=document.createElement('iframe');f.title='Playlist Spotify';f.loading='lazy';
        f.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        f.src='https://open.spotify.com/embed/'+mSp[1]+'/'+mSp[2]+'?theme=0';sp.appendChild(f);
      }
      sp.hidden=!sp.hidden;bSp.classList.toggle('on',!sp.hidden);
    };
  }
  bTel.addEventListener('click',function(){sp.hidden=true;bSp.classList.remove('on')});

  // Pendant la salle de projection, le fond se met en pause (moins de vidéos à charger)
  window.addEventListener('salle:etat',function(e){
    if(e.detail&&e.detail.ouverte){Tele.arreter();Fenetre.arreter();barre.style.display='none';bMob.style.display='none'}
    else{barre.style.display='';bMob.style.display='';appliquer(choix,false)}
  });

  appliquer(choix,false);
})();
