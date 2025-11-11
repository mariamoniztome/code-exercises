// Som
let spaceSound;
let volume = 0.5;
let soundEnabled = true;
let soundButton;

// Loading
let isLoading = true;
let loadProgress = 0;
let assetsToLoad = 11;
let assetsLoaded = 0;

// Estrelas
let stars = [];
const NUM_STARS = 200;
const STAR_FIELD_SIZE = 3000;

// Sol
const SUN_RADIUS = 80;

// Planetas
let planets = [];
const NUM_PLANETS = 10;
let selectedPlanet = null;
let hoveredPlanet = null;
let isZoomedIn = false;
let isPaused = false;

// Câmara
let camX = 0, camY = -800, camZ = 2000;
let targetX = 0, targetY = -800, targetZ = 2000;

let planetTextures = [];

// Cursor particles MELHORADAS
let cursorParticles = [];
const MAX_CURSOR_PARTICLES = 60;

// ML5
let soundClassifier;
let faceApi;
let video;
let detections = [];
let poseNet;
let poses = [];

let globalBrightness = 1.0;
let globalColorTint = null;

class CursorParticle {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = 50 + floor(random(0, 30));
    this.size = random(3, 10);
    this.hue = random(180, 255);
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.vy += 0.015;
    this.life--;
  }
  
  drawScreen() {
    push();
    resetMatrix();
    translate(-width / 2, -height / 2);
    blendMode(ADD);
    noStroke();
    const alpha = map(this.life, 0, 80, 0, 255);
    
    // Estrela principal
    fill(255, 255, 255, alpha);
    ellipse(this.x, this.y, this.size);
    
    // Brilho suave
    fill(255, 255, 255, alpha * 0.4);
    ellipse(this.x, this.y, this.size * 1.8);
    
    // Cauda da estrela
    fill(255, 255, 255, alpha * 0.6);
    const tx = this.x - this.vx * 4;
    const ty = this.y - this.vy * 4;
    ellipse(tx, ty, max(1, this.size * 0.5));
    
    pop();
  }
  
  isDead() {
    return this.life <= 0;
  }
}

class Planet {
  constructor(orbitRadius, size, speed, yearData, index) {
    this.orbitRadius = orbitRadius;
    this.size = size;
    this.speed = speed;
    this.yearData = yearData;
    this.index = index;
    this.angle = random(TWO_PI);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
    this.hoverScale = 1.0;
    this.glowIntensity = 0;
    this.satellites = [];
    this.particles = [];
    this.pulsePhase = random(TWO_PI);
    this.initUniqueFeatures();
  }
  
  initUniqueFeatures() {
    if(this.index===1){
      for(let i=0;i<3;i++)
        this.satellites.push({angle:random(TWO_PI),speed:random(0.02,0.05),distance:this.size*(1.5+i*0.3),size:5});
    }
    if(this.index===3){
      for(let i=0;i<5;i++)
        this.particles.push({angle:random(TWO_PI),speed:random(0.01,0.03),distance:this.size*1.4,phase:random(TWO_PI)});
    }
    if(this.index===5){
      for(let i=0;i<8;i++)
        this.particles.push({angle:(TWO_PI/8)*i,speed:0.02,distance:this.size*1.3,twinkle:random(TWO_PI)});
    }
    if(this.index===8){
      for(let i=0;i<6;i++)
        this.particles.push({angle:(TWO_PI/6)*i,phase:random(TWO_PI),length:this.size*0.8});
    }
  }

  update() {
    if(!isPaused){
      this.angle+=this.speed;
      this.rotationX+=0.005;
      this.rotationY+=0.008;
      this.rotationZ+=0.003;
      this.pulsePhase+=0.05;
      for(let s of this.satellites)s.angle+=s.speed;
      for(let p of this.particles){
        if(p.speed)p.angle+=p.speed;
        if(p.phase!==undefined)p.phase+=0.05;
        if(p.twinkle!==undefined)p.twinkle+=0.1;
      }
    }
    if(this===hoveredPlanet){
      this.hoverScale=lerp(this.hoverScale,1.2,0.15);
      this.glowIntensity=lerp(this.glowIntensity,1,0.15);
    } else {
      this.hoverScale=lerp(this.hoverScale,1.0,0.15);
      this.glowIntensity=lerp(this.glowIntensity,0,0.15);
    }
  }

