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
        this.speed = 10;
        this.deltaTime;
        this.isPaused = true;
        this.g = 6.67408e-11;
        this.celestialBodyArr = [];
        this.gameInterval;
        this.drawingInterval;
        this.drawOnlyTarget;
        this.mouseX = 0;
        this.mouseY = 0;
        this.holdInterval;
        this.xOffset = 0;
        this.yOffset = 0;
        this.isMousePressed = false;
        this.xPrevious;
        this.yPrevious;
        this.scale = 10 / 70e8;
        this.radiusScale = 1000000;
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
    drawVectors = () => this.celestialBodyArr.forEach(body => body.drawVector());
    drawOrbits = () => this.celestialBodyArr.forEach(body => body.drawOrbit());
    drawNames = () => this.celestialBodyArr.forEach(body => body.drawName());
    changeSpeed = () => {
        this.speed = parseFloat(document.getElementById("time").value);
    }
    pauseInterval = () =>{
        this.isPaused = true;
    }
    startInterval = () =>{
        this.isPaused = false;
    }
    drawInterval = () => {
        clearInterval(this.drawingInterval);
        this.drawingInterval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.draw();
            if (document.getElementById("vectorCheck").checked) this.drawVectors();
            if (document.getElementById("orbitCheck").checked) this.drawOrbits();
            if (document.getElementById("nameCheck").checked) this.drawNames();
            this.drawOnlyTarget = document.getElementById("onlyTargetCheck").checked;
        }, this.interval);
    }
}
let game = new Game();
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add = v => new Vector(this.x + v.x, this.y + v.y);
    sub = v => new Vector(this.x - v.x, this.y - v.y);
    mul = v => new Vector(this.x * v, this.y * v);
    div = v => new Vector(this.x / v, this.y / v);
    mag = () => Math.sqrt(this.x * this.x + this.y * this.y);
    setMag = strength => {
        let currentMag = this.mag();
        this.x = this.x * strength / currentMag;
        this.y = this.y * strength / currentMag;
    }
}
class CelestialBody {
    constructor(x, y, mass, radius, vx, vy, name, isImmovable, color) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(vx, vy);
        this.acc = new Vector(0, 0);
        this.mass = mass;
        this.r = radius;
        this.trail = [];
        this.name = name;
        this.held = false;
        this.isImmovable = isImmovable;
        this.color = color;
    }
    computeAcceleration = () => {
        let acc = new Vector(0, 0);
        if (this.isImmovable) return acc;
        game.celestialBodyArr.forEach(body => {
            if (body == this) return;
            let delta = body.pos.sub(this.pos);

            let strength = game.g * this.mass * body.mass / Math.pow(delta.mag(), 2);

            delta.setMag(strength/this.mass);
            acc = acc.add(delta);
        });

        return acc;
    }

    update = () => {
        this.acc = this.computeAcceleration();
        this.vel = this.vel.add(this.acc.mul(game.speed * game.deltaTime));
        this.pos = this.pos.add(this.vel.mul(game.speed * game.deltaTime));

        this.trail.push(this.pos);
        if (this.trail.length > 250) this.trail.shift();
    }
    draw = () => {
        ctx.fillStyle = this == game.target ? 'red' : this.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(this.pos.x * game.scale + game.xOffset + canvas.width / 2, canvas.height / 2 - (this.pos.y * game.scale) + game.yOffset, this.r * game.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    drawVector = () => {
        ctx.strokeStyle = this == game.target ? 'red' : 'white';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        if (game.drawOnlyTarget && game.target == this) {
            ctx.moveTo(canvas.width / 2 + this.pos.x * game.scale + game.xOffset, canvas.height / 2 - (this.pos.y * game.scale) + game.yOffset);
            ctx.lineTo(canvas.width / 2 + this.pos.x * game.scale + game.radiusScale*this.vel.x * game.scale + game.xOffset, canvas.height / 2 - (this.pos.y * game.scale) - game.radiusScale* this.vel.y * game.scale + game.yOffset);
            ctx.stroke();
        }
        if (!game.drawOnlyTarget) {
            ctx.moveTo(canvas.width / 2 + this.pos.x * game.scale + game.xOffset, canvas.height / 2 - (this.pos.y * game.scale) + game.yOffset);
            ctx.lineTo(canvas.width / 2 + this.pos.x * game.scale + game.radiusScale*this.vel.x * game.scale + game.xOffset, canvas.height / 2 - (this.pos.y * game.scale) - game.radiusScale*this.vel.y * game.scale + game.yOffset);
            ctx.stroke();
        }
        ctx.closePath();
    }
    drawOrbit = () => {
        if (!this.isImmovable) {
            ctx.strokeStyle = 'blue';
            if (game.drawOnlyTarget && game.target == this) {
                for (let i = 1; i < this.trail.length; i++) {
                    ctx.beginPath();
                    ctx.moveTo(canvas.width / 2 + this.trail[i - 1].x * game.scale + game.xOffset, canvas.height / 2 - (this.trail[i - 1].y * game.scale) + game.yOffset);
                    ctx.lineTo(canvas.width / 2 + this.trail[i].x * game.scale + game.xOffset, canvas.height / 2 - (this.trail[i].y * game.scale) + game.yOffset);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
            if (!game.drawOnlyTarget) {
                for (let i = 1; i < this.trail.length; i++) {
                    ctx.beginPath();
                    ctx.moveTo(canvas.width / 2 + this.trail[i - 1].x * game.scale + game.xOffset, canvas.height / 2 - (this.trail[i - 1].y * game.scale) + game.yOffset);
                    ctx.lineTo(canvas.width / 2 + this.trail[i].x * game.scale + game.xOffset, canvas.height / 2 - (this.trail[i].y * game.scale) + game.yOffset);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }
    drawName = () => {
        ctx.fillStyle = 'white';
        const fontSize = 1 * game.scale * 70e8;
        ctx.font = fontSize + "px Arial";
        if(game.drawOnlyTarget && game.target != this) return;
        ctx.fillText(this.name, canvas.width / 2 + this.pos.x * game.scale + this.r*game.scale + 5 + game.xOffset, canvas.height / 2 - (this.pos.y * game.scale) - this.r*game.scale - 5 + game.yOffset);
    }
}


////////////////
// FUNCTIONS //
//////////////
const createCelestialBody = (x, y, m, r, vx, vy, n, isImmovable, color) => {
    game.celestialBodyArr.push(new CelestialBody(x, y, m, r, vx, vy, n, isImmovable, color));
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
    document.getElementById("xInput").value = "";
    document.getElementById("yInput").value = "";
    document.getElementById("massInput").value = "";
}
const createBody = () => {
    createCelestialBody(parseFloat(document.getElementById("createX").value), parseFloat(document.getElementById("createY").value), parseFloat(document.getElementById("createM").value), parseFloat(document.getElementById("createVX").value), parseFloat(document.getElementById("createVY").value), document.getElementById("createName").value, document.getElementById("createisImmovable").checked, document.getElementById("createColor").value);
    document.getElementById("createX").value = "";
    document.getElementById("createY").value = "";
    document.getElementById("createM").value = "";
    document.getElementById("createVX").value = "";
    document.getElementById("createVY").value = "";
    document.getElementById("createName").value = "";
    document.getElementById("createisImmovable").checked = false;
    document.getElementById("createColor").value = "";
}
const deleteBody = () => {
    game.celestialBodyArr.splice(game.celestialBodyArr.indexOf(game.target), 1);
    document.getElementById("bodySelect").options.remove(document.getElementById("bodySelect").selectedIndex)
}
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

const aphelionDist = 152.10e9; //meter
const aphelionSpeed = 29290; //m/s
const earthMass = 5.972e24; //kg
const earthRadius = 6.371e3 * game.radiusScale; //meter
const sunRadius = 50e3 * game.radiusScale; //meter
const sunMass = 1.9891e30; //kg
const moonDistanceToEarth = 3844e5;
const moonMass = 7.35e22; //kg
const moonRadius = earthRadius / 7; //meter
const moonRelativeSpeed = 970; //m/s
///////////////////
// DECLARATIONS //
/////////////////
writeHeader(document.getElementById("title").innerHTML, document.getElementById("title"));
//createCelestialBody(aphelionDist, 0, earthMass, earthRadius, 0, aphelionSpeed, 'A', false, 'white');
//createCelestialBody(-aphelionDist, 0, earthMass, earthRadius, 0, -aphelionSpeed, 'C', false, 'white');
//createCelestialBody(0, aphelionDist, earthMass, earthRadius, -aphelionSpeed, 0, 'C', false, 'white');
createCelestialBody(0, -aphelionDist, earthMass, earthRadius, aphelionSpeed, 0, 'Jorda', false, 'lime');
createCelestialBody(0, -aphelionDist - moonDistanceToEarth, moonMass, moonRadius, moonRelativeSpeed + aphelionSpeed, 0, 'Månen', false, 'grey');
createCelestialBody(0, 0, sunMass, sunRadius, 0, 0, 'Sola', false, 'yellow');
game.drawInterval();


//////////////////////
// EVENT LISTENERS //
////////////////////

canvas.addEventListener("mousemove", e => {
    if (game.isMousePressed) {
        game.xOffset += e.clientX - game.xPrevious;
        game.yOffset += e.clientY - game.yPrevious;

        game.xPrevious = e.clientX;
        game.yPrevious = e.clientY;
    } else {
        game.mouseX = e.clientX - game.xOffset;
        game.mouseY = e.clientY - game.yOffset;


        canvas.style.cursor = "auto";
        game.celestialBodyArr.forEach(body => {
            if (Math.sqrt(Math.pow(body.pos.x * game.scale - game.mouseX, 2) + Math.pow(body.pos.y * game.scale - game.mouseY, 2)) < body.r * game.scale) {
                canvas.style.cursor = "pointer";
            }

            if (body.held) {
                body.pos.x = game.mouseX/game.scale;
                body.pos.y = game.mouseY/game.scale;
            }
        });
    }
});

canvas.addEventListener("mousedown", e => {
    //updating coordinates of last pressed location
    game.isMousePressed = true;
    game.xPrevious = e.clientX;
    game.yPrevious = e.clientY;


    game.celestialBodyArr.forEach(body => {
        if (Math.sqrt(Math.pow(body.pos.x * game.scale - game.mouseX, 2) + Math.pow(body.pos.y * game.scale - game.mouseY, 2)) < body.r * game.scale) {
            //quickfix for at man ikke skal kunne dra canvas når man drar en planet
            game.isMousePressed = false;
            game.target = body;
            body.held = true;
        }
    });
});

canvas.addEventListener("mouseup", () => {
    game.isMousePressed = false;
    game.celestialBodyArr.forEach(body => body.held = false);
    clearInterval(game.holdInterval);
});

canvas.addEventListener("wheel", e => {
    game.scale -= e.deltaY * game.scale/100;
    if(game.scale < 0) game.scale = 0;
})


let prevTime = 0;
function loop(time = 0){
    game.deltaTime = time - prevTime;
    prevTime = time;
    if(!game.isPaused) game.update();
    requestAnimationFrame(loop);
}
loop();