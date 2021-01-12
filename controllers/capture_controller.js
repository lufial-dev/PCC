import Capture from '../models/capture.js';
class CaptureController{
    constructor({face, textInstruction, texts, faces, buttonStart, divResults}){
        this.captures = [];
        this.face = face;
        this.textInstruction = textInstruction;
        this.texts = texts;
        this.faces = faces;
        this.buttonStart = buttonStart;
        this.isCaptured = false;
        this.divResults = divResults;
    }

    startCapture(canvas) {
        if(this.faces.length > 1){
            if(this.textInstruction.innerHTML==this.texts[0] && this.isStop()){
                this.textInstruction.innerHTML = this.texts[1];
                var image =canvas.toDataURL("image/png");
                this.divResults.innerHTML = (
                    "<div class='image'><p>Repouso</p>"+
                    "<img src='"+image+"' alt='from canvas' width=100px/></div>"
                );
                this.captures.push(new Capture({image:image , face: this.face}));
            }
            else if(this.textInstruction.innerHTML == this.texts[1]  && this.isEyebrown() && this.isStop()){
                this.textInstruction.innerHTML = this.texts[2];
                var image =canvas.toDataURL("image/png");
                this.divResults.innerHTML = (
                    this.divResults.innerHTML +
                    "<div class='image'><p>Sobramcelhas erguidas</p>"+
                    "<img src='"+image+"' alt='from canvas' width=100px/></div>"
                );
                this.captures.push(new Capture({image:image , face: this.face}));
            }
            else if(this.textInstruction.innerHTML == this.texts[2]  && this.isPressEyes() && this.isStop()){
                this.textInstruction.innerHTML = this.texts[3];
                var image =canvas.toDataURL("image/png");
                this.divResults.innerHTML = (
                    this.divResults.innerHTML +
                    "<div class='image'><p>Precionando olhos</p>"+
                    "<img src='"+image+"' alt='from canvas' width=100px/></div>"
                );
                this.captures.push(new Capture({image:image , face: this.face}));
            }
            else if(this.textInstruction.innerHTML == this.texts[3]  && this.isSmile() && this.isStop()){
                this.textInstruction.innerHTML = "CAPTURA CONCLUIDA";
                var image =canvas.toDataURL("image/png");
                this.divResults.innerHTML = (
                    this.divResults.innerHTML +
                    "<div class='image'><p>Sorrindo</p>"+
                    "<img src='"+image+"' alt='from canvas' width=100px/></div>"
                );
                this.captures.push(new Capture({image:image , face: this.face}));
                this.isCaptured = false;
            }

        }
        

    }


    isSmile(){
            var disSmileCapture = this.convertToPositive(this.captures[0].face.nottingham.comissuraLabialDir[0] - this.captures[0].face.nottingham.comissuraLabialEsq[0]);
            var disSmileFace = this.convertToPositive(this.face.nottingham.comissuraLabialDir[0] - this.face.nottingham.comissuraLabialEsq[0]);
            console.log(this.convertToPositive(disSmileCapture - disSmileFace));
            if (this.convertToPositive(disSmileCapture - disSmileFace) > 8)
                return true
            return false
    }

    isPressEyes(){
        const disDirCapture = this.captures[0].face.nottingham.infraorbitalDir[1] - this.captures[0].face.nottingham.supraorbitalDir[1];
        const disEsqCapture = this.captures[0].face.nottingham.infraorbitalEsq[1] - this.captures[0].face.nottingham.supraorbitalEsq[1] ;
        const disDirFace = this.face.nottingham.infraorbitalDir[1] - this.face.nottingham.supraorbitalDir[1];
        const disEsqFace = this.face.nottingham.infraorbitalEsq[1] - this.face.nottingham.supraorbitalEsq[1] ;

        const disDirFaceLC = this.calcDistancia(this.face.nottingham.comissuraLabialDir, this.face.nottingham.supraorbitalDir, 300);
        const disEsqFaceLC = this.calcDistancia(this.face.nottingham.comissuraLabialEsq, this.face.nottingham.supraorbitalEsq, 300);

        console.log(disDirFaceLC);
        console.log(disEsqFaceLC);

        if(
            (this.convertToPositive(disEsqFaceLC) < 5 || this.convertToPositive(disDirFaceLC) < 5) &&
            (this.convertToPositive(disDirFace - disDirCapture)>8 || this.convertToPositive(disEsqFace - disEsqCapture)>8)
        )
            return true
        return false
    }

    