  drawOrbit() {
    push();
    noFill();
    stroke(this.yearData.color.r,this.yearData.color.g,this.yearData.color.b,80);
    strokeWeight(3);
    rotateX(PI/2);
    circle(0,0,this.orbitRadius*2);
    pop();
  }

  display() {
    push();
    let x=cos(this.angle)*this.orbitRadius;
    let z=sin(this.angle)*this.orbitRadius;
    translate(x,0,z);
    scale(this.hoverScale);
    
    if(this.glowIntensity>0.1){
      push();
      noFill();
      stroke(this.yearData.color.r,this.yearData.color.g,this.yearData.color.b,this.glowIntensity*200);
      strokeWeight(6);
      box(this.size*1.4);
      pop();
      
      push();
      noFill();
      stroke(this.yearData.color.r,this.yearData.color.g,this.yearData.color.b,this.glowIntensity*100);
      strokeWeight(3);
      box(this.size*1.7);
      pop();
    }
    
    this.drawAnimBefore();
    rotateX(this.rotationX);
    rotateY(this.rotationY);
    rotateZ(this.rotationZ);
    
    if(globalColorTint)tint(globalColorTint);
    
    push();
    texture(planetTextures[this.index]);
    if(this.glowIntensity>0.1)
      emissiveMaterial(
        this.yearData.color.r*this.glowIntensity*0.4,
        this.yearData.color.g*this.glowIntensity*0.4,
        this.yearData.color.b*this.glowIntensity*0.4
      );
    box(this.size);
    pop();
    
    rotateZ(-this.rotationZ);
    rotateY(-this.rotationY);
    rotateX(-this.rotationX);
    this.drawAnimAfter();
    pop();
  }
  
  drawAnimBefore(){
    if(this.index===2){
      push();
      noStroke();
      fill(60,50,80,30);
      sphere(this.size*1.3);
      fill(60,50,80,20);
      sphere(this.size*1.5);
      pop();
    }
    if(this.index===4){
      push();
      noFill();
      stroke(100,255,150,100);
      strokeWeight(2);
      translate(this.size*0.15,this.size*0.15,this.size*0.15);
      box(this.size);
      pop();
    }
    if(this.index===6){
      push();
      noFill();
      let s=this.size+sin(this.pulsePhase)*10;
      stroke(180,100,200,150);
      strokeWeight(2);
      box(s);
      pop();
    }
  }
  
  drawAnimAfter(){
    if(this.index===0){
      push();
      for(let i=0;i<4;i++){
        let a=this.pulsePhase+(TWO_PI/4)*i;
        let d=this.size*0.7;
        let sx=cos(a)*d;
        let sy=sin(a)*d;
        noStroke();
        fill(255,255,200,200);
        translate(sx,sy,0);
        sphere(3);
        translate(-sx,-sy,0);
      }
      pop();
    }
    if(this.index===1){
      push();
      for(let s of this.satellites){
        let sx=cos(s.angle)*s.distance;
        let sz=sin(s.angle)*s.distance;
        noStroke();
        fill(150,160,180);
        translate(sx,0,sz);
        sphere(s.size);
        translate(-sx,0,-sz);
      }
      pop();
    }
    if(this.index===3){
      push();
      for(let p of this.particles){
        let px=cos(p.angle)*p.distance;
        let py=sin(p.phase)*15;
        let pz=sin(p.angle)*p.distance;
        noStroke();
        fill(200,170,100,200);
        translate(px,py,pz);
        sphere(4);
        translate(-px,-py,-pz);
      }
      pop();
    }
    if(this.index===5){
      push();
      for(let s of this.particles){
        let sx=cos(s.angle)*s.distance;
        let sz=sin(s.angle)*s.distance;
        let b=(sin(s.twinkle)+1)*0.5;
        noStroke();
        fill(255,255,255,b*255);
        translate(sx,0,sz);
        sphere(3);
        translate(-sx,0,-sz);
      }
      pop();
    }
    if(this.index===7){
      push();
      stroke(100,120,140,150);
      strokeWeight(1);
      noFill();
      let g=this.size*1.2;
      let sp=g/4;
      for(let i=-2;i<=2;i++){
        line(-g/2,i*sp,0,g/2,i*sp,0);
        line(i*sp,-g/2,0,i*sp,g/2,0);
      }
      pop();
    }
    if(this.index===8){
      push();
      for(let t of this.particles){
        stroke(255,80,150,200);
        strokeWeight(3);
        noFill();
        beginShape();
        for(let j=0;j<5;j++){
          let f=j/5;
          let tx=cos(t.angle)*t.length*f;
          let ty=sin(t.phase+f*PI)*15;
          let tz=sin(t.angle)*t.length*f;
          vertex(tx,ty,tz);
        }
        endShape();
      }
      pop();
    }
    if(this.index===9){
      push();
      noFill();
      let p=(sin(this.pulsePhase)+1)*0.5;
      stroke(0,200,255,p*200);
      strokeWeight(2);
      for(let i=0;i<3;i++){
        let o=i*15;
        translate(0,o,0);
        box(this.size*1.1);
        translate(0,-o,0);
      }
      pop();
    }
  }
}

