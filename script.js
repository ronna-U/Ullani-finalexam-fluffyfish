let move_speed = 3, grativy = 0.5;
let fish_dy = 0;
let fish = document.querySelector('.fish');
let img = document.getElementById('fish-1');
let sound_ping = new Audio('sounds effect/ping.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fish = document.querySelector('.fish');
    img = document.getElementById('fish-1');
    
    let fish_props = fish.getBoundingClientRect();
    let background = document.querySelector('.background').getBoundingClientRect();
    
    let score_val = document.querySelector('.score_val');
    let score_title = document.querySelector('.score_title');
    
    let game_state = 'Start';
    img.style.display = 'none';
    
    const bgMusic = document.getElementById('bg-music');
    
    document.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(error => {
                console.log("Audio play failed:", error);
            });
        }
    });
    
    document.querySelector('.start-button').addEventListener('click', () => {
        document.getElementById('start-modal').style.display = 'none';
        img.style.display = 'block';
        fish.style.top = '40vh';
        game_state = 'Play';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        play();
        bgMusic.play().catch(error => {
            console.log("Audio play failed:", error);
        });
    });
    
    function handleJump() {
        if (game_state === 'Play') {
            fish_dy = -7.6;
        }
    }
    
    document.addEventListener('click', handleJump);
    document.addEventListener('touchstart', handleJump);
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') handleJump();
    });
    
    function endGame() {
        game_state = 'End';
        document.getElementById('final-score').innerText = score_val.innerHTML;
        document.getElementById('game-over-modal').style.display = 'flex';
        sound_die.play().catch(error => {
            console.log("Audio play failed:", error);
        });
    }
    
    document.querySelector('.restart-button').addEventListener('click', () => {
        document.getElementById('game-over-modal').style.display = 'none';
        window.location.reload();
    });
    
    function play() {
        function move() {
            if (game_state != 'Play') return;
    
            let pipe_sprite = document.querySelectorAll('.pipe_sprite');
            pipe_sprite.forEach((element) => {
                let pipe_sprite_props = element.getBoundingClientRect();
                fish_props = fish.getBoundingClientRect();
    
                if (pipe_sprite_props.right <= 0) {
                    element.remove();
                } else {
                    if (
                        fish_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                        fish_props.left + fish_props.width > pipe_sprite_props.left &&
                        fish_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                        fish_props.top + fish_props.height > pipe_sprite_props.top
                    ) {
                        img.style.display = 'none';
                        sound_die.play().catch(err => console.log("Audio error:", err));
                        endGame();
                        return;
                    } else {
                        if (
                            pipe_sprite_props.right < fish_props.left &&
                            pipe_sprite_props.right + move_speed >= fish_props.left &&
                            element.increase_score == '1'
                        ) {
                            score_val.innerHTML = +score_val.innerHTML + 1;
                            sound_ping.play().catch(err => console.log("Audio error:", err));
                        }
                        element.style.left = pipe_sprite_props.left - move_speed + 'px';
                    }
                }
            });
            requestAnimationFrame(move);
        }
        requestAnimationFrame(move);
    
        function apply_gravity() {
            if (game_state != 'Play') return;
            fish_dy += grativy;
    
            fish_props = fish.getBoundingClientRect();
            background = document.querySelector('.background').getBoundingClientRect();
            
            if (fish_props.top <= 0 || fish_props.bottom >= background.bottom) {
                endGame();
                return;
            }
            fish.style.top = fish_props.top + fish_dy + 'px';
            requestAnimationFrame(apply_gravity);
        }
        requestAnimationFrame(apply_gravity);
    
        let pipe_seperation = 0;
        let pipe_gap = 35;
    
        function create_pipe() {
            if (game_state != 'Play') return;
    
            if (pipe_seperation > 115) {
                pipe_seperation = 0;
    
                let pipe_posi = Math.floor(Math.random() * 43) + 8;
                let pipe_sprite_inv = document.createElement('div');
                pipe_sprite_inv.className = 'pipe_sprite';
                pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
                pipe_sprite_inv.style.left = '100vw';
                document.body.appendChild(pipe_sprite_inv);
    
                let pipe_sprite = document.createElement('div');
                pipe_sprite.className = 'pipe_sprite';
                pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
                pipe_sprite.style.left = '100vw';
                pipe_sprite.increase_score = '1';
                document.body.appendChild(pipe_sprite);
            }
            pipe_seperation++;
            requestAnimationFrame(create_pipe);
        }
        requestAnimationFrame(create_pipe);
    }
    
    window.addEventListener('offline', () => {
        document.getElementById('offline-error').style.display = 'block';
    });
    
    window.addEventListener('online', () => {
        document.getElementById('offline-error').style.display = 'none';
    });
    
    // PWA Install Prompt
    let deferredPrompt;
    const installButton = document.getElementById('install-button');
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installButton) {
            installButton.style.display = 'block';
    
            installButton.addEventListener('click', () => {
                installButton.style.display = 'none';
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(choiceResult => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    deferredPrompt = null;
                });
            });
        }
    });
});