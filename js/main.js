/* ============ QUESTION BANK ============ */
// QUESTIONS is loaded from js/questions.js (must be included before this file)

/* ============ PAGE LOADING + IMAGE EFFECTS ============ */
(function(){
  window.addEventListener('load', ()=>{
    document.body.classList.add('loaded');
    const loader = document.getElementById('pageLoader');
    if(loader){
      setTimeout(()=> loader.style.display = 'none', 500);
    }
  });

  const avatarWrap = document.querySelector('.avatar-wrap');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(avatarWrap && !reduceMotion){
    avatarWrap.addEventListener('pointermove', (event)=>{
      const rect = avatarWrap.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 12;
      const rotateX = (0.5 - py) * 12;
      avatarWrap.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
    });
    avatarWrap.addEventListener('pointerleave', ()=>{
      avatarWrap.style.transform = '';
    });
  }
})();

/* ============ THEME TOGGLE ============ */
(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const sunPath = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>';
  const moonPath = '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"></path>';
  function apply(theme){
    if(theme){ root.setAttribute('data-theme', theme); } else { root.removeAttribute('data-theme'); }
    const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    icon.innerHTML = isDark ? sunPath : moonPath;
  }
  let saved = null;
  try{ saved = localStorage.getItem('yk-theme'); }catch(e){}
  apply(saved);
  toggle.addEventListener('click', function(){
    const current = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    apply(next);
    try{ localStorage.setItem('yk-theme', next); }catch(e){}
  });
})();

/* ============ NAV: scroll state, active link, mobile menu ============ */
(function(){
  const nav = document.getElementById('siteNav');
  const progress = document.getElementById('scroll-progress');
  function onScroll(){
    nav.classList.toggle('scrolled', window.scrollY > 30);
    const h = document.documentElement;
    const scrolled = (h.scrollTop || document.body.scrollTop);
    const height = h.scrollHeight - h.clientHeight;
    progress.style.width = height > 0 ? (scrolled / height * 100) + '%' : '0%';
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  const links = document.querySelectorAll('.nav-links a');
  const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = '#' + entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
      }
    });
  }, {rootMargin:'-45% 0px -50% 0px'});
  sections.forEach(s => obs.observe(s));

  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('closeMenu');
  function openMenu(){ mobileMenu.classList.add('open'); hamburger.setAttribute('aria-expanded','true'); }
  function shutMenu(){ mobileMenu.classList.remove('open'); hamburger.setAttribute('aria-expanded','false'); }
  hamburger.addEventListener('click', openMenu);
  closeMenu.addEventListener('click', shutMenu);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', shutMenu));
})();

/* ============ SCROLL REVEAL ============ */
(function(){
  const items = document.querySelectorAll('.reveal, .t-item, .stagger');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in-view'); obs.unobserve(e.target); } });
  }, {threshold:0.15});
  items.forEach(i => obs.observe(i));
})();

/* ============ SPOTLIGHT + TILT ON CARDS ============ */
(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = document.querySelectorAll('.spotlight');
  cards.forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      card.style.setProperty('--mx', mx+'px');
      card.style.setProperty('--my', my+'px');
      if(!reduceMotion && card.classList.contains('tilt-card')){
        const rx = ((my / r.height) - 0.5) * -6;
        const ry = ((mx / r.width) - 0.5) * 6;
        card.style.transform = 'perspective(700px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-4px)';
      }
    });
    card.addEventListener('mouseleave', ()=>{
      if(card.classList.contains('tilt-card')) card.style.transform = '';
    });
  });
})();

/* ============ HERO PARALLAX ON SCROLL ============ */
(function(){
  const visual = document.querySelector('.hero-visual');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!visual || reduceMotion) return;
  document.addEventListener('scroll', ()=>{
    const y = Math.min(window.scrollY, 500);
    visual.style.transform = 'translateY(' + (y*0.15) + 'px)';
  }, {passive:true});
})();