const yearData=[
  {year:2017,theme:"Tema Surpresa",color:{r:120,g:120,b:120},description:"1.ª edição do MAD Game Jam integrada na Semana Aberta da ESMAD (8–9 abril). O início de tudo.",details:"A primeira edição marcou o início de uma tradição criativa. Realizada presencialmente na ESMAD, reuniu estudantes e criativos para um fim de semana intenso de desenvolvimento de jogos."},
  {year:2018,theme:"Gravidade",color:{r:150,g:160,b:180},description:"2.ª edição com o tema 'Gravidade'. Jogo vencedor: Neon Switch.",details:"As equipas exploraram mecânicas gravitacionais inovadoras. O tema inspirou jogos com física interessante e puzzles desafiantes que brincavam com o conceito de gravidade invertida."},
  {year:2019,theme:"Tema Surpresa",color:{r:60,g:50,b:80},description:"3.ª edição realizada de 22–24 fevereiro. Manteve a tradição do tema surpresa.",details:"Um evento de 3 dias cheio de criatividade. O tema manteve-se secreto até ao início, criando um ambiente de surpresa e adaptação rápida."},
  {year:2020,theme:"Mitologia",color:{r:200,g:170,b:100},description:"4.ª edição com tema 'Mitologia'. Jogos: Monument e Medusa Cult Crusader.",details:"A última edição antes da pandemia explorou mitos e lendas antigas. Deuses gregos, criaturas míticas e histórias épicas inspiraram criações memoráveis."},
  {year:2021,theme:"Déjà Vu",color:{r:100,g:255,b:150},description:"5.ª edição totalmente online. Jogos: artsy puzzles, MageVu, The Javu.",details:"A primeira edição digital devido à pandemia. O tema Déjà Vu explorou loops temporais, repetição e a sensação de já ter vivido algo antes."},
  {year:2022,theme:"Tudo muda à noite",color:{r:60,g:80,b:140},description:"6.ª edição com tema poético 'Tudo muda à noite'. Jogo destaque: Woolf.",details:"Um tema poético sobre transformações noturnas. Jogos exploraram ciclos dia/noite, metamorfoses e os mistérios que só a escuridão revela."},
  {year:2023,theme:"Tema Surpresa",color:{r:180,g:100,b:200},description:"7.ª edição em formato híbrido (presencial + online).",details:"Sete anos de MAD! O retorno ao formato híbrido permitiu participação tanto presencial quanto remota, expandindo o alcance da comunidade criativa."},
  {year:2024,theme:"Espaço Limitado",color:{r:100,g:120,b:140},description:"MAD Jam Fest 2024 com 4 jams: Game, Music, Media, Photo. Jogo: Claustromania.",details:"O festival expandiu para múltiplas vertentes criativas! O tema 'Espaço Limitado' inspirou trabalhos sobre restrições, claustrofobia e criatividade dentro de limites."},
  {year:2025,theme:"O Maravilhoso Grotesco",color:{r:255,g:80,b:150},description:"9.ª edição com tema 'O Maravilhoso Grotesco'. Exposição em Vila do Conde.",details:"A edição atual explora a beleza no bizarro. Com exposição associada no Curtas Vila do Conde, celebra o estranho, o inquietante e o maravilhosamente grotesco."},
  {year:2026,theme:"O Futuro",color:{r:0,g:200,b:255},description:"10.ª edição futura. Uma década de criatividade digital!",details:"O que virá a seguir? Uma década de inovação, comunidade e criatividade. O futuro do MAD está sendo escrito agora por cada participante."}
];

function incrementLoadProgress(){
  assetsLoaded++;
  loadProgress=assetsLoaded/assetsToLoad;
}

