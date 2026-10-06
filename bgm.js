/* Angelology theme song (BGM) — "YOUR QUEST BEGINS"
   Put the mp3 next to the html files as bgm.mp3. */
(function(){
  var SRC='bgm.mp3', VOL=0.35;
  function get(s,k){try{return s.getItem(k);}catch(e){return null;}}
  function set(s,k,v){try{s.setItem(k,v);}catch(e){}}
  var audio=new Audio();
  audio.src=SRC; audio.loop=true; audio.volume=VOL; audio.preload='auto';
  var btn=document.createElement('button');
  btn.type='button'; btn.id='bgm-toggle'; btn.setAttribute('aria-label','テーマ曲 ON/OFF');
  btn.innerHTML='<span class="bgm-ico">♪</span><span class="bgm-label">Theme Song</span>';
  var css=document.createElement('style');
  css.textContent='#bgm-toggle{position:fixed;left:14px;bottom:14px;z-index:9999;display:flex;align-items:center;gap:8px;'+
    'padding:9px 16px 9px 12px;border-radius:999px;border:1.5px solid #d99a2f;background:rgba(20,28,24,.88);color:#f3ce87;'+
    'font:700 .78rem/1 "Zen Maru Gothic",sans-serif;letter-spacing:.06em;cursor:pointer;box-shadow:0 6px 16px rgba(0,0,0,.35);'+
    'backdrop-filter:blur(4px);transition:transform .2s,background .2s;}'+
    '#bgm-toggle:hover{transform:translateY(-2px);}'+
    '#bgm-toggle .bgm-ico{font-size:1.1rem;}'+
    '#bgm-toggle.on{background:#d99a2f;color:#2b1d08;}'+
    '#bgm-toggle.on .bgm-ico{animation:bgmPulse 1.6s ease-in-out infinite;}'+
    '@keyframes bgmPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}'+
    '@media (max-width:600px){#bgm-toggle{left:10px;bottom:10px;padding:8px 13px 8px 10px;}}';
  var playing=false;
  function ui(){btn.classList.toggle('on',playing);btn.setAttribute('aria-pressed',playing?'true':'false');}
  var unlockBound=false;
  function unlock(){
    // first real tap/key/click on the page: start (or un-mute) the music
    if(get(localStorage,'bgm-on')==='0'){return;}
    audio.muted=false;
    var p=audio.play();
    if(p&&p.then){p.then(function(){playing=true;ui();}).catch(function(){bind();});}
  }
  function bind(){
    if(unlockBound){return;} unlockBound=true;
    var evs=['pointerdown','touchstart','touchend','click','keydown'];
    var go=function(){
      evs.forEach(function(e){document.removeEventListener(e,go,true);});
      unlockBound=false; unlock();
    };
    evs.forEach(function(e){document.addEventListener(e,go,true);});
  }
  function play(){
    var t=parseFloat(get(sessionStorage,'bgm-time')||'0');
    if(t>0){try{audio.currentTime=t;}catch(e){}}
    audio.muted=false;
    var p=audio.play();
    if(p&&p.then){p.then(function(){playing=true;ui();}).catch(function(){
      // autoplay with sound is blocked: play silently now, un-mute at the first touch
      audio.muted=true;
      var q=audio.play();
      if(q&&q.then){q.then(function(){playing=true;ui();}).catch(function(){});}
      bind();
    });} else {playing=true;ui();}
  }
  function stop(){audio.pause();audio.muted=false;playing=false;ui();}
  btn.addEventListener('click',function(){
    if(playing){set(localStorage,'bgm-on','0');stop();}
    else{set(localStorage,'bgm-on','1');play();}
  });
  function save(){if(playing||audio.currentTime>0){set(sessionStorage,'bgm-time',String(audio.currentTime));}}
  window.addEventListener('pagehide',save);
  setInterval(function(){if(playing){save();}},1500);
  // only show the button when the mp3 actually exists
  fetch(SRC,{method:'HEAD'}).then(function(r){
    if(!r.ok){return;}
    document.head.appendChild(css); document.body.appendChild(btn); ui();
    if(get(localStorage,'bgm-on')!=='0'){play();}
  }).catch(function(){});
})();
