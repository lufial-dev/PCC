import AppController from './controllers/app_controller.js';

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');


const buttonStart = document.getElementById('start-button');
const buttonShowLandmarksPoints = document.getElementById('show-landmarks');
const buttonShowNottinghamPoints = document.getElementById('show-points-nottingham');
const textInstruction = document.getElementById('instruction');
const divResults = document.getElementById('results');

const appController = new AppController({
    canvas : canvasCtx,
    canvasElement : canvasElement,
    textInstruction : textInstruction,
    buttonShowLandmarksPoints: buttonShowLandmarksPoints,
    buttonShowNottinghamPoints: buttonShowNottinghamPoints,
    buttonStart : buttonStart,
    divResults : divResults,
    
    
});
buttonShowLandmarksPoints.onclick = () => appController.setShowLandmarksPoints();
buttonShowNottinghamPoints.onclick = () => appController.setShowNottinghamPoints();
buttonStart.onclick = () => appController.start();



const faceMesh = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});
faceMesh.setOptions({
  maxNumFaces: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

faceMesh.onResults(results => appController.onResults(results));

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({image: videoElement});
  },
  width: 430,
  height: 430
});
camera.start();