function selectPlanetByIndex(idx){
  if(idx<0||idx>=planets.length)return;
  const p=planets[idx];
  if(isZoomedIn&&selectedPlanet===p){
    unselectPlanet();
    return;
  }
  selectedPlanet=p;
  isZoomedIn=true;
  const px=cos(p.angle)*p.orbitRadius;
  const pz=sin(p.angle)*p.orbitRadius;
  targetX=px;
  targetY=0;
  targetZ=pz+p.size*1.5+150;
  showPlanetInfo(p);
  console.log(`✨ ${p.yearData.year} selecionado!`);
}

function unselectPlanet(){
  selectedPlanet=null;
  isZoomedIn=false;
  targetX=0;
  targetY=-800;
  targetZ=2000;
  hidePlanetInfo();
  console.log("🔙 Voltando");
}

function preload(){
  spaceSound=loadSound(
    "assets/sounds/space.mp3",
    ()=>incrementLoadProgress(),
    (err)=>{console.error(err);incrementLoadProgress();}
  );
  
  const urls=[
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWJzZDd6ZTExd3l0NW9iMnh3aDR3dnVoNHg5MWwwNXJhZm85NGowdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PidSzdflbzd1sksap9/giphy.gif",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTNtajRpZXMycmVqazk5b3p0eDBkNXI0YWRxNjlsdTR3YWZycXhubyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26AHL0EG33tA1geoE/giphy.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW83b2R0MHp0d29iMjEzaTk5bjA2d3gyOHo1YzhhcnE4b3d0NDM3eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l5XVHJM3A4WSLrZY33/giphy.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGtxNmF5dm5neGt1NjQ0am5xODk4dWxiZnd4bGg3ZWtmeXh0Zzl2dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a01ExCirWIhB60rvbT/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTg1MXM0a2U4c3B4dWIxMnFxN3I5b3V6OHBjcm16em1nMGJ0NDA3NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Q2koSsz3l42ZIiboyW/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHJyM3RzNTdjbGIxZzlzbXQwbnhraWU5eWZkMHFwbDh2NGxsZ2hvbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gjmSvyk6x7MTn63sN0/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzIzeW10MTZ2OGo4NW80M2g2ZmQwaGhlb3ptcDdjem1rN2I1bjJuNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bLdgTj2jCKe9Wf94Km/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHpocGY2cHozNmNnNWttYjQyYTZ1NnFtd2dldTJvMnNtZDZ2dHBjNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kPfuCRO04fAiqrHrTV/giphy.gif",
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnJmcGhmeGhxeml2NWdheGczaWx0c2Z6Zm8xNGU0YjMyNGc1b2JneSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3q3SUqPnxZGQpMNcjc/giphy.gif",
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnV1ZmkxMGYyeXV4cTNhYmZtcGZmeWYxMHdoZmN3YnRsNGdha2FvNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d569ZaUubJSWwnVGDY/giphy.gif"
  ];
  
  urls.forEach((url,i)=>{
    planetTextures[i]=loadImage(
      url,
      ()=>incrementLoadProgress(),
      (err)=>{console.error(err);incrementLoadProgress();}
    );
  });
}

