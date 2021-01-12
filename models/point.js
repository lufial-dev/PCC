class Point{
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(canvas){
        canvas.beginPath();
        canvas.moveTo(this.x, this.y);
        canvas.fillStyle = 'red';
        canvas.arc(this.x, this.y, this.radius, 1, 2.5 * Math.PI, false);
        canvas.lineWidth = 5;
        canvas.strokeStyle = this.color;
        canvas.stroke();
    }
}

export default Point;