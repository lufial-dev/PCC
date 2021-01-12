import Face from '../models/face.js';
import CaptureController from './capture_controller.js';

class AppController{
    constructor({canvas, canvasElement, textInstruction, buttonShowLandmarksPoints, buttonShowNottinghamPoints, buttonStart, divResults}){
        this.canvasCtx = canvas;
        this.canvasElement = canvasElement;
        this.width = canvasElement.width;
        this.height = canvasElement.height;
        this.textInstruction = textInstruction;
        this.isShowNottinghamPoints = false;
        this.isShowLandmarksPoints = false;
        this.buttonShowLandmarksPoints = buttonShowLandmarksPoints,
        this.buttonShowNottinghamPoints = buttonShowNottinghamPoints,
        this.isShowCenterFace = false;
        this.divResults = divResults,
        this.face = new Face();
        this.position = 0;
        this.faces = [];
        this.isCenterFace = false;
        this.texts = [
            "CENTRALIZE SEU ROSTO E FIQUE EM POSIÇÃO DE REPOUSO",
            "LEVANTE AS SOMBRANCELHAS",
            "PRECIONE OS OLHOS COM FORÇA",
            "SORRIA"
        ];
        this.captureController = new CaptureController({face : this.face, textInstruction : this.textInstruction, texts : this.texts, faces : this.faces, buttonStart : buttonStart, divResults : divResults});
        

    }   

    flip(){
        this.canvasCtx.translate(this.canvasElement.width, 0);
        this.canvasCtx.scale(-1, 1);
    }

    start(){
        this.divResults.innerHTML = "";
        this.captureController.captures = [];
        this.textInstruction.innerHTML = this.texts[0];
        this.captureController.isCaptured = true;
        this.isShowCenterFace = true;
    }

    setShowLandmarksPoints(){
        this.isShowLandmarksPoints = !this.isShowLandmarksPoints;
        if(this.isShowLandmarksPoints)
          this.buttonShowLandmarksPoints.innerHTML = "Ocultar Pontos Faciais"
        else
          this.buttonShowLandmarksPoints.innerHTML = "Mostrar Pontos Faciais"
    }

    setShowNottinghamPoints(){
        this.isShowNottinghamPoints = !this.isShowNottinghamPoints; 
        if(this.isShowNottinghamPoints)
          this.buttonShowNottinghamPoints.innerHTML = "Ocultar Pontos de Nottingham";
        else
          this.buttonShowNottinghamPoints.innerHTML = "Mostrar Pontos de Nottingham";
    }

    
    onResults(results) {

        this.canvasCtx.save();
        this.flip();

        this.canvasCtx.clearRect(0, 0, this.C, this.canvasElement.height);
        this.canvasCtx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);