function setup(){
  frameRate(60);
  createCanvas(windowWidth,windowHeight,WEBGL);
  camera(0,-800,2000);
  textureMode(NORMAL);
  textureWrap(REPEAT,REPEAT);
  
  for(let i=0;i<NUM_STARS;i++){
    stars.push({
      x:random(-STAR_FIELD_SIZE,STAR_FIELD_SIZE),
      y:random(-STAR_FIELD_SIZE,STAR_FIELD_SIZE),
      z:random(-STAR_FIELD_SIZE,STAR_FIELD_SIZE)
    });
  }
  
  let sizes=[50,55,50,70,55,60,52,75,58,90];
  for(let i=0;i<NUM_PLANETS;i++){
    planets.push(new Planet(200+i*100,sizes[i],random(0.002,0.008),yearData[i],i));
  }
  
  setTimeout(()=>{
    isLoading=false;
    if(spaceSound&&!spaceSound.isPlaying()){
      spaceSound.loop();
      spaceSound.setVolume(0.5);
    }
  },500);
  
  soundButton=document.getElementById("sound-toggle");
  if(soundButton)soundButton.addEventListener("click",toggleSound);
  
  window.addEventListener("keydown",(e)=>{
    const tag=document.activeElement&&document.activeElement.tagName;
    if(tag==="INPUT"||tag==="TEXTAREA")return;
    
    if(e.key==="Escape"){
      if(isZoomedIn)unselectPlanet();
    } else if(e.code==="Space"){
      isPaused=!isPaused;
      e.preventDefault();
    } else if(e.key==="h"||e.key==="H"){
      const p=document.getElementById("shortcuts");
      if(p)p.classList.toggle("hidden");
      e.preventDefault();
    } else if(e.key==="ArrowLeft"){
      if(selectedPlanet){
        let idx=planets.indexOf(selectedPlanet);
        idx=(idx-1+NUM_PLANETS)%NUM_PLANETS;
        selectPlanetByIndex(idx);
      }
      e.preventDefault();
    } else if(e.key==="ArrowRight"){
      if(selectedPlanet){
        let idx=planets.indexOf(selectedPlanet);
        idx=(idx+1)%NUM_PLANETS;
        selectPlanetByIndex(idx);
      }
      e.preventDefault();
    } else {
      const num=parseInt(e.key);
      if(!isNaN(num)){
        let idx=num-1;
        if(num===0)idx=9;
        if(idx>=0&&idx<NUM_PLANETS)selectPlanetByIndex(idx);
      }
    }
  });
  
  setupSoundClassifier();
  setupFaceApi();
  setupPoseNet();
}

function draw(){
  background(0);
  
  if(isLoading){
    drawLoadingScreen();
    return;
  }
  
  // Sound
  if(spaceSound&&spaceSound.isPlaying()&&soundEnabled){
    if(isZoomedIn){
      spaceSound.setVolume(0.1);
    } else {
      let d=dist(camX,camY,camZ,0,0,0);
      let v=map(d,400,2800,0.8,0.05,true);
      spaceSound.setVolume(v);
    }
  }
  
  // HOVER DETECTION
  if(!isZoomedIn){
    hoveredPlanet=null;
    for(let p of planets){
      let px=cos(p.angle)*p.orbitRadius;
      let py=0;
      let pz=sin(p.angle)*p.orbitRadius;
      
      let cd=dist(camX,camY,camZ,0,0,0);
      let pf=1000/(1000+pz-camZ);
      let sx=width/2+(px-camX)*pf;
      let sy=height/2+(py-camY)*pf;
      let d=dist(mouseX,mouseY,sx,sy);
      let ha=p.size*pf*1.5;
      
      if(d<ha){
        hoveredPlanet=p;
        break;
      }
    }
  } else {
    hoveredPlanet=null;
  }
  
  // Camera
  if(isZoomedIn&&selectedPlanet){
    let px=cos(selectedPlanet.angle)*selectedPlanet.orbitRadius;
    let pz=sin(selectedPlanet.angle)*selectedPlanet.orbitRadius;
    targetX=px;
    targetY=0;
    targetZ=pz+selectedPlanet.size*1.5+150;
  }
  
  camX=lerp(camX,targetX,0.05);
  camY=lerp(camY,targetY,0.05);
  camZ=lerp(camZ,targetZ,0.05);
  
  if(isZoomedIn&&selectedPlanet){
    let px=cos(selectedPlanet.angle)*selectedPlanet.orbitRadius;
    let pz=sin(selectedPlanet.angle)*selectedPlanet.orbitRadius;
    camera(camX,camY,camZ,px,0,pz,0,1,0);
  } else {
    camera(camX,camY,camZ,0,0,0,0,1,0);
  }
  
  // Stars
  if(!isZoomedIn){
    push();
    noStroke();
    fill(255);
    for(let s of stars){
      push();
      translate(s.x,s.y,s.z);
      sphere(1.5,6,4);
      pop();
    }
    pop();
  }
  
  // Lighting
  ambientLight(60,60,80);
  directionalLight(255,255,255,-0.3,1,0.1);
  directionalLight(150,150,170,0.4,-0.3,-0.2);
  
  // Sun
  if(!isZoomedIn){
    push();
    noStroke();
    emissiveMaterial(255,210,80);
    sphere(SUN_RADIUS,48,36);
    pop();
  }
  
  // Orbits
  if(!isZoomedIn){
    for(let p of planets){
      p.drawOrbit();
    }
  }
  
  // Planets
  for(let p of planets){
    if(!isPaused)p.update();
    if(isZoomedIn){
      if(p===selectedPlanet)p.display();
    } else {
      p.display();
    }
  }
  
  // Cursor particles
  for(let i=cursorParticles.length-1;i>=0;i--){
    const ps=cursorParticles[i];
    ps.update();
    ps.drawScreen();
    if(ps.isDead())cursorParticles.splice(i,1);
  }
  
  // Global effects
  globalBrightness=lerp(globalBrightness,1.0,0.05);
  if(globalColorTint){
    let r=lerp(red(globalColorTint),255,0.05);
    let g=lerp(green(globalColorTint),255,0.05);
    let b=lerp(blue(globalColorTint),255,0.05);
    if(abs(r-255)<5&&abs(g-255)<5&&abs(b-255)<5){
      globalColorTint=null;
    } else {
      globalColorTint=color(r,g,b);
    }
  }
  
  // TOOLTIP HOVER
  if(hoveredPlanet&&!isZoomedIn){
    drawHoverTooltip();
  }
  
  // Webcam
  if(video&&video.loadedmetadata){
    push();
    resetMatrix();
    translate(-width/2+90,height/2-100);
    noStroke();
    texture(video);
    rect(0,0,160,120);
    pop();
  }
}

