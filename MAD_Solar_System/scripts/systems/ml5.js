// ---------------- ML5 SYSTEM ----------------

// Referências globais usadas no sketch
let soundClassifier;
let poseNet;
let video;
let poses = [];

// Variável global que o sketch.js irá usar para o nascer/pôr-do-sol
// 0 = pôr-do-sol / 1 = nascer do sol
let sunProgress = 0.5;

// ---------------------------------------------------------------------
// 1) SOUND CLASSIFIER
// ---------------------------------------------------------------------

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

// ---------------------------------------------------------------------
// 3) POSENET — atualizado para mão esquerda/direita
// ---------------------------------------------------------------------

function setupPoseNet() {
  console.log("PoseNet...");
  poseNet = ml5.poseNet(video, poseModelReady);
  poseNet.on("pose", gotPoses);
}

function poseModelReady() {
  console.log("PoseNet pronto");
}

// ✋ NOVO: Função para obter a posição da mão
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

// 🆕 NOVO: Atualiza o sunProgress automaticamente baseado na mão
function updateSunCycle() {
  const y = getHandY();
  if (y === null) return;

  // y=0 (topo)->1 (dia), y=480 (baixo)->0 (noite)
  let target = map(y, 0, 480, 1, 0);
  target = constrain(target, 0, 1);

  sunProgress = lerp(sunProgress, target, 0.1); // movimento suave
}

// A tua função original de PoseNet agora só atualiza "poses"
function gotPoses(results) {
  if (results.length === 0) return;

  poses = results;
}