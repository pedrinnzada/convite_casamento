
// ─── CURSOR ──────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor(){
  cursor.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  cursorRing.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
  requestAnimationFrame(animCursor);
})();

// ─── PARTICLES ───────────────────────────────────
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);

class Particle {
  constructor(){
    this.x = Math.random()*W;
    this.y = Math.random()*H;
    this.size = Math.random()*1.5 + .3;
    this.speedX = (Math.random()-.5)*.25;
    this.speedY = (Math.random()-.5)*.25;
    this.alpha = Math.random()*.4 + .1;
  }
  update(){
    this.x += this.speedX; this.y += this.speedY;
    if(this.x<0) this.x=W; if(this.x>W) this.x=0;
    if(this.y<0) this.y=H; if(this.y>H) this.y=0;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fillStyle = `rgba(201,168,76,${this.alpha})`;
    ctx.fill();
  }
}

for(let i=0;i<70;i++) particles.push(new Particle());

function animParticles(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{ p.update(); p.draw(); });
  requestAnimationFrame(animParticles);
}
animParticles();

// ─── ENVELOPE OPEN ───────────────────────────────
const intro = document.getElementById('intro');
const mainContent = document.getElementById('main-content');
let opened = false;

document.getElementById('envelopeWrap').addEventListener('click', openEnvelope);

function openEnvelope(){
  if(opened) return; opened = true;
  // Animate seal disappearing, flap going up
  const flap = document.querySelector('.env-flap');
  const seal = document.querySelector('.env-seal');
  const envelope = document.getElementById('envelope');

  seal.style.transition = 'opacity .4s';
  seal.style.opacity = '0';

  setTimeout(()=>{
    flap.style.transition = 'transform .6s ease';
    flap.style.transform = 'rotateX(-180deg)';
  }, 300);

  setTimeout(()=>{
    envelope.style.transition = 'transform .6s ease, opacity .6s ease';
    envelope.style.transform = 'scale(1.08) translateY(-10px)';
    envelope.style.opacity = '0';
  }, 800);

  setTimeout(()=>{
    intro.classList.add('hidden');
    mainContent.classList.add('visible');
    // trigger hero animations
    setTimeout(()=>{
      document.querySelectorAll('#hero .reveal, #hero .scroll-cue').forEach(el => el.classList.add('in'));
    }, 200);
  }, 1400);
}

// ─── SCROLL ANIMATIONS ────────────────────────────
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── PARALLAX HERO BG ─────────────────────────────
const heroBg = document.getElementById('heroBg');
window.addEventListener('scroll', ()=>{
  const y = window.scrollY;
  if(heroBg) heroBg.style.transform = `translateY(${y * .35}px)`;
});

// ─── CONFIRM BUTTON ───────────────────────────────
const confirmModal = document.getElementById('confirmModal');
const confirmForm = document.getElementById('confirmForm');

document.getElementById('btnConfirm').addEventListener('click', ()=>{
  confirmModal.classList.add('open');
});

document.getElementById('modalClose').addEventListener('click', ()=>{
  confirmModal.classList.remove('open');
});

confirmModal.addEventListener('click', function(e){
  if(e.target === this) this.classList.remove('open');
});

const responsavelGroup = document.getElementById('responsavelGroup');
const responsavelInput = document.getElementById('responsavelName');

document.querySelectorAll('input[name="guestType"]').forEach(radio => {
  radio.addEventListener('change', function(){
    if(this.value === 'acompanhado'){
      responsavelGroup.classList.remove('hidden');
      responsavelInput.setAttribute('required', 'required');
    } else {
      responsavelGroup.classList.add('hidden');
      responsavelInput.removeAttribute('required');
      responsavelInput.value = '';
    }
  });
});

confirmForm.addEventListener('submit', function(e){
  e.preventDefault();
  const nome = document.getElementById('guestName').value.trim();
  const tipo = document.querySelector('input[name="guestType"]:checked').value;
  const tipoTexto = tipo === 'responsavel' ? 'Sou o responsável da família' : 'Estou acompanhado do responsável';
  const nomeResponsavel = tipo === 'acompanhado' ? responsavelInput.value.trim() : '';

  let mensagem = `Olá! Quero confirmar minha presença no casamento de Ana & Lucas.%0A%0A` +
                 `*Nome:* ${nome}%0A` +
                 `*Status:* ${tipoTexto}%0A`;

  if(nomeResponsavel){
    mensagem += `*Responsável:* ${nomeResponsavel}%0A`;
  }

  mensagem += `%0ANos vemos em 14 de junho! 🥂🍖`;

  window.open(`https://wa.me/5531992546664?text=${mensagem}`, '_blank');
  confirmModal.classList.remove('open');
  confirmForm.reset();
  responsavelGroup.classList.add('hidden');
  responsavelInput.removeAttribute('required');
});
