//////////////////////////
///// HTML ELEMENTS /////
////////////////////////
const canvas = document.getElementById("asteroidsCanvas");
const ctx = canvas.getContext("2d");
const timeEl = document.getElementById("time");
const endScreenEl = document.getElementById("asteroidsEndScreen");
const endTimeEl = document.getElementById("endTime");
const endButton = document.getElementById("asteroidsEndButton");



//////////////////////
///// INTERVALS /////
////////////////////
let update;
let createAsteroids;
let asteroidSpawnSpeed;
let gameTime;



//////////////////////
///// VARIABLES /////
////////////////////
let time;
let asteroids = new Array; //Array med alle asteroidene på skjermen og som trengs å oppdateres
let asteroidInterval = 3000; //ms
let spaceship = { //Alle variabler som omhandler spaceshippet
    xPos: canvas.width / 2,
    yPos: canvas.height / 2,
    size: 15,
    rotation: 270,
    dx: 0,
    dy: 0,
    up: false,
    left: false,
    right: false,
}



////////////////////
///// CLASSES /////
//////////////////
class Asteroid { //Sier seg selv
    constructor(size, dx, dy, x, y) { //Størrelse, endring i x, endring i y, x posisjon, y posisjon
        this.size = size;
        this.dx = dx;
        this.dy = dy;
        this.xPos = x;
        this.yPos = y;
        this.numberOfVertices = 5;
    }

