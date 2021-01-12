import Point from './point.js';

class Landmark{
    constructor(number, x, y){
        this.number = number;
        this.x = x;
        this.y = y;
        this.point = new Point(x, y, 1, "#ff0000");
    }
}

export default Landmark;