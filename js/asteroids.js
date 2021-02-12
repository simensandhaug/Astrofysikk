//////////////////////////
///// HTML ELEMENTS /////
////////////////////////
const canvas = document.getElementById("asteroidsCanvas");
const ctx = canvas.getContext("2d");
const timeEl = document.getElementById("time");
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
let spaceship = {} //Alle variabler som omhandler spaceshippet



////////////////////
///// CLASSES /////
//////////////////
class Asteroid { //Sier seg selv
    constructor(size, dx, dy, x, y) { //Størrelse, endring i x, endring i y, x posisjon, y posisjon
        this.size = size;
        this.dx = dx;
        this.dy = dy;
        this.x = x;
        this.y = y;
        this.edges = 5;
        this.vertices = [];
        for (let i = 1; i <= this.edges; i++) this.vertices.push([this.x + this.size * Math.cos(i * 2 * Math.PI / this.edges), this.y + this.size * Math.sin(i * 2 * Math.PI / this.edges)]);
    }

    draw() {
        this.vertices = [];
        for (let i = 1; i <= this.edges; i++) this.vertices.push([this.x + this.size * Math.cos(i * 2 * Math.PI / this.edges), this.y + this.size * Math.sin(i * 2 * Math.PI / this.edges)]);
        ctx.beginPath();
        ctx.moveTo(this.vertices[0][0], this.vertices[0][1]);
        for (let i = 0; i < this.vertices.length - 1; i++) ctx.lineTo(this.vertices[i + 1][0], this.vertices[i + 1][1]);
        ctx.lineTo(this.vertices[0][0], this.vertices[0][1]);
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'grey';
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }

    outsideBoundary() {
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.ypos > canvas.height) return true;
        else return false;
    }

    remove() {
        asteroids.splice(asteroids.indexOf(this), 1);
    }
}



//////////////////////
///// FUNCTIONS /////
////////////////////
const toRadians = a => a * Math.PI / 180;
const gameOver = time => { //Når spillet er over
    console.log("game over")
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
    ctx.fillText(`Score: ${time}`, canvas.width / 2 - 60, canvas.height / 2 + 30);
    clearInterval(update);
    clearInterval(createAsteroids);
    clearInterval(asteroidSpawnSpeed);
    clearInterval(gameTime);
}
const startGame = () => { //Starter spillet
    clearInterval(update);
    clearInterval(createAsteroids);
    clearInterval(asteroidSpawnSpeed);
    clearInterval(gameTime);
    spaceship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 15,
        rotation: 270,
        dx: 0,
        dy: 0,
        aX: 0,
        aY: 0,
        up: false,
        left: false,
        right: false,
        vertices: [],
        edges: 3,
        draw: () => {
            spaceship.vertices = [];
            for (let i = 1; i <= 3; i++) spaceship.vertices.push([spaceship.size * Math.cos(i * 2 * Math.PI / spaceship.edges), spaceship.size * Math.sin(i * 2 * Math.PI / spaceship.edges)]);
            let radians = spaceship.rotation * Math.PI / 180;
            ctx.translate(spaceship.x, spaceship.y);
            ctx.rotate(radians);
            ctx.beginPath();
            ctx.moveTo(spaceship.size * Math.cos(0), spaceship.size * Math.sin(0));
            for (let i = 1; i <= 3; i++) ctx.lineTo(spaceship.size * Math.cos(i * 2 * Math.PI / spaceship.edges), spaceship.size * Math.sin(i * 2 * Math.PI / spaceship.edges));
            ctx.closePath();
            ctx.fillStyle = 'red';
            ctx.strokeStyle = "grey";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fill();
            ctx.rotate(-radians);
            ctx.translate(-spaceship.x, -spaceship.y);
        }
    }

    //Setter variabler til startverdier ved new game
    asteroidInterval = 3000;
    asteroids = new Array;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spaceship.draw();
    time = 0;

    //Setter intervaller
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

        //Akselererer i retning fremover
        if (spaceship.up) {
            spaceship.aX = spaceship.directionX * 0.4;
            spaceship.aY = spaceship.directionY * 0.4;
        } else {
            spaceship.dx *= 0.98;
            spaceship.dy *= 0.98;
            spaceship.aY = 0;
            spaceship.aX = 0;
        }

        let magnitude = Math.sqrt(Math.pow(spaceship.dx, 2) + Math.pow(spaceship.dy, 2));
        if (magnitude > 8) {
            magnitude = 8;
            let angle = Math.atan2(spaceship.dy, spaceship.dx);
            spaceship.dx = Math.cos(angle) * magnitude;
            spaceship.dy = Math.sin(angle) * magnitude;
        }

        //Oppdaterer fart
        spaceship.dx += spaceship.aX;
        spaceship.dy += spaceship.aY;

        //Oppdaterer posisjonen til spaceshipet
        spaceship.x += spaceship.dx;
        spaceship.y += spaceship.dy;

        //Sjekker om spaceshippet er utenfor canvas og setter den til riktig sted
        if (spaceship.x < 0) spaceship.x = canvas.width - spaceship.size;
        if (spaceship.x + spaceship.size > canvas.width) spaceship.x = 0;
        if (spaceship.y < 0) spaceship.y = canvas.height - spaceship.size;
        if (spaceship.y + spaceship.size > canvas.height) spaceship.y = 0;

        asteroids.forEach((asteroid, i) => { //Oppdaterer og tegner de individuelle asteroidene
            asteroid.move();

            //Sjekker om spaceship collider med en av asteroidene
            for (let i = 0; i < asteroid.vertices.length - 1; i++) {
                for (let j = 0; j < spaceship.vertices.length - 1; j++) {
                    if (getLineIntersection(asteroid.vertices[i][0], asteroid.vertices[i][1], asteroid.vertices[i + 1][0], asteroid.vertices[i + 1][1], spaceship.vertices[j][0], spaceship.vertices[j][1], spaceship.vertices[j + 1][0], spaceship.vertices[j + 1][1])) gameOver(time);
                }
            }

            //Fjerner asteroiden dersom den er utafor canvas
            if (asteroid.outsideBoundary()) asteroid.remove();

            asteroid.draw() //Tegner asteroidene
        });
        spaceship.draw();
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
    }, 1000);

    spaceship.draw();
}


////////////////////////////////
///// COLLISION DETECTION /////
//////////////////////////////
//Tatt fra nettet
function getLineIntersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;
    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
    console.log(s, t)
    if ((s >= 0 && s <= 1) && (t >= 0 && t <= 1)) return true // Collision detected;
}



////////////////////////////
///// EVENT LISTENERS /////
//////////////////////////
endButton.addEventListener("click", startGame);
document.addEventListener("keydown", (e) => { //Sjekker for keydown
    if (e.key == "ArrowUp" || e.key == "w") spaceship.up = true;
    if (e.key == "ArrowLeft" || e.key == "a") spaceship.left = true;
    if (e.key == "ArrowRight" || e.key == "d") spaceship.right = true;
});
document.addEventListener("keyup", (e) => { //Sjekker for keyup
    if (e.key == "ArrowUp" || e.key == "w") spaceship.up = false;
    if (e.key == "ArrowLeft" || e.key == "a") spaceship.left = false;
    if (e.key == "ArrowRight" || e.key == "d") spaceship.right = false;
});



////////////////////////////
///// INITIALIZE GAME /////
//////////////////////////
startGame();