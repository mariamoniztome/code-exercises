// ml5.js integration for Sound Classification and PoseNet
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

  soundClassifier = ml5.soundClassifier(
    "SpeechCommands18w",
    { probabilityThreshold: 0.85 },
    soundModelReady
  );
}

function soundModelReady() {
  soundClassifier.classify(gotCommand);
}

function gotCommand(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  const label = results[0].label;
  const conf = results[0].confidence;
  // Filter by confidence
  if (conf < 0.85) return;

  // Map commands to planet selection
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

// PoseNet 
function gotPoses(results) {
  if (results.length === 0) return;
  poses = results;   // Update the global variable used in draw()
}

function setupPoseNet() {
  poseNet = ml5.poseNet(video, poseModelReady);
  poseNet.on("pose", gotPoses);
}

// Get hand X position
function getHandX() {
  if (poses.length === 0) return null;

  // Consider only the first detected person
  const pose = poses[0].pose;

  // Get wrist positions
  const right = pose.rightWrist;
  const left = pose.leftWrist;

  // Prioritize right hand
  if (right.confidence > 0.4) return right.x;
  if (left.confidence > 0.4) return left.x;

  return null;
}

// Get hand Y position
function getHandY() {
  if (poses.length === 0) return null;

  const pose = poses[0].pose;

  const right = pose.rightWrist;
  const left = pose.leftWrist;

  // Prioritize right hand
  if (right.confidence > 0.4) return right.y;
  if (left.confidence > 0.4) return left.y;

  return null;
}

function updateSunCycle() {
  const handX = getHandX();
  const handY = getHandY();
  
  if (handY !== null) {
    // Control brightness with vertical hand position (Y-axis)
    // Higher hand position = brighter sun
    sunBright = map(handY, 0, height, 0.2, 1.5, true);
    
    // Update sun brightness in the UI if the element exists
    const brightnessDisplay = document.getElementById('brightness-display');
    if (brightnessDisplay) {
      brightnessDisplay.textContent = `Brightness: ${sunBright.toFixed(2)}`;
    }
  }
  
  if (handX !== null) {
    // Control hue with horizontal hand position (X-axis)
    // Left to right = 0 to 360 degrees
    sunHue = map(handX, 0, width, 0, 360, true);
    
    // Update sun color in the UI if the element exists
    const hueDisplay = document.getElementById('hue-display');
    if (hueDisplay) {
      hueDisplay.textContent = `Hue: ${Math.round(sunHue)}°`;
      hueDisplay.style.color = `hsl(${sunHue}, 100%, 50%)`;
    }
  }
  
  // Convert HSL to RGB for the sun color
  const rgb = hslToRgb(sunHue / 360, 0.9, 0.5);
  solarColor = { r: rgb.r, g: rgb.g, b: rgb.b };
  
  // Update sun progress based on brightness for other effects
  sunProgress = map(sunBright, 0.2, 1.5, 0, 1, true);
}
