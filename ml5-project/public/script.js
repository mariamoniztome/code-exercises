// ===================================
// BODY AS BRUSH - INTERACTIVE PAINTING
// Using p5.js + ml5.js PoseNet
// ===================================

// Global variables
let video;
let poseNet;
let poses = [];
let drawingCanvas;

// Drawing state
let currentTool = 'pencil';
let currentColor = '#ff0000';
let brushSize = 10;
let backgroundColor = '#ffff';

// Tracking previous position for smooth lines
let prevX = null;
let prevY = null;

// UI element references
let pencilBtn, eraserBtn, colorPicker, brushSizeSlider, sizeValueDisplay, clearBtn, statusDiv;

// PoseNet model ready flag
let modelReady = false;

// ===================================
// P5.JS SETUP
// ===================================
function setup() {
  // Create fullscreen canvas
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('app');

  // Create separate drawing layer
  drawingCanvas = createGraphics(windowWidth, windowHeight);
  drawingCanvas.background(backgroundColor);

  // Initialize webcam
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Hide the video element (we'll show optional preview)

  // Initialize PoseNet model
  poseNet = ml5.poseNet(video, modelLoaded);

  // Listen for pose detection events
  poseNet.on('pose', (results) => {
    poses = results;
  });

  // Get UI element references
  pencilBtn = document.getElementById('pencilBtn');
  eraserBtn = document.getElementById('eraserBtn');
  colorPicker = document.getElementById('colorPicker');
  brushSizeSlider = document.getElementById('brushSize');
  sizeValueDisplay = document.getElementById('sizeValue');
  clearBtn = document.getElementById('clearBtn');
  statusDiv = document.getElementById('status');

  // Setup event listeners
  setupEventListeners();

  // Smooth drawing
  drawingCanvas.strokeCap(ROUND);
  drawingCanvas.strokeJoin(ROUND);
}

// ===================================
// MODEL LOADED CALLBACK
// ===================================
function modelLoaded() {
  console.log('PoseNet Model Loaded!');
  modelReady = true;
  statusDiv.innerHTML = '<div class="ready">Ready! Move your hand to paint</div>';
}

// ===================================
// UI EVENT LISTENERS
// ===================================
function setupEventListeners() {
  // Tool selection
  pencilBtn.addEventListener('click', () => {
    currentTool = 'pencil';
    pencilBtn.classList.add('active');
    eraserBtn.classList.remove('active');
  });

  eraserBtn.addEventListener('click', () => {
    currentTool = 'eraser';
    eraserBtn.classList.add('active');
    pencilBtn.classList.remove('active');
  });

  // Color picker
  colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
  });

  // Brush size slider
  brushSizeSlider.addEventListener('input', (e) => {
    brushSize = parseInt(e.target.value);
    sizeValueDisplay.textContent = brushSize;
  });

  // Clear canvas button
  clearBtn.addEventListener('click', () => {
    drawingCanvas.background(backgroundColor);
    prevX = null;
    prevY = null;
  });
}

// ===================================
// P5.JS DRAW LOOP
// ===================================
function draw() {
  // Display the drawing canvas
  image(drawingCanvas, 0, 0);

  // Track and draw with body keypoints
  if (modelReady && poses.length > 0) {
    const pose = poses[0].pose;

    // Try to get right wrist position (keypoint 10)
    let brushX, brushY;
    const rightWrist = pose.keypoints[10];

    // If right wrist is detected with confidence, use it
    if (rightWrist && rightWrist.score > 0.3) {
      brushX = rightWrist.position.x;
      brushY = rightWrist.position.y;
    }
    // Fallback to nose (keypoint 0) if wrist not visible
    else {
      const nose = pose.keypoints[0];
      if (nose && nose.score > 0.5) {
        brushX = nose.position.x;
        brushY = nose.position.y;
      }
    }

    // If we have a valid position, draw
    if (brushX !== undefined && brushY !== undefined) {
      // Scale from video dimensions to canvas dimensions
      brushX = map(brushX, 0, video.width, 0, width);
      brushY = map(brushY, 0, video.height, 0, height);

      // Draw cursor indicator (visual feedback)
      drawCursor(brushX, brushY);

      // Draw line from previous position
      if (prevX !== null && prevY !== null) {
        // Calculate distance to prevent jumps
        const distance = dist(prevX, prevY, brushX, brushY);

        // Only draw if movement is reasonable (not a tracking jump)
        if (distance < 100) {
          drawLine(prevX, prevY, brushX, brushY);
        }
      }

      // Update previous position
      prevX = brushX;
      prevY = brushY;
    } else {
      // Reset previous position if no keypoint detected
      prevX = null;
      prevY = null;
    }
  }

  // Optional: Show small webcam preview in corner
  drawVideoPreview();
}

