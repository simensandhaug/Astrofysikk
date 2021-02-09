const canvas = document.getElementById("asteroidsCanvas");
const ctx = canvas.getContext("2d");

let spaceship = {
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

const drawPolygon = (centerX, centerY, size, rotationDegrees) => {
    var radians = rotationDegrees * Math.PI / 180;
    ctx.translate(centerX, centerY);
    ctx.rotate(radians);
    ctx.beginPath();
    ctx.moveTo(size * Math.cos(0), size * Math.sin(0));
    for (var i = 1; i <= 3; i += 1) ctx.lineTo(size * Math.cos(i * 2 * Math.PI / 3), size * Math.sin(i * 2 * Math.PI / 3));
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
    ctx.rotate(-radians);
    ctx.translate(-centerX, -centerY);
}

document.addEventListener("keydown", (e) => {
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

document.addEventListener("keyup", (e) => {
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

setInterval(() => {
    if(spaceship.left) spaceship.rotation += -2;
    if(spaceship.right) spaceship.rotation += 2;

    if(spaceship.rotation > 360) spaceship.rotation = 0;
    if(spaceship.rotation < 0) spaceship.rotation = 360;

    spaceship.xPos += spaceship.dx;
    spaceship.yPos += spaceship.dy;

    if(spaceship.xPos < 0) spaceship.xPos = canvas.width;
    if(spaceship.xpos > canvas.width) spaceship.xPos = 0;
    if(spaceship.yPos < 0) spaceship.yPos = canvas.height;
    if(spaceship.ypos > canvas.height) spaceship.yPos = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPolygon(spaceship.xPos, spaceship.yPos, spaceship.size, spaceship.rotation);
}, 20);

drawPolygon(spaceship.xPos, spaceship.yPos, spaceship.size, spaceship.rotation);