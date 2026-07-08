(function(){
  'use strict';
  var RM = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var TOUCH = matchMedia('(hover:none),(pointer:coarse)').matches;
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ── scroll progress ── */
  var prog = document.getElementById('progress');
  function onScroll(){
    var h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (h>0 ? (scrollY/h*100) : 0) + '%';
    document.getElementById('nav').classList.toggle('scrolled', scrollY > 30);
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ── reveals ── */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ── custom cursor ── */
  if(!TOUCH){
    var c = document.getElementById('cursor'), d = document.getElementById('cursor-dot');
    var cx=innerWidth/2, cy=innerHeight/2, tx=cx, ty=cy;
    addEventListener('mousemove', function(e){
      document.body.classList.add('cur-active');
      tx=e.clientX; ty=e.clientY;
      d.style.transform = 'translate('+tx+'px,'+ty+'px)';
    });
    (function loop(){
      cx += (tx-cx)*.18; cy += (ty-cy)*.18;
      c.style.transform = 'translate('+cx+'px,'+cy+'px)';
      requestAnimationFrame(loop);
    })();
    var hoverSel = 'a,button,.btn,.gcard,.mob,.member,.soc,[data-magnetic]';
    document.querySelectorAll(hoverSel).forEach(function(el){
      el.addEventListener('mouseenter', function(){ document.body.classList.add('cur-hover'); });
      el.addEventListener('mouseleave', function(){ document.body.classList.remove('cur-hover'); });
    });
  }

  /* ── magnetic buttons ── */
  if(!TOUCH && !RM){
    document.querySelectorAll('[data-magnetic]').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width/2), my = e.clientY - (r.top + r.height/2);
        el.style.transform = 'translate('+(mx*.25)+'px,'+(my*.3)+'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });
  }

  /* ── hero parallax ── */
  if(!RM && !TOUCH){
    var px = document.querySelectorAll('[data-parallax]');
    addEventListener('mousemove', function(e){
      var x = (e.clientX/innerWidth - .5), y = (e.clientY/innerHeight - .5);
      px.forEach(function(el){ var f = parseFloat(el.getAttribute('data-parallax'))||0;
        el.style.transform = 'translate('+(x*f*60)+'px,'+(y*f*60)+'px)'; });
    });
  }

  /* ── card tilt ── */
  if(!TOUCH && !RM){
    document.querySelectorAll('.gcard').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var x = (e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.transform = 'translateY(-6px) perspective(900px) rotateX('+(-y*6)+'deg) rotateY('+(x*8)+'deg)';
      });
      card.addEventListener('mouseleave', function(){ card.style.transform = ''; });
    });
  }

  /* ── synthwave grid canvas ── */
  if(!RM){
    var gc = document.getElementById('grid-canvas'), gx = gc.getContext('2d');
    var GW=0, GH=0, gt=0;
    function gResize(){ GW=gc.width=gc.offsetWidth*devicePixelRatio; GH=gc.height=gc.offsetHeight*devicePixelRatio; }
    addEventListener('resize', gResize); gResize();
    function drawGrid(){
      gt += 0.012;
      gx.clearRect(0,0,GW,GH);
      var hz = GH*0.62;            // horizon
      // sun
      var sr = Math.min(GW,GH)*0.16;
      var grd = gx.createLinearGradient(0,hz-sr,0,hz);
      grd.addColorStop(0,'#ff2975'); grd.addColorStop(.5,'#b026ff'); grd.addColorStop(1,'#00f0ff');
      gx.save(); gx.beginPath();
      gx.arc(GW/2, hz, Math.max(2,sr), 0, Math.PI*2);
      gx.clip();
      gx.fillStyle = grd; gx.fillRect(GW/2-sr, hz-sr, sr*2, sr);
      // sun scanlines
      gx.fillStyle = 'rgba(7,7,13,.85)';
      for(var i=0;i<7;i++){ var sy = hz-sr + (sr/7)*i + (gt*40%(sr/7)); gx.fillRect(GW/2-sr, sy, sr*2, Math.max(2,sr/16)); }
      gx.restore();
      // floor grid (perspective)
      var lines = 18, depth = GH - hz;
      gx.lineWidth = Math.max(1,devicePixelRatio);
      for(var i=0;i<lines;i++){
        var p = ((i + (gt*1.5)%1) / lines);            // 0..1 moving
        var yy = hz + depth*(p*p);                    // accelerate toward bottom
        var alpha = Math.min(1, p*1.4);
        gx.strokeStyle = 'rgba(255,41,117,'+(alpha*.5)+')';
        gx.beginPath(); gx.moveTo(0,yy); gx.lineTo(GW,yy); gx.stroke();
      }
      // vanishing verticals
      var cols = 16;
      for(var j=0;j<=cols;j++){
        var xx = GW*(j/cols);
        gx.strokeStyle = 'rgba(0,240,255,'+(.18)+')';
        gx.beginPath(); gx.moveTo(GW/2 + (xx-GW/2)*.55, hz); gx.lineTo(xx, GH); gx.stroke();
      }
      requestAnimationFrame(drawGrid);
    }
    drawGrid();
  }

  /* ── ember particles ── */
  if(!RM){
    var ec = document.getElementById('ember-canvas'), ex = ec.getContext('2d');
    var EW=0, EH=0, parts=[];
    function eResize(){ EW=ec.width=ec.offsetWidth*devicePixelRatio; EH=ec.height=ec.offsetHeight*devicePixelRatio; }
    addEventListener('resize', eResize); eResize();
    var N = TOUCH ? 26 : 60;
    for(var i=0;i<N;i++) parts.push(spawn());
    function spawn(){
      return { x:Math.random()*EW, y:EH+Math.random()*60, r:Math.random()*2+0.6,
        vy:-(Math.random()*0.5+0.2), vx:(Math.random()-0.5)*0.3, a:Math.random()*0.6+0.2,
        c: Math.random()<0.5?'255,41,117':'0,240,255' };
    }
    function drawEmbers(){
      ex.clearRect(0,0,EW,EH);
      parts.forEach(function(p){
        p.y += p.vy; p.x += p.vx; p.a -= 0.0015;
        if(p.y < -10 || p.a<=0){ p = Object.assign(p, spawn()); }
        ex.fillStyle = 'rgba('+p.c+','+Math.max(0,p.a)+')';
        ex.beginPath(); ex.arc(p.x,p.y, Math.max(0.4,p.r), 0, Math.PI*2); ex.fill();
      });
      requestAnimationFrame(drawEmbers);
    }
    drawEmbers();
  }
})();
