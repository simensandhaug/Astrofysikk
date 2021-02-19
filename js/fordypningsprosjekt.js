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
        this.interval = 1000 / 60;
        this.g = 6.674e-3;
    }
    update = () => {
        this.target = celestialBodyArr[document.getElementById("bodySelect").selectedIndex];
        document.getElementById("targetMass").innerHTML = `Target Mass: ${this.target.mass}`;
        document.getElementById("targetRadius").innerHTML = `Target Radius: ${this.target.r.toFixed(2)}`;
        document.getElementById("targetPos").innerHTML = `x:${this.target.pos.x.toFixed(2)}, y: ${this.target.pos.y.toFixed(2)}`;
        document.getElementById("targetVelocity").innerHTML = `xv:${this.target.vel.x.toFixed(2)}, yv: ${this.target.vel.y.toFixed(2)}`;
        celestialBodyArr.forEach(body => body.update());
    }
    draw = () => celestialBodyArr.forEach(body => body.draw());
    attract = () => celestialBodyArr.forEach(body => body.attract());
    drawVectors = () => celestialBodyArr.forEach(body => body.drawVector());
    drawOrbits = () => celestialBodyArr.forEach(body => body.drawOrbit());
    startInterval = () => {
        setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.update();
            this.draw();
            this.attract();
            if (document.getElementById("vectorCheck").checked) this.drawVectors();
            if (document.getElementById("orbitCheck").checked) this.drawOrbits();
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
        this.r = this.mass / 5;
        this.trail = [];
    }
    attract = () => {
        celestialBodyArr.forEach(body => {
            if (body == this) return;
            let force = new Vector([this.pos.x, this.pos.y]);
            force = force.sub(body.pos);
            let dSq = Math.sqrt(force.mag());
            let strength = game.g * (this.mass * body.mass) / dSq;
            force.setMag(strength);
            body.applyForce(force);
        });
    }
    applyForce = force => {
        this.acc = this.acc.add(force.div(this.mass));
    }
    update = () => {
        this.pos = this.pos.add(this.vel);
        this.vel = this.vel.add(this.acc);
        this.acc = new Vector([0, 0]);

        this.trail.push(this.pos);
        if (this.trail.length > 250) this.trail.shift();
    }
    draw = () => {
        ctx.fillStyle = this == game.target ? 'red' : 'white';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    drawVector = () => {
        ctx.strokeStyle = this == game.target ? 'red' : 'white';
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x + this.vel.x * 10, this.pos.y + this.vel.y * 10);
        ctx.stroke();
        ctx.closePath();
    }
    drawOrbit = () => {
        ctx.fillStyle = 'blue';
        for (let i = 0; i < this.trail.length; i++) {
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }
}

const setMass = () => game.target.mass = document.getElementById("massInput").value;
const setRadius = () => game.target.r = document.getElementById("radiusInput").value;

let celestialBodyArr = [];
const createCelestialBody = (x, y, m, vx, vy) => celestialBodyArr.push(new CelestialBody(x, y, m, vx, vy));
createCelestialBody(canvas.width / 2 - 100, canvas.height / 2, 50, 3, -3);
createCelestialBody(canvas.width / 2 + 100, canvas.height / 2, 50, -3, 3);
createCelestialBody(canvas.width / 2, canvas.height / 2 + 100, 50, -3, 3);
createCelestialBody(canvas.width / 2, canvas.height / 2 - 100, 50, 3, -3);

createCelestialBody(canvas.width / 2, canvas.height / 2, 100, 0, 0);
for (let i = 0; i < celestialBodyArr.length; i++) document.getElementById("bodySelect").innerHTML += `<option value="${i}">CelestialBodyArr[${i}]</option>`;

const writeHeader = (header, output) => {
    document.getElementById("title").innerHTML = "";
    let i = 0;
    setInterval(() => {
        if (i < header.length) output.innerHTML += header.charAt(i);
        else {
            if (i % 2 == 0) output.innerHTML += "_";
            else output.innerHTML = output.innerHTML.replace("_", "");
        }
        i++
    }, 300);
}
writeHeader(document.getElementById("title").innerHTML, document.getElementById("title"));