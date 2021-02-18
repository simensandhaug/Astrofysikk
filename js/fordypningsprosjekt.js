///////////////////
// HTML OBJECTS // 
/////////////////
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


///////////////////
// DECLARATIONS //
/////////////////


//////////////
// CLASSES //
////////////
class Game {
    constructor() {
        this.scale = 1;
        this.interval = 1000/60;
        this.g = 6.674e-2;
    }
    update = () => {
        this.scale = document.getElementById("scale").value;
        this.interval = 1000 / document.getElementById("time").value;
        this.target = celestialBodyArr[document.getElementById("bodySelect").selectedIndex];
        celestialBodyArr.forEach(body => body.attract());
        celestialBodyArr.forEach(body => body.update());
        celestialBodyArr.forEach(body => body.draw());
    }
    draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        celestialBodyArr.forEach(body => body.draw());
    }
    startInterval = () => {
        let gameInterval = setInterval(() => {
            this.update();
            this.draw();
        }, this.interval);
    }
}

let game = new Game();
game.startInterval()

class Vector {
    constructor(vec2) {
        this.x = vec2[0];
        this.y = vec2[1];
    }
    add = v => typeof v == 'object' ? new Vector([this.x + v.x, this.y + v.y]) : new Vector([this.x + v, this.y + v]);
    sub = v => typeof v == 'object' ? new Vector([this.x - v.x, this.y - v.y]) : new Vector([this.x - v, this.y - v]);
    mul = v => typeof v == 'object' ? new Vector([this.x * v.x, this.y * v.y]) : new Vector([this.x * v, this.y * v]);
    div = v => typeof v == 'object' ? new Vector([this.x / v.x, this.y / v.y]) : new Vector([this.x / v, this.y / v]);
    mag = () => Math.sqrt(this.x * this.x + this.y * this.y);
    setMag = strength => {
        let currentMag = this.mag();
        this.x = this.x * strength / currentMag;
        this.y = this.y * strength / currentMag;
    }
}
class CelestialBody {
    constructor(x, y, m, vx, vy) {
        this.pos = new Vector([x, y]);
        this.vel = new Vector([vx, vy]);
        this.acc = new Vector([0, 0]);
        this.mass = m;
        this.r = Math.sqrt(this.mass) * game.scale;
    }
    attract = () => {
        celestialBodyArr.forEach(body => {
            if(body == this) return;
            let force = new Vector([this.pos.x, this.pos.y]);
            force = force.sub(body.pos);
            let dSq = Math.sqrt(force.mag());
            let strength = game.g * (this.mass * body.mass) / dSq;
            force.setMag(strength);
            body.applyForce(force);
        });
    }
    applyForce = force => {
        let f = force.div(this.mass)
        this.acc = this.acc.add(f);
    }
    update = () => {
        this.pos = this.pos.add(this.vel);
        this.vel = this.vel.add(this.acc);

        this.acc = new Vector([0, 0])
    }
    draw = () => {
        ctx.fillStyle = this == game.target ? 'red' : 'white';
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r * game.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}

let celestialBodyArr = [];
const createCelestialBody = (x, y, m, vx, vy) => celestialBodyArr.push(new CelestialBody(x, y, m, vx, vy));
createCelestialBody(canvas.width / 2, canvas.height / 2, 100, -2, -2);
createCelestialBody(canvas.width / 2, canvas.height / 2 + 300, 100, 2, 2);
createCelestialBody(canvas.width / 2, canvas.height / 2 - 300, 100, 2, 2);


//////////////////////
// SIMULATION CODE //
////////////////////