function drawLoadingScreen(){
  push();
  resetMatrix();
  translate(0,0);
  background(0);
  
  fill(255);
  textSize(48);
  textAlign(CENTER,CENTER);
  textFont('Arial');
  text("MAD SOLAR SYSTEM",0,-100);
  
  textSize(18);
  fill(200);
  text("Festival MAD 2017–2025",0,-60);
  
  let bw=400;
  let bh=8;
  noStroke();
  fill(50);
  rectMode(CENTER);
  rect(0,40,bw,bh,4);
  
  fill(100,200,255);
  rect(0,40,bw*loadProgress,bh,4);
  
  textSize(16);
  fill(150);
  text(`${floor(loadProgress*100)}%`,0,80);
  
  let dots=".".repeat(floor((frameCount/20)%4));
  textSize(14);
  fill(120);
  text(`A carregar${dots}`,0,120);
  
  pop();
}

function drawHoverTooltip(){
  push();
  resetMatrix();
  
  let tx=mouseX-width/2;
  let ty=mouseY-height/2-60;
  translate(tx,ty);
  
  // Background colorido
  fill(
    hoveredPlanet.yearData.color.r,
    hoveredPlanet.yearData.color.g,
    hoveredPlanet.yearData.color.b,
    230
  );
  stroke(255);
  strokeWeight(3);
  rectMode(CENTER);
  rect(0,0,180,70,12);
  
  // Ano
  noStroke();
  fill(255);
  textSize(28);
  textAlign(CENTER,CENTER);
  textFont('Arial');
  text(hoveredPlanet.yearData.year,0,-12);
  
  // Tema
  textSize(14);
  fill(255,255,255,220);
  text(hoveredPlanet.yearData.theme,0,15);
  
  pop();
}

function mousePressed(){
  if(spaceSound&&!spaceSound.isPlaying()){
    spaceSound.loop();
    spaceSound.setVolume(0.5);
  }
  
  if(!isZoomedIn&&hoveredPlanet){
    selectedPlanet=hoveredPlanet;
    isZoomedIn=true;
    const px=cos(selectedPlanet.angle)*selectedPlanet.orbitRadius;
    const pz=sin(selectedPlanet.angle)*selectedPlanet.orbitRadius;
    targetX=px;
    targetY=0;
    targetZ=pz+selectedPlanet.size*1.5+150;
    showPlanetInfo(selectedPlanet);
  } else if(isZoomedIn){
    unselectPlanet();
  }
}

function showPlanetInfo(planet){
  const info=document.getElementById("planet-info");
  const title=document.getElementById("planet-title");
  const desc=document.getElementById("planet-description");
  
  if(info&&title&&desc){
    title.textContent=`${planet.yearData.year} — ${planet.yearData.theme}`;
    desc.textContent=planet.yearData.details;
    info.classList.remove("hidden");
  }
}

function hidePlanetInfo(){
  const info=document.getElementById("planet-info");
  if(info)info.classList.add("hidden");
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}

function mouseWheel(event){
  if(!isZoomedIn){
    targetZ+=event.delta*2;
    targetZ=constrain(targetZ,600,5000);
  }
  return false;
}

