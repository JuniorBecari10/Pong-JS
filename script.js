const canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var p1Y = 0;
var p2Y = 0;

var ballX = 0;
var ballY = 0;

var ballDx = 0;
var ballDy = 0;

const paddleSpeed = 20;
const ballSpeed = 8;

const paddleWidth = 20;
const paddleHeight = 200;

const ballSize = 20;

var p1Points = 0;
var p2Points = 0;

var keyPressed = false;
var keyCodes = new Set();

size();
init();
window.requestAnimationFrame(loop);

function size() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function random(min, max) {
    return min + Math.random() * (max - min);
}

function collide(x1, y1, w1, h1,
                 x2, y2, w2, h2) {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}

// ----------------

document.addEventListener("keydown", e => {
    keyCodes.add(e.keyCode);
    keyPressed = true;
});

document.addEventListener("keyup", e => {
    keyCodes.delete(e.keyCode);
    
    keyPressed = false;
});

function keyCode(keyCode) {
    for (let key of keyCodes)
        if (key === keyCode)
            return true;
    
    return false;
}

function init() {
    p1Y = canvas.height / 2 - (paddleHeight / 2);
    p2Y = canvas.height / 2 - (paddleHeight / 2);
    
    ballX = canvas.width / 2 - (ballSize / 2);
    ballY = canvas.height / 2 - (ballSize / 2);
    
    ballDx = random(-1, 1);
    ballDy = random(-1, 1);
}

function tick() {
    ballX += ballDx * ballSpeed;
    ballY += ballDy * ballSpeed;
    
    if (ballY < 0 || ballY + ballSize > canvas.height) ballDy *= -1;
    
    if (collide(ballX, ballY, ballSize, ballSize, 0, p1Y, paddleWidth, paddleHeight)) ballDx *= -1;
    if (collide(ballX, ballY, ballSize, ballSize, canvas.width - paddleWidth, p2Y, paddleWidth, paddleHeight)) ballDx *= -1;
    
    if (ballX < 0) {
        p2Points++;
        init();
    }
    
    if (ballX + ballSize > canvas.width) {
        p1Points++;
        init();
    }
    
    if (keyCode(87) && p1Y > 0) p1Y -= paddleSpeed;
    else if (keyCode(83) && p1Y + paddleHeight < canvas.height) p1Y += paddleSpeed;
    
    if (keyCode(38) && p2Y > 0) p2Y -= paddleSpeed;
    else if (keyCode(40) && p2Y + paddleHeight < canvas.height) p2Y += paddleSpeed;
    
    if (keyCode(82)) init();
}

function render() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, p1Y, paddleWidth, paddleHeight);
    
    ctx.fillRect(canvas.width - paddleWidth, p2Y, paddleWidth, paddleHeight);
    
    ctx.fillRect(ballX, ballY, ballSize, ballSize);
    
    let text = p1Points + " - " + p2Points;
    
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(text, canvas.width / 2 - (text.length * 5), 40)
}

function loop() {
    size();
    
    tick();
    render();
    
    window.requestAnimationFrame(loop);
}
