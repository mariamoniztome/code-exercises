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