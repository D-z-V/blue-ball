const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth-4;
canvas.height = innerHeight-4;

var gameStatus = 0;
var score = 0;
var healthVal = 4;

class Spikes{
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
    }

    draw(x) {
        ctx.beginPath();
        ctx.moveTo(x, this.position.y);
        ctx.lineTo(x + 50, this.position.y);
        ctx.lineTo(x + 25, this.position.y + 50);
        ctx.lineTo(x, this.position.y);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.stroke();
    }
}

class Player {
    constructor() {
        this.position = {
            x: canvas.width / 2,
            y: 200
        }
        this.velocity = {
            x: 0,
            y: 2
        }
        this.acceralation = {
            x: 0,
            y: 0,
        }

        this.radius = 25
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();     
    }

    collision() {
        if (this.position.y >= canvas.height) {
            this.position.y = canvas.height;
            this.velocity.y = 0;
            this.velocity.x = 0;
            this.acceralation.y = 0;
            return true;
        }
        else if (this.position.y <= 50*1.35) { 
            this.position.y = 50*1.35;
            this.velocity.y = 0;
            this.velocity.x = 0;
            this.acceralation.y = 0;
            return true;
         }
        else if (this.position.x >= canvas.width) {
            this.position.x = canvas.width;
            this.velocity.y = 0;
            this.velocity.x = 0;
            this.acceralation.y = 0;
            return true;
        }
        else if (this.position.x <= 0) {
            this.position.x = 0;
            this.velocity.y = 0;
            this.velocity.x = 0;
            this.acceralation.y = 0;
            return true;
        } 
    }

    update() {
        this.draw();
        this.velocity.y += this.acceralation.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Platform {
    constructor(position) {
        this.position = {
            x: position.x,
            y: position.y
        }
        this.velocity = { 
            x: 0,
            y: -0.5,
        }
        this.width = 200;
        this.height = 27;
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillStyle = 'grey';
        ctx.fill();
        ctx.closePath();
    }

    collision(player) { 
        if (player.position.y + player.radius >= this.position.y && player.position.y + player.radius <= this.position.y + this.height) {
            if (player.position.x + player.radius >= this.position.x && player.position.x + player.radius <= this.position.x + this.width) {
                player.position.y = this.position.y - player.radius;
            }
        }
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.platforms = [];

        var numPlatforms = Math.floor(Math.random() * (3) + 1);
        for (let j = 0; j < 100000; j += 150) {
            for (let i = 0; i < numPlatforms; i++) {
                score = score + i
                var xPos = Math.floor(Math.random() * (canvas.width - 200) + 1);
                this.platforms.push(new Platform({ 
                    x: xPos,
                    y: canvas.height + j
                }));
            }
        }
    }
    update() {}
}

class Health {
    constructor() {
        this.position = {
            x: 50,
            y: 80
        }
        this.width = 50;
        this.height = 50;

    }

    draw() {
        var space = 50;
        for (let i = 0; i < healthVal; i++) {
            ctx.beginPath();
            ctx.arc(space, this.position.y, 15, 0, Math.PI * 2, false);
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.closePath();
            space += 50;
        }   
    }

    grab(player) {
        if (player.position.x + player.radius >= this.position.x && player.position.x + player.radius <= this.position.x + this.width) {
            if (player.position.y + player.radius >= this.position.y && player.position.y + player.radius <= this.position.y + this.height) {
                healthVal++;
                return true;
            }
        }
    }
}

const spikes = new Spikes();
const grids = [new Grid()];
const health = new Health();
const player = new Player();

function start() {

    if (healthVal == 0) {
        gameOver();
    }


    else {
        gameStatus = 1;
        animate();

        addEventListener('keydown', function( {key} ) {
            if (key === 'ArrowLeft' || key === 'a') {
                player.velocity.x = -2;
            } 
            else if (key === 'ArrowRight' || key === 'd') {
                player.acceralation.x = 0.05;
                player.velocity.x = 2;
            } 
        });
    }
    
}


function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < canvas.width; i += 50) {
        spikes.draw(i);
        
    }
    health.draw();
    player.update();
    grids.forEach(grid => {
        grid.update();
        grid.platforms.forEach(platform => {
            platform.update();
            platform.collision(player);
        });
    });
    if (player.collision()) {
        gameOver();
    }
}

function gameOver() {
    healthVal--;
    gameStatus = 0;
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over, Press Spacebar to restart", canvas.width/2 - 250, canvas.height / 2);
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, canvas.width/2 - 70, canvas.height / 2 + 50);
}

addEventListener('keydown', function( {key} ) { 
    if (key === ' ') {
        location.reload();
    }
});

start(healthVal);