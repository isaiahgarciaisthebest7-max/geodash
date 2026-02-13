let player = document.getElementById("player");
let game = document.getElementById("game");
let statusText = document.getElementById("status");

let gravity = 0.8;
let velocity = 0;
let jumping = false;
let gameSpeed = 6;
let mode = "cube";
let waveDirection = 1;
let gameStarted = false;
let gameLoop;

document.addEventListener("keydown", function(e) {
    if (e.code === "Space" || e.code === "ArrowUp") {
        if (!gameStarted) startGame();
        handleInput();
    }
});

function handleInput() {
    if (mode === "cube") {
        if (!jumping) {
            velocity = 15;
            jumping = true;
        }
    }

    else if (mode === "ship") {
        velocity = 8;
    }

    else if (mode === "ball") {
        gravity *= -1;
    }

    else if (mode === "ufo") {
        velocity = 12;
    }

    else if (mode === "wave") {
        waveDirection *= -1;
    }
}

function startGame() {
    gameStarted = true;
    statusText.innerText = "Good Luck 😈";
    createLevel();
    gameLoop = setInterval(updateGame, 20);
}

function createLevel() {

    // Spikes layout (same layout always)
    let spikePositions = [400, 600, 650, 900, 1200, 1400, 1800, 2000, 2300];

    spikePositions.forEach(pos => {
        let spike = document.createElement("div");
        spike.classList.add("spike");
        spike.style.left = pos + "px";
        game.appendChild(spike);
    });

    // Mode portals
    let modes = ["ship", "ball", "ufo", "wave", "cube"];
    let portalPositions = [800, 1300, 1700, 2100, 2600];

    for (let i = 0; i < modes.length; i++) {
        let portal = document.createElement("div");
        portal.classList.add("portal");
        portal.style.left = portalPositions[i] + "px";
        portal.dataset.mode = modes[i];
        game.appendChild(portal);
    }
}

function updateGame() {

    let bottom = parseInt(window.getComputedStyle(player).bottom);

    if (mode === "cube" || mode === "ufo") {
        velocity -= gravity;
        player.style.bottom = (bottom + velocity) + "px";

        if (bottom <= 0) {
            player.style.bottom = "0px";
            jumping = false;
        }
    }

    if (mode === "ship") {
        velocity -= gravity * 0.5;
        player.style.bottom = (bottom + velocity) + "px";
    }

    if (mode === "wave") {
        player.style.bottom = (bottom + waveDirection * 8) + "px";
    }

    moveObjects();
    checkCollisions();
}

function moveObjects() {
    let objects = document.querySelectorAll(".spike, .portal");

    objects.forEach(obj => {
        let left = parseInt(obj.style.left);
        obj.style.left = (left - gameSpeed) + "px";
    });
}

function checkCollisions() {
    let spikes = document.querySelectorAll(".spike");
    let portals = document.querySelectorAll(".portal");

    spikes.forEach(spike => {
        if (collide(player, spike)) gameOver();
    });

    portals.forEach(portal => {
        if (collide(player, portal)) {
            mode = portal.dataset.mode;
            player.style.background = randomColor();
        }
    });
}

function collide(a, b) {
    let r1 = a.getBoundingClientRect();
    let r2 = b.getBoundingClientRect();

    return !(r1.top > r2.bottom ||
             r1.bottom < r2.top ||
             r1.right < r2.left ||
             r1.left > r2.right);
}

function randomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}

function gameOver() {
    clearInterval(gameLoop);
    statusText.innerText = "💀 You Died - Refresh to Retry";
}
