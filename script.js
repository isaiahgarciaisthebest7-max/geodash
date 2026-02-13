let player = document.getElementById("player");
let game = document.getElementById("game");
let statusText = document.getElementById("status");

let jumping = false;
let velocity = 0;
let gravity = 1;
let levelSpeed = 5;
let gameInterval;

document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && !jumping) {
        jumping = true;
        velocity = 15;
    }
});

function startLevel(level) {
    clearGame();
    statusText.innerText = "Level " + level;

    levelSpeed = 4 + level;

    for (let i = 0; i < level * 5; i++) {
        let spike = document.createElement("div");
        spike.classList.add("spike");
        spike.style.left = (400 + i * 200) + "px";
        game.appendChild(spike);
    }

    gameInterval = setInterval(updateGame, 20);
}

function updateGame() {
    let spikes = document.querySelectorAll(".spike");

    velocity -= gravity;
    let bottom = parseInt(window.getComputedStyle(player).bottom);
    player.style.bottom = (bottom + velocity) + "px";

    if (bottom <= 0) {
        player.style.bottom = "0px";
        jumping = false;
    }

    spikes.forEach(spike => {
        let spikeLeft = parseInt(spike.style.left);
        spike.style.left = (spikeLeft - levelSpeed) + "px";

        if (checkCollision(player, spike)) {
            gameOver();
        }
    });
}

function checkCollision(player, spike) {
    let pRect = player.getBoundingClientRect();
    let sRect = spike.getBoundingClientRect();

    return !(
        pRect.top > sRect.bottom ||
        pRect.bottom < sRect.top ||
        pRect.right < sRect.left ||
        pRect.left > sRect.right
    );
}

function gameOver() {
    clearInterval(gameInterval);
    statusText.innerText = "You Died! Refresh to Retry.";
}

function clearGame() {
    let spikes = document.querySelectorAll(".spike");
    spikes.forEach(spike => spike.remove());
}
