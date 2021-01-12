import Point from './point.js';

class Nottingham{
    constructor(){
        this.supraorbitalDir = [0, 0];
        this.supraorbitalEsq = [0, 0];
        this.infraorbitalDir = [0, 0];
        this.infraorbitalEsq = [0, 0];
        this.cantoLateralEsq = [0, 0];
        this.cantoLateralDir = [0, 0];
        this.comissuraLabialEsq = [0, 0];
        this.comissuraLabialDir = [0, 0];
    }

    calcSupraorbital( xEsq, yEsq, xDir, yDir ){
        var dirx = xEsq - xDir;
        var diry = yEsq - yDir;
        var x = parseInt(xEsq - dirx/2);
        var y = parseInt(yEsq - 5);
        return {x, y};
    }

    getPoints(){
        let radius = 1;
        let color = "#00f";
        return [
            new Point(this.supraorbitalDir[0], this.supraorbitalDir[1], radius, color),
            new Point(this.supraorbitalEsq[0], this.supraorbitalEsq[1], radius, color),
            new Point(this.infraorbitalDir[0], this.infraorbitalDir[1], radius, color),
            new Point(this.infraorbitalEsq[0], this.infraorbitalEsq[1], radius, color),
            new Point(this.cantoLateralEsq[0], this.cantoLateralEsq[1], radius, color),
            new Point(this.cantoLateralDir[0], this.cantoLateralDir[1], radius, color),
            new Point(this.comissuraLabialEsq[0], this.comissuraLabialEsq[1], radius, color),
            new Point(this.comissuraLabialDir[0], this.comissuraLabialDir[1], radius, color)
        ]
    }

    drawPoints(canvas){
        for (const point of this.getPoints()){
            point.draw(canvas);
        }
    }
}



export default Nottingham;