/* ============ HERO NETWORK CANVAS ============ */
(function(){
  const canvas = document.getElementById('network');
  const ctx = canvas.getContext('2d');
  let w, h, dpr, points = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = Math.max(14, Math.round((w*h)/9000));
    points = Array.from({length:count}, ()=>({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.25, vy: (Math.random()-0.5)*0.25
    }));
  }
  function getColor(){
    const styles = getComputedStyle(document.documentElement);
    return styles.getPropertyValue('--accent').trim() || '#0f9b8e';
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    const color = getColor();
    points.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;
    });
    for(let i=0;i<points.length;i++){
      for(let j=i+1;j<points.length;j++){
        const dx = points[i].x-points[j].x, dy = points[i].y-points[j].y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 90){
          ctx.strokeStyle = color;
          ctx.globalAlpha = (1 - dist/90) * 0.35;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(points[i].x, points[i].y); ctx.lineTo(points[j].x, points[j].y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 0.9;
    points.forEach(p=>{
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    if(!reduceMotion) requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ============ SKILL TAGS ============ */
(function(){
  const pharmSkills = ["Pharmacology","Pharmaceutics","Hospital Pharmacy","Pharmaceutical Chemistry","Pharmacovigilance","Drug Information","Prescription Knowledge","Basic Pharmacy Practice"];
  const techSkills = ["HTML","CSS","JavaScript","Programming Fundamentals","Database Concepts","Web Development","Computer Science Fundamentals"];
  const pharmWrap = document.getElementById('pharmSkills');
  const techWrap = document.getElementById('techSkills');
  pharmSkills.forEach(s=>{
    const el = document.createElement('span'); el.className = 'skill-tag';
    el.innerHTML = '<span class="lvl-dot"></span>' + s; pharmWrap.appendChild(el);
  });
  techSkills.forEach(s=>{
    const el = document.createElement('span'); el.className = 'skill-tag learning';
    el.innerHTML = '<span class="lvl-dot"></span>' + s + ' — learning'; techWrap.appendChild(el);
  });
})();

/* ============ QUIZ LOGIC ============ */
(function(){
  const QUIZ_LEN = 15;
  let pool = [], current = 0, score = 0, answered = [], locked = false;

  document.getElementById('bankSize').textContent = QUESTIONS.length;

  const startScreen = document.getElementById('quizStart');
  const playScreen = document.getElementById('quizPlay');
  const completeScreen = document.getElementById('quizComplete');

  const qCurrentEl = document.getElementById('qCurrent');
  const qTotalEl = document.getElementById('qTotal');
  const qScoreEl = document.getElementById('qScore');
  const qScoreTotalEl = document.getElementById('qScoreTotal');
  const progressFill = document.getElementById('progressFill');
  const qCategory = document.getElementById('qCategory');
  const qText = document.getElementById('qText');
  const qAnswers = document.getElementById('qAnswers');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }

  function startQuiz(){
    pool = shuffle(QUESTIONS).slice(0, Math.min(QUIZ_LEN, QUESTIONS.length)).map(q=>{
      const order = shuffle([0,1,2,3]);
      return { ...q, order, userAnswer: null };
    });
    current = 0; score = 0;
    qTotalEl.textContent = pool.length;
    qScoreTotalEl.textContent = pool.length;
    startScreen.style.display = 'none';
    completeScreen.style.display = 'none';
    playScreen.style.display = 'block';
    renderQuestion();
  }

  function renderQuestion(){
    const q = pool[current];
    locked = q.userAnswer !== null;
    qCurrentEl.textContent = current+1;
    qScoreEl.textContent = score;
    progressFill.style.width = (((current) / pool.length) * 100) + '%';
    qCategory.textContent = q.category || 'General Pharmacy';
    qText.style.opacity = 0;
    qAnswers.innerHTML = '';
    const letters = ['A','B','C','D'];

    q.order.forEach((origIdx, i)=>{
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.setAttribute('role','radio');
      btn.innerHTML = '<span class="letter">'+letters[i]+'</span><span>'+q.answers[origIdx]+'</span>';
      if(locked){
        btn.disabled = true;
        if(origIdx === q.correct) btn.classList.add('correct');
        if(q.userAnswer === origIdx && origIdx !== q.correct) btn.classList.add('incorrect');
      } else {
        btn.addEventListener('click', ()=> selectAnswer(origIdx));
      }
      qAnswers.appendChild(btn);
    });

    nextBtn.disabled = !locked;
    nextBtn.textContent = current === pool.length-1 ? 'Finish Quiz' : 'Next Question';
    prevBtn.style.visibility = current === 0 ? 'hidden' : 'visible';

    requestAnimationFrame(()=>{
      qText.textContent = q.question;
      qText.style.transition = 'opacity .35s ease';
      qText.style.opacity = 1;
    });
  }

  function selectAnswer(origIdx){
    if(locked) return;
    const q = pool[current];
    q.userAnswer = origIdx;
    locked = true;
    if(origIdx === q.correct) score++;
    renderQuestion();
  }

  function nextQuestion(){
    if(!locked) return;
    if(current === pool.length-1){ finishQuiz(); return; }
    current++;
    renderQuestion();
  }
  function prevQuestion(){
    if(current === 0) return;
    current--;
    renderQuestion();
  }

  function finishQuiz(){
    playScreen.style.display = 'none';
    completeScreen.style.display = 'block';
    const pct = Math.round((score/pool.length)*100);
    document.getElementById('finalScoreText').textContent = 'Your Score: '+score+' / '+pool.length;
    const ringPct = document.getElementById('ringPct');
    const ringFill = document.getElementById('ringFill');
    const circumference = 2*Math.PI*52;
    ringFill.style.strokeDasharray = circumference;
    requestAnimationFrame(()=>{
      ringFill.style.strokeDashoffset = circumference - (circumference * pct/100);
    });
    let n = 0;
    const step = Math.max(1, Math.round(pct/40));
    const timer = setInterval(()=>{
      n = Math.min(pct, n+step);
      ringPct.textContent = n+'%';
      if(n>=pct) clearInterval(timer);
    }, 20);

    let msg;
    if(pct >= 85) msg = "Excellent work — your pharmacy fundamentals are strong.";
    else if(pct >= 60) msg = "Good effort — a solid grasp with room to sharpen a few topics.";
    else msg = "Nice try — keep reviewing, every attempt builds your knowledge.";
    document.getElementById('perfMsg').textContent = msg;

    try{
      const best = parseInt(localStorage.getItem('yk-quiz-best')||'0',10);
      if(pct > best) localStorage.setItem('yk-quiz-best', String(pct));
    }catch(e){}

    if(pct >= 85 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) launchConfetti();
  }

  document.getElementById('startQuizBtn').addEventListener('click', startQuiz);
  document.getElementById('retryBtn').addEventListener('click', startQuiz);
  nextBtn.addEventListener('click', nextQuestion);
  prevBtn.addEventListener('click', prevQuestion);

  document.addEventListener('keydown', (e)=>{
    if(playScreen.style.display !== 'block') return;
    if(['1','2','3','4'].includes(e.key)){
      const idx = parseInt(e.key,10)-1;
      const btns = qAnswers.querySelectorAll('.answer-btn');
      if(btns[idx] && !btns[idx].disabled) btns[idx].click();
    }
    if(e.key === 'ArrowRight' && !nextBtn.disabled) nextQuestion();
    if(e.key === 'ArrowLeft') prevQuestion();
  });
})();

/* ============ CONFETTI ============ */
function launchConfetti(){
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const colors = ['#0f9b8e','#2bc4b5','#5fd8ea','#2f6fd6','#ffffff'];
  const pieces = Array.from({length:90}, ()=>({
    x: Math.random()*canvas.width, y: -20 - Math.random()*canvas.height*0.4,
    vx: (Math.random()-0.5)*2.4, vy: 2+Math.random()*3,
    size: 4+Math.random()*5, color: colors[Math.floor(Math.random()*colors.length)],
    rot: Math.random()*360, vr: (Math.random()-0.5)*10
  }));
  let frame = 0;
  function tick(){
    frame++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6);
      ctx.restore();
    });
    if(frame < 150) requestAnimationFrame(tick);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  tick();
}
