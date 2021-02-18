///////////////////
// HTML OBJECTS // 
/////////////////
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


//////////////
// CLASSES //
////////////
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add = v => typeof v == 'object' ? [this.x + v.x, this.y + v.y] : [this.x + v, this.y + v];
    sub = v => typeof v == 'object' ? [this.x - v.x, this.y - v.y] : [this.x - v, this.y - v];
    mul = v => typeof v == 'object' ? [this.x * v.x, this.y * v.y] : [this.x * v, this.y * v];
    div = v => typeof v == 'object' ? [this.x / v.x, this.y / v.y] : [this.x / v, this.y / v];
}
class CelestialBody {
    constructor(x, y, m) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.mass = m;
        this.r = Math.sqrt(this.mass) * 10;
    }

    applyForce = force => this.acc.add(force.div(this.mass));

    update = () => {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
    }

    draw = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = 'grey';
        ctx.strokeStyle = 'White';
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}


///////////////////
// DECLARATIONS //
/////////////////
let celestialBodyArr = [];
const createCelestialBody = (x, y, m) => celestialBodyArr.push(new CelestialBody(x, y, m));
createCelestialBody(canvas.width / 2, canvas.height / 2, 100);

celestialBodyArr[0].draw()


//////////////////////
// SIMULATION CODE //
////////////////////