function toggleSound(){
  soundEnabled=!soundEnabled;
  if(soundEnabled){
    if(spaceSound&&!spaceSound.isPlaying())spaceSound.loop();
    spaceSound.setVolume(0.5);
    if(soundButton)soundButton.textContent="🔊";
  } else {
    spaceSound.setVolume(0);
    if(soundButton)soundButton.textContent="🔇";
  }
}

function mouseMoved(){
  // Criar partículas do cursor
  if(cursorParticles.length<MAX_CURSOR_PARTICLES){
    const vx=random(-2,2)+(pmouseX-mouseX)*0.05;
    const vy=random(-2,2)+(pmouseY-mouseY)*0.05;
    cursorParticles.push(new CursorParticle(mouseX,mouseY,-vx*1.4,-vy*1.4));
  }
}

function touchMoved(){
  mouseMoved();
  return false;
}

// ML5 Functions
function setupSoundClassifier(){
  if(typeof ml5==="undefined"){
    console.warn("ml5 não carregado");
    return;
  }
  console.log("Sound Classifier...");
  soundClassifier=ml5.soundClassifier("SpeechCommands18w",{probabilityThreshold:0.85},soundModelReady);
}

function soundModelReady(){
  console.log("Sound pronto");
  soundClassifier.classify(gotCommand);
}

function gotCommand(error,results){
  if(error){
    console.error(error);
    return;
  }
  const label=results[0].label;
  const conf=results[0].confidence;
  if(conf<0.85)return;
  
  console.log(`Comando: ${label}`);
  
  if(label==="zero")selectPlanetByIndex(9);
  else if(label==="one")selectPlanetByIndex(0);
  else if(label==="two")selectPlanetByIndex(1);
  else if(label==="three")selectPlanetByIndex(2);
  else if(label==="four")selectPlanetByIndex(3);
  else if(label==="five")selectPlanetByIndex(4);
  else if(label==="six")selectPlanetByIndex(5);
  else if(label==="seven")selectPlanetByIndex(6);
  else if(label==="eight")selectPlanetByIndex(7);
  else if(label==="nine")selectPlanetByIndex(8);
  else if(label==="stop")unselectPlanet();
  else if(label==="go")isPaused=!isPaused;
}

function setupFaceApi(){
  if(typeof ml5==="undefined"){
    console.warn("ml5 não carregado");
    return;
  }
  console.log("Face API...");
  video=createCapture(VIDEO);
  video.size(640,480);
  video.hide();
  faceApi=ml5.faceApi(video,{withLandmarks:true,withDescriptors:false},faceModelReady);
}

function faceModelReady(){
  console.log("Face pronto");
  faceApi.detect(gotFace);
}

function gotFace(error,result){
  if(error){
    console.error(error);
    return;
  }
  if(!result||result.length===0){
    faceApi.detect(gotFace);
    return;
  }
  
  detections=result;
  const exp=result[0].expressions;
  let maxE="";
  let maxV=0;
  
  for(let e in exp){
    if(exp[e]>maxV){
      maxV=exp[e];
      maxE=e;
    }
  }
  
  if(maxV>0.7){
    if(maxE==="happy"){
      globalBrightness=1.8;
      globalColorTint=color(255,255,200);
    } else if(maxE==="sad"){
      globalBrightness=0.4;
      globalColorTint=color(100,100,150);
    } else if(maxE==="angry"){
      globalBrightness=1.2;
      globalColorTint=color(255,100,100);
    } else if(maxE==="surprised"){
      globalBrightness=2.0;
      globalColorTint=color(255,255,255);
    }
  }
  
  faceApi.detect(gotFace);
}

function setupPoseNet(){
  if(typeof ml5==="undefined"||!video){
    console.warn("ml5 ou video não disponível");
    return;
  }
  console.log("PoseNet...");
  poseNet=ml5.poseNet(video,poseModelReady);
  poseNet.on("pose",gotPoses);
}

function poseModelReady(){
  console.log("PoseNet pronto");
}

function gotPoses(results){
  if(results.length===0)return;
  poses=results;
  const nose=results[0].pose.nose;
  const conf=results[0].pose.keypoints.find(k=>k.part==="nose")?.score||0;
  
  if(conf>0.5&&!isZoomedIn){
    const nx=map(nose.x,0,640,-200,200);
    const ny=map(nose.y,0,480,-200,200);
    targetX=nx;
    targetY=ny-800;
  }
}