// ===================================
// DRAWING FUNCTIONS
// ===================================

// Draw a smooth line on the drawing canvas
function drawLine(x1, y1, x2, y2) {
  drawingCanvas.strokeWeight(brushSize);

  if (currentTool === 'pencil') {
    // Draw with current color
    drawingCanvas.stroke(currentColor);
  } else if (currentTool === 'eraser') {
    // Erase by drawing with background color
    drawingCanvas.stroke(backgroundColor);
  }

  // Draw line from previous to current position
  drawingCanvas.line(x1, y1, x2, y2);
}

// Draw cursor indicator showing current brush position
function drawCursor(x, y) {
  push();
  noFill();

  // Outer ring
  stroke(255, 255, 255, 200);
  strokeWeight(2);
  circle(x, y, brushSize + 10);

  // Inner dot
  if (currentTool === 'pencil') {
    fill(currentColor);
  } else {
    fill(backgroundColor);
  }
  noStroke();
  circle(x, y, brushSize);

  pop();
}

// Draw optional video preview in corner
function drawVideoPreview() {
  const previewWidth = 160;
  const previewHeight = 120;
  const padding = 10;

  push();
  // Position in bottom-right corner
  const x = width - previewWidth - padding;
  const y = height - previewHeight - padding;

  // Semi-transparent background
  fill(0, 150);
  noStroke();
  rect(x - 5, y - 5, previewWidth + 10, previewHeight + 10, 8);

  // Draw flipped video (mirror effect)
  push();
  translate(x + previewWidth, y);
  scale(-1, 1);
  image(video, 0, 0, previewWidth, previewHeight);
  pop();

  // Draw pose skeleton on preview
  if (poses.length > 0) {
    drawPoseSkeleton(poses[0].pose, x, y, previewWidth, previewHeight);
  }

  pop();
}

// Draw pose skeleton on video preview
function drawPoseSkeleton(pose, offsetX, offsetY, previewWidth, previewHeight) {
  push();

  // Draw keypoints
  for (let i = 0; i < pose.keypoints.length; i++) {
    const keypoint = pose.keypoints[i];
    if (keypoint.score > 0.2) {
      const x = map(keypoint.position.x, 0, video.width, offsetX, offsetX + previewWidth);
      const y = map(keypoint.position.y, 0, video.height, offsetY, offsetY + previewHeight);

      // Highlight right wrist
      if (i === 10) {
        fill(255, 0, 110);
        noStroke();
        circle(x, y, 8);
      } else {
        fill(0, 255, 200, 150);
        noStroke();
        circle(x, y, 4);
      }
    }
  }

  pop();
}

// ===================================
// WINDOW RESIZE HANDLER
// ===================================
function windowResized() {
  // Resize main canvas
  resizeCanvas(windowWidth, windowHeight);

  // Create new drawing canvas and copy old content
  const oldCanvas = drawingCanvas;
  drawingCanvas = createGraphics(windowWidth, windowHeight);
  drawingCanvas.background(backgroundColor);
  drawingCanvas.image(oldCanvas, 0, 0);
}