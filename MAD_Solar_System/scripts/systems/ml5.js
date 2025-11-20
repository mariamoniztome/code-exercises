let soundClassifier;
let poseNet;
let video;
let poses = [];
let sunProgress = 0.5;

// Sound Classifier
function setupSoundClassifier() {
  if (typeof ml5 === "undefined") {
    console.warn("ml5 não carregado");
    return;
  }

  console.log("Sound Classifier...");

  soundClassifier = ml5.soundClassifier(
    "SpeechCommands18w",
    { probabilityThreshold: 0.85 },
    soundModelReady
  );
}

function soundModelReady() {
  console.log("Sound pronto");
  soundClassifier.classify(gotCommand);
}

function gotCommand(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  const label = results[0].label;
  const conf = results[0].confidence;
  if (conf < 0.85) return;

  console.log(`Comando: ${label}`);

  // Navegação por voz
  if (label === "zero") selectPlanetByIndex(9);
  else if (label === "one") selectPlanetByIndex(0);
  else if (label === "two") selectPlanetByIndex(1);
  else if (label === "three") selectPlanetByIndex(2);
  else if (label === "four") selectPlanetByIndex(3);
  else if (label === "five") selectPlanetByIndex(4);
  else if (label === "six") selectPlanetByIndex(5);
  else if (label === "seven") selectPlanetByIndex(6);
  else if (label === "eight") selectPlanetByIndex(7);
  else if (label === "nine") selectPlanetByIndex(8);
  else if (label === "stop") unselectPlanet();
  else if (label === "go") isPaused = !isPaused;
}

// 3) PoseNet 
function gotPoses(results) {
  if (results.length === 0) return;
  poses = results;   // atualiza a variável global usada no draw()
}

function setupPoseNet() {
  console.log("PoseNet...");
  poseNet = ml5.poseNet(video, poseModelReady);
  poseNet.on("pose", gotPoses);
}

function poseModelReady() {
  console.log("PoseNet pronto");
}

// Retorna X normalizado entre 0–640 OU null se nenhuma mão for detetada
function getHandX() {
  if (poses.length === 0) return null;

  const pose = poses[0].pose;

  const right = pose.rightWrist;
  const left = pose.leftWrist;

  // Prioridade à mão direita
  if (right.confidence > 0.4) return right.x;
  if (left.confidence > 0.4) return left.x;

  return null;
}

function getHandY() {
  if (poses.length === 0) return null;

  const pose = poses[0].pose;

  const right = pose.rightWrist;
  const left = pose.leftWrist;

  // prioridade à mão direita
  if (right.confidence > 0.4) return right.y;
  if (left.confidence > 0.4) return left.y;

  return null;
}

function updateSunCycle() {
  const x = getHandX();
  const y = getHandY();
  if (x === null || y === null) return;

  // HUE controla a cor (mover horizontal)
  sunHue = map(x, 0, 640, 0, 360);

  // brilho controla intensidade (mover vertical)
  sunBright = map(y, 480, 0, 0.3, 2.5);
}