    draw() {
        this.vertices = [];
        for (var i = 1; i <= this.numberOfVertices; i += 1) this.vertices.push([this.xPos + this.size * Math.cos(i * 2 * Math.PI / this.numberOfVertices), this.yPos + this.size * Math.sin(i * 2 * Math.PI / this.numberOfVertices)]);
        ctx.beginPath();
        ctx.moveTo(this.vertices[0][0], this.vertices[0][1]);
        for(let i = 0; i<this.vertices.length - 1; i++) ctx.lineTo(this.vertices[i+1][0], this.vertices[i+1][1]);
        ctx.lineTo(this.vertices[0][0], this.vertices[0][1]);
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'grey';
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
}



//////////////////////
///// FUNCTIONS /////
////////////////////
const toRadians = a => a * Math.PI / 180;

const drawPolygon = (centerX, centerY, size, rotationDegrees, sides, fillcolor) => { //Funksjon som tegner polygoner med respekt til rotasjon av objektet
    var radians = rotationDegrees * Math.PI / 180;
    ctx.translate(centerX, centerY);
    ctx.rotate(radians);
    ctx.beginPath();
    ctx.moveTo(size * Math.cos(0), size * Math.sin(0));
    for (var i = 1; i <= sides; i += 1) ctx.lineTo(size * Math.cos(i * 2 * Math.PI / sides), size * Math.sin(i * 2 * Math.PI / sides));
    ctx.closePath();
    ctx.fillStyle = fillcolor;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
    ctx.rotate(-radians);
    ctx.translate(-centerX, -centerY);
}

const gameOver = time => { //Når spillet er over
    endScreenEl.style.visibility = "visible";
    endTimeEl.innerHTML = `Du overlevde i: ${time} sekunder`;
    clearInterval(update);
    clearInterval(createAsteroids);
    clearInterval(asteroidSpawnSpeed);
    clearInterval(gameTime);
    asteroidInterval = 3000;
    asteroids = new Array;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPolygon(spaceship.xPos, spaceship.yPos, spaceship.size, spaceship.rotation);
}
const startGame = () => { //Starter spillet

    spaceship = {
        xPos: canvas.width / 2,
        yPos: canvas.height / 2,
        size: 15,
        rotation: 270,
        directionX: Math.cos(toRadians(270)),
        directionY: Math.sin(toRadians(270)),
        dx: 0,
        dy: 0,
        aX: 0.5,
        aY: 0.5,
        up: false,
        left: false,
        right: false,
    }

    endScreenEl.style.visibility = "hidden";
    time = 0;
    update = setInterval(() => { //Updatefunksjonen som runner hele spillet

        //Clearer canvas og begynner å drawe
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (spaceship.left) spaceship.rotation += -3; //Roterer 2 grader venstre
        if (spaceship.right) spaceship.rotation += 3; //Roterer 2 grader høyre

        //Sørger for at gradene alltid er mellom 0-360
        if (spaceship.rotation > 360) spaceship.rotation = 0;
        if (spaceship.rotation < 0) spaceship.rotation = 360;

        //Spaceship direksjonsvektorupdate
        spaceship.directionX = Math.cos(toRadians(spaceship.rotation));
        spaceship.directionY = Math.sin(toRadians(spaceship.rotation));

        if (spaceship.up) {
            spaceship.aX = spaceship.directionX * 0.4;
            spaceship.aY = spaceship.directionY * 0.4;
        }
        else {
            spaceship.dx *= 0.98;
            spaceship.dy *= 0.98;
            spaceship.aY = 0;
            spaceship.aX = 0;
        }

        let magnitude = Math.sqrt(Math.pow(spaceship.dx, 2) + Math.pow(spaceship.dy, 2));
        if (magnitude > 5) {
            magnitude = 5;
            let angle = Math.atan2(spaceship.dy, spaceship.dx);
            spaceship.dx = Math.cos(angle) * magnitude;
            spaceship.dy = Math.sin(angle) * magnitude;
        } 

        //Oppdaterer fart
        spaceship.dx += spaceship.aX;
        spaceship.dy += spaceship.aY;

        //Oppdaterer posisjonen til spaceshipet
        spaceship.xPos += spaceship.dx;
        spaceship.yPos += spaceship.dy;

        //Sjekker om spaceshippet er utenfor canvas og setter den til riktig sted
        if (spaceship.xPos < 0) spaceship.xPos = canvas.width - spaceship.size;
        if (spaceship.xPos + spaceship.size > canvas.width) spaceship.xPos = 0;
        if (spaceship.yPos < 0) spaceship.yPos = canvas.height - spaceship.size;
        if (spaceship.yPos + spaceship.size > canvas.height) spaceship.yPos = 0;

        asteroids.forEach((asteroid, i) => { //Oppdaterer og tegner de individuelle asteroidene
            asteroid.xPos += asteroid.dx;
            asteroid.yPos += asteroid.dy;

            //Sjekker om spaceship collider med en av asteroidene
            if (spaceship.xPos >= asteroid.xPos - asteroid.size && spaceship.xPos <= asteroid.xPos + asteroid.size && spaceship.yPos >= asteroid.yPos - asteroid.size && spaceship.yPos <= asteroid.yPos + asteroid.size) gameOver(time);

            //Fjerner asteroiden dersom den er utafor canvas
            if (asteroid.xPos < 0 || asteroid.xPos > canvas.width || asteroid.yPos < 0 || asteroid.ypos > canvas.height) asteroids.splice(i, 1);

            asteroid.draw() //Tegner asteroidene
        });
        drawPolygon(spaceship.xPos, spaceship.yPos, spaceship.size, spaceship.rotation, 3, 'white'); //Tegner spaceshippet
    }, 20);

    createAsteroids = setInterval(() => { //Lager asteroider per tidsenhet
        let randomX = Math.random() < 0.5 ? 0 : canvas.width;
        let randomY = Math.floor(Math.random() * canvas.height);
        let randomSize = Math.floor(Math.random() * 60) + 30;
        let randomDx = randomX < 0.5 ? Math.random() : Math.random() * -1;
        let randomDy = Math.random();
        asteroids.push(new Asteroid(randomSize, randomDx, randomDy, randomX, randomY));
    }, asteroidInterval);

    asteroidSpawnSpeed = setInterval(() => { //Speeder sakte opp hvor fort asteroider blir dannet
        asteroidInterval -= 50;
    }, 10000);

    gameTime = setInterval(() => { //Teller tiden
        time++;
        timeEl.innerHTML = time;
    }, 1000);

    drawPolygon(spaceship.xPos, spaceship.yPos, spaceship.size, spaceship.rotation); //Tegner spaceshippet i starten
}



////////////////////////////
///// EVENT LISTENERS /////
//////////////////////////
endButton.addEventListener("click", startGame);
document.addEventListener("keydown", (e) => { //Sjekker for keydown
    switch (e.key) {
        case "ArrowUp":
            spaceship.up = true;
            break;
        case "ArrowLeft":
            spaceship.left = true;
            break;
        case "ArrowRight":
            spaceship.right = true;
            break;
    }
});
document.addEventListener("keyup", (e) => { //Sjekker for keyup
    switch (e.key) {
        case "ArrowUp":
            spaceship.up = false;
            break;
        case "ArrowLeft":
            spaceship.left = false;
            break;
        case "ArrowRight":
            spaceship.right = false;
            break;
    }
});



////////////////////////////
///// INITIALIZE GAME /////
//////////////////////////
startGame();