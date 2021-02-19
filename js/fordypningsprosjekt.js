///////////////////
// HTML OBJECTS // 
/////////////////
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//////////////
// CLASSES //
////////////
class Game {
    constructor() {
        this.interval = 1000 / 60;
        this.g = 6.674e-3;
        this.celestialBodyArr = [];
        this.gameInterval;
    }
    update = () => {
        this.target = this.celestialBodyArr[document.getElementById("bodySelect").selectedIndex];
        if (this.target) {
            document.getElementById("targetMass").innerHTML = `Target Mass: ${this.target.mass}`;
            document.getElementById("targetRadius").innerHTML = `Target Radius: ${this.target.r.toFixed(2)}`;
            document.getElementById("targetPos").innerHTML = `x:${this.target.pos.x.toFixed(2)}, y: ${this.target.pos.y.toFixed(2)}`;
            document.getElementById("targetVelocity").innerHTML = `xv:${this.target.vel.x.toFixed(2)}, yv: ${this.target.vel.y.toFixed(2)}`;
        }
        this.celestialBodyArr.forEach(body => body.update());
    }
    draw = () => this.celestialBodyArr.forEach(body => body.draw());
    attract = () => this.celestialBodyArr.forEach(body => body.attract());
    drawVectors = () => this.celestialBodyArr.forEach(body => body.drawVector());
    drawOrbits = () => this.celestialBodyArr.forEach(body => body.drawOrbit());
    drawNames = () => this.celestialBodyArr.forEach(body => body.drawName());
    startInterval = () => {
        clearInterval(this.gameInterval);
        this.gameInterval = setInterval(() => {
            this.update();
            this.attract();
        }, this.interval);
    }
    pauseInterval = () => clearInterval(this.gameInterval);
    drawInterval = () => {
        setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.draw();
            if (document.getElementById("vectorCheck").checked) this.drawVectors();
            if (document.getElementById("orbitCheck").checked) this.drawOrbits();
            if (document.getElementById("nameCheck").checked) this.drawNames();
        }, this.interval);
    }
}
let game = new Game();
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add = v => typeof v == 'object' ? new Vector(this.x + v.x, this.y + v.y) : new Vector(this.x + v, this.y + v);
    sub = v => typeof v == 'object' ? new Vector(this.x - v.x, this.y - v.y) : new Vector(this.x - v, this.y - v);
    mul = v => typeof v == 'object' ? new Vector(this.x * v.x, this.y * v.y) : new Vector(this.x * v, this.y * v);
    div = v => typeof v == 'object' ? new Vector(this.x / v.x, this.y / v.y) : new Vector(this.x / v, this.y / v);
    mag = () => Math.sqrt(this.x * this.x + this.y * this.y);
    setMag = strength => {
        let currentMag = this.mag();
        this.x = this.x * strength / currentMag;
        this.y = this.y * strength / currentMag;
    }
}
class CelestialBody {
    constructor(x, y, m, vx, vy, n) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(vx, vy);
        this.acc = new Vector(0, 0);
        this.mass = m;
        this.r = this.mass / 5;
        this.trail = [];
        this.name = n;
    }
    attract = () => {
        game.celestialBodyArr.forEach(body => {
            if (body == this) return;
            let force = new Vector(this.pos.x, this.pos.y);
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
        this.acc = new Vector(0, 0);

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
    drawName = () => {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(this.name, this.pos.x + 20, this.pos.y - 20);
    }
}


////////////////
// FUNCTIONS //
//////////////
const createCelestialBody = (x, y, m, vx, vy, n) => {
    game.celestialBodyArr.push(new CelestialBody(x, y, m, vx, vy, n));
    document.getElementById("bodySelect").innerHTML = "";
    for (let i = 0; i < game.celestialBodyArr.length; i++) document.getElementById("bodySelect").innerHTML += `<option value="${i}">${game.celestialBodyArr[i].name}</option>`;
}
const setBody = () => {
    let x = document.getElementById("xInput").value;
    let y = document.getElementById("yInput").value;
    let m = document.getElementById("massInput").value;
    if (!m == "") game.target.mass = parseFloat(m);
    if (!x == "") game.target.pos.x = parseFloat(x);
    if (!y == "") game.target.pos.y = parseFloat(y);
    x.value = "";
    y.value = "";
    m.value = "";
}
const createBody = () => {
    createCelestialBody(parseFloat(document.getElementById("createX").value), parseFloat(document.getElementById("createY").value), parseFloat(document.getElementById("createM").value), parseFloat(document.getElementById("createVX").value), parseFloat(document.getElementById("createVY").value), document.getElementById("createName").value);
    document.getElementById("createX").value = "";
    document.getElementById("createY").value = "";
    document.getElementById("createM").value = "";
    document.getElementById("createVX").value = "";
    document.getElementById("createVY").value = "";
    document.getElementById("createName").value = "";
}
const deleteBody = () => {
    game.celestialBodyArr.splice(game.celestialBodyArr.indexOf(game.target), 1);
    document.getElementById("bodySelect").options.remove(document.getElementById("bodySelect").selectedIndex)
}
const startInterval = () => game.startInterval();
const pauseInterval = () => game.pauseInterval();
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


///////////////////
// DECLARATIONS //
/////////////////
writeHeader(document.getElementById("title").innerHTML, document.getElementById("title"));
createCelestialBody(canvas.width / 2 - 100, canvas.height / 2, 50, 0, -3, 'A');
createCelestialBody(canvas.width / 2 + 100, canvas.height / 2, 50, 0, 3, 'B');
createCelestialBody(canvas.width / 2, canvas.height / 2 + 100, 50, -3, 0, 'C');
createCelestialBody(canvas.width / 2, canvas.height / 2 - 100, 50, 3, 0, 'D');
game.startInterval();
game.drawInterval();


//////////////////////
// EVENT LISTENERS //
////////////////////