        if (results.multiFaceLandmarks) {
        
            this.face = new Face(); 
            for (const landmarks of results.multiFaceLandmarks) {
                
                this.face.setLandmarks(landmarks, this.width, this.height);   
                this.showCenterFace(results.image);            
                this.showLandmarksPoints(this.face.landmarks);
                this.getNottinghamPositions(this.face);
                this.showNottinghamPoints(this.face);  
                
            }
            this.captureController.face = this.face;
            this.addFace();   
            if(this.captureController.isCaptured)
                this.captureController.startCapture(results.image);
            
            
            this.canvasCtx.restore();
        }
        
    }

    addFace(){
        if(this.position == 10)
            this.faces[0] = this.face;
        if(this.position == 40){
            this.faces[1] = this.face;
            this.position = 0;
        }
        this.position += 1;
    }

    showLandmarksPoints(landmarks){
        if(this.isShowLandmarksPoints)
            for(const land of landmarks){
                land.point.draw(this.canvasCtx);
            }
    }

    showCenterFace(canvas){
        if(this.isShowCenterFace){
            if(this.isCenterFace)
                this.canvasCtx.fillStyle = 'rgba(0,120,0,0.5)';
            else
                this.canvasCtx.fillStyle = 'rgba(0,0,120,0.5)';
                this.canvasCtx.scale(1,1);
                this.canvasCtx.fillRect(0,0, this.canvasElement.width, this.canvasElement.height);
                this.canvasCtx.ellipse(this.canvasElement.width / 2, this.canvasElement.height / 2, 230, 300, 0, 0, Math.PI*2);
                //this.canvasCtx.arc(this.canvasElement.width / 2, this.canvasElement.height / 2, 300, 0, Math.PI * 2, true);
                this.canvasCtx.clip();
                this.canvasCtx.scale(1,1);
                this.canvasCtx.drawImage(canvas, 0, 0, this.canvasElement.width, this.canvasElement.height);
        
            
        }
    }

    showNottinghamPoints(face){
        if(this.isShowNottinghamPoints)
            face.nottingham.drawPoints(this.canvasCtx);
    }

    getNottinghamPositions(face){
        var SupraorbitalDir = { 52: [0,0] , 65 : [0,0] };
        var SupraorbitalEsq = { 282: [0,0]  , 295: [0,0] };

        SupraorbitalDir[52][0] =  face.getXbyId(52);
        SupraorbitalDir[52][1] =  face.getYbyId(52);
        SupraorbitalDir[65][0] =  face.getXbyId(65);
        SupraorbitalDir[65][1] =  face.getYbyId(65);

        SupraorbitalEsq[282][0] =  face.getXbyId(282);
        SupraorbitalEsq[282][1] =  face.getYbyId(282);
        SupraorbitalEsq[295][0] =  face.getXbyId(295);
        SupraorbitalEsq[295][1] =  face.getYbyId(295);

        var {x, y} = face.nottingham.calcSupraorbital(
            SupraorbitalDir[52][0],
            SupraorbitalDir[52][1],
            SupraorbitalDir[65][0],
            SupraorbitalDir[65][1]
        );
        face.nottingham.supraorbitalDir[0] = x;
        face.nottingham.supraorbitalDir[1] = y;

        var {x, y} = face.nottingham.calcSupraorbital(
            SupraorbitalEsq[282][0],
            SupraorbitalEsq[282][1],
            SupraorbitalEsq[295][0],
            SupraorbitalEsq[295][1]
        );

        face.nottingham.supraorbitalEsq[0] = x;
        face.nottingham.supraorbitalEsq[1] = y;

        face.nottingham.infraorbitalDir[0] =  face.getXbyId(119);
        face.nottingham.infraorbitalDir[1] =  face.getYbyId(119);

        face.nottingham.infraorbitalEsq[0] =  face.getXbyId(348);
        face.nottingham.infraorbitalEsq[1] =  face.getYbyId(348);

        face.nottingham.cantoLateralDir[0] =  face.getXbyId(33);
        face.nottingham.cantoLateralDir[1] =  face.getYbyId(33);

        face.nottingham.cantoLateralEsq[0] =  face.getXbyId(263);
        face.nottingham.cantoLateralEsq[1] =  face.getYbyId(263);

        face.nottingham.comissuraLabialDir[0] =  face.getXbyId(61);
        face.nottingham.comissuraLabialDir[1] =  face.getYbyId(61);

        face.nottingham.comissuraLabialEsq[0] =  face.getXbyId(291);
        face.nottingham.comissuraLabialEsq[1] =  face.getYbyId(291);
    }

    
}

export default AppController;


/*
            //drawConnectors(this.canvasCtx, landmarks, FACEMESH_TESSELATION, {color: '#00f', lineWidth: 1});
            //drawConnectors(this.canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'});
            //drawConnectors(this.canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {color: '#fff'});
            //drawConnectors(this.canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: '#30FF30'});
            //drawConnectors(this.canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {color: '#fff'});
            //drawConnectors(this.canvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
            //drawConnectors(this.canvasCtx, landmarks, FACEMESH_LIPS, {color: '#E0E0E0'});
            */