    isEyebrown(){
        const disDirCapture = this.captures[0].face.nottingham.infraorbitalDir[1] - this.captures[0].face.nottingham.supraorbitalDir[1];
        const disEsqCapture = this.captures[0].face.nottingham.infraorbitalEsq[1] - this.captures[0].face.nottingham.supraorbitalEsq[1] ;
        const disDirFace = this.face.nottingham.infraorbitalDir[1] - this.face.nottingham.supraorbitalDir[1];
        const disEsqFace = this.face.nottingham.infraorbitalEsq[1] - this.face.nottingham.supraorbitalEsq[1] ;

        const disDirFaceLC = this.calcDistancia(this.face.nottingham.cantoLateralDir, this.face.nottingham.supraorbitalDir, 300);
        const disEsqFaceLC = this.calcDistancia(this.face.nottingham.cantoLateralEsq, this.face.nottingham.supraorbitalEsq, 300);
        

        if(
            (this.convertToPositive(disEsqFaceLC) < 6.5 || this.convertToPositive(disDirFaceLC) < 6.5) &&
            (this.convertToPositive(disDirFace - disDirCapture)>8 || this.convertToPositive(disEsqFace - disEsqCapture)>8)
        )
            return true
        return false

    }

    convertToPositive(number){
        if (number < 0)
            return number * -1
        return number

    }

    isStop(){
        const distancias = []
        
        distancias[0] = this.calcDistancia(this.faces[0].nottingham.supraorbitalEsq, this.faces[1].nottingham.supraorbitalEsq, 10);
        distancias[1] = this.calcDistancia(this.faces[0].nottingham.supraorbitalDir, this.faces[1].nottingham.supraorbitalDir, 10);
        distancias[2] = this.calcDistancia(this.faces[0].nottingham.infraorbitalDir, this.faces[1].nottingham.infraorbitalDir, 10);
        distancias[3] = this.calcDistancia(this.faces[0].nottingham.infraorbitalEsq, this.faces[1].nottingham.infraorbitalEsq, 10);
        distancias[4] = this.calcDistancia(this.faces[0].nottingham.cantoLateralEsq, this.faces[1].nottingham.cantoLateralEsq, 10);
        distancias[5] = this.calcDistancia(this.faces[0].nottingham.cantoLateralDir, this.faces[1].nottingham.cantoLateralDir, 10);
        distancias[6] = this.calcDistancia(this.faces[0].nottingham.comissuraLabialEsq, this.faces[1].nottingham.comissuraLabialEsq, 10);
        distancias[7] = this.calcDistancia(this.faces[0].nottingham.comissuraLabialDir, this.faces[1].nottingham.comissuraLabialDir, 10);
        const soma = this.soma(distancias);
        if (soma<10)
            return true
        return false
        
    }
 
    soma(distancias){
        let soma = 0;
        for(const d of distancias)
            soma+=d;
        return soma;
    }



    calcDistancia( val1, val2, control){
        const soma = this.convertToPositive(val1[0] - val2[0])^2 + (val1[1] - val2[1])^2;
        let distancia = 0;
        
        if (parseInt(soma) == 0){
            distancia = 0;
        }else{
            distancia = Math.sqrt(parseInt(soma));
            if(Number.isNaN(distancia))
                distancia = control
        }
        return distancia;

    }

    captureRest(){

    }
}

export default CaptureController;