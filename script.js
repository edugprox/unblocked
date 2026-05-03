// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        const tabName = button.getAttribute('data-tab');
        document.getElementById(tabName).classList.add('active');
    });
});

// Proxy Function
function goProxy() {
    const url = document.getElementById('proxyInput').value.trim();
    if (!url) {
        alert('Please enter a URL!');
        return;
    }

    let proxyUrl = url;
    if (!proxyUrl.startsWith('http://') && !proxyUrl.startsWith('https://')) {
        proxyUrl = 'https://' + proxyUrl;
    }

    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const finalUrl = corsProxy + proxyUrl;

    document.getElementById('proxy-frame-container').style.display = 'block';
    document.getElementById('proxy-frame').src = finalUrl;
}

document.addEventListener('DOMContentLoaded', () => {
    const proxyInput = document.getElementById('proxyInput');
    if (proxyInput) {
        proxyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                goProxy();
            }
        });
    }
});

// Load Game
function loadGame(gameName) {
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('game-title').textContent = '🎮 ' + gameName.toUpperCase();
    document.getElementById('game-content').innerHTML = '';

    switch(gameName) {
        case 'snake':
            loadSnakeGame();
            break;
        case 'tictactoe':
            loadTicTacToe();
            break;
        case 'minesweeper':
            loadMinesweeper();
            break;
        case '2048':
            load2048();
            break;
        case 'dice':
            loadDiceGame();
            break;
        case 'wordsearch':
            loadWordSearch();
            break;
        case 'brickbreaker':
            loadBrickBreaker();
            break;
        case 'memory':
            loadMemoryGame();
            break;
    }
}

function closeGame() {
    document.getElementById('game-container').style.display = 'none';
}

// SNAKE GAME
function loadSnakeGame() {
    const html = `
        <canvas id="snakeCanvas" width="400" height="400" style="border: 2px solid #0099ff; display: block; margin: 0 auto; background: #000;"></canvas>
        <p style="text-align: center; margin-top: 10px; color: #0099ff;">Use Arrow Keys to Move | Score: <span id="snakeScore">0</span></p>
    `;
    document.getElementById('game-content').innerHTML = html;

    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');

    let snake = [{x: 10, y: 10}];
    let food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
    let direction = {x: 1, y: 0};
    let nextDirection = {x: 1, y: 0};
    let score = 0;

    function drawGame() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 400, 400);

        ctx.fillStyle = '#0099ff';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18);
        });

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(food.x * 20, food.y * 20, 18, 18);
    }

    function gameLoop() {
        direction = nextDirection;
        const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
            alert('Game Over! Score: ' + score);
            closeGame();
            return;
        }

        for (let segment of snake) {
            if (head.x === segment.x && head.y === segment.y) {
                alert('Game Over! Score: ' + score);
                closeGame();
                return;
            }
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('snakeScore').textContent = score;
            food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
        } else {
            snake.pop();
        }

        drawGame();
        setTimeout(gameLoop, 100);
    }

    document.addEventListener('keydown', function handleSnakeKeys(e) {
        if (e.key === 'ArrowUp' && direction.y === 0) nextDirection = {x: 0, y: -1};
        else if (e.key === 'ArrowDown' && direction.y === 0) nextDirection = {x: 0, y: 1};
        else if (e.key === 'ArrowLeft' && direction.x === 0) nextDirection = {x: -1, y: 0};
        else if (e.key === 'ArrowRight' && direction.x === 0) nextDirection = {x: 1, y: 0};
    });

    drawGame();
    gameLoop();
}

// TIC TAC TOE GAME
function loadTicTacToe() {
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    const winConditions = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

    function checkWin(player) {
        return winConditions.some(c => c.every(i => board[i] === player));
    }

    function render() {
        let html = '<div style="display: grid; grid-template-columns: repeat(3, 100px); gap: 5px; margin: 20px auto;">';
        board.forEach((cell, i) => {
            html += `<div onclick="tttClick(${i})" style="width: 100px; height: 100px; background: #0066cc; border: 2px solid #0099ff; display: flex; align-items: center; justify-content: center; font-size: 2em; color: #fff; cursor: pointer; font-weight: bold;">${cell}</div>`;
        });
        html += '</div>';
        html += `<p style="text-align: center; color: #0099ff; margin-top: 20px;" id="tttStatus">Your turn (X)</p>`;
        html += `<button onclick="resetTTT()" style="display: block; margin: 20px auto; padding: 10px 20px; background: #0066cc; color: #fff; border: none; cursor: pointer; border-radius: 5px;">Restart</button>`;
        
        document.getElementById('game-content').innerHTML = html;
    }

    window.tttClick = function(i) {
        if (!gameActive || board[i]) return;
        
        board[i] = 'X';
        
        if (checkWin('X')) {
            document.getElementById('tttStatus').textContent = '🎉 You Win!';
            gameActive = false;
            render();
            return;
        }
        
        if (board.every(c => c)) {
            document.getElementById('tttStatus').textContent = 'Draw!';
            gameActive = false;
            render();
            return;
        }

        let empty = board.map((c, i) => c === '' ? i : null).filter(v => v !== null);
        let computerMove = empty[Math.floor(Math.random() * empty.length)];
        board[computerMove] = 'O';

        if (checkWin('O')) {
            document.getElementById('tttStatus').textContent = 'Computer Wins!';
            gameActive = false;
        } else if (board.every(c => c)) {
            document.getElementById('tttStatus').textContent = 'Draw!';
            gameActive = false;
        }

        render();
    };

    window.resetTTT = function() {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        render();
    };

    render();
}

// MINESWEEPER GAME
function loadMinesweeper() {
    const SIZE = 8;
    const MINES = 10;
    let board = Array(SIZE * SIZE).fill(0);
    let revealed = Array(SIZE * SIZE).fill(false);

    for (let i = 0; i < MINES; i++) {
        let pos = Math.floor(Math.random() * (SIZE * SIZE));
        if (board[pos] !== 9) board[pos] = 9;
        else i--;
    }

    for (let i = 0; i < SIZE * SIZE; i++) {
        if (board[i] !== 9) {
            let count = 0;
            const row = Math.floor(i / SIZE);
            const col = i % SIZE;
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r * SIZE + c] === 9) count++;
                }
            }
            board[i] = count;
        }
    }

    function render() {
        let html = `<div style="display: grid; grid-template-columns: repeat(${SIZE}, 40px); gap: 2px; margin: 20px auto; width: fit-content;">`;
        board.forEach((cell, i) => {
            let content = '';
            if (revealed[i]) {
                content = cell === 9 ? '💣' : (cell === 0 ? '' : cell);
            }
            html += `<div onclick="mineClick(${i})" oncontextmenu="mineFlag(event, ${i})" style="width: 40px; height: 40px; background: ${revealed[i] ? '#000' : '#0066cc'}; border: 2px ${revealed[i] ? 'solid #333' : 'outset #0099ff'}; display: flex; align-items: center; justify-content: center; color: #0099ff; cursor: pointer;">${content}</div>`;
        });
        html += '</div>';
        document.getElementById('game-content').innerHTML = html;
    }

    window.mineClick = function(i) {
        if (board[i] === 9) {
            alert('Game Over! You hit a mine!');
            closeGame();
        } else {
            revealed[i] = true;
            render();
        }
    };

    window.mineFlag = function(e, i) {
        e.preventDefault();
        alert('Position marked!');
    };

    render();
}

// 2048 GAME
function load2048() {
    let board = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
    let score = 0;

    function addNewTile() {
        let empty = [];
        board.forEach((row, r) => row.forEach((cell, c) => {
            if (cell === 0) empty.push({r, c});
        }));
        if (empty.length > 0) {
            let pos = empty[Math.floor(Math.random() * empty.length)];
            board[pos.r][pos.c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function render() {
        let html = '<div style="display: grid; grid-template-columns: repeat(4, 80px); gap: 5px; margin: 20px auto;">';
        board.forEach(row => {
            row.forEach(cell => {
                html += `<div style="width: 80px; height: 80px; background: ${cell === 0 ? '#333' : '#0066cc'}; border: 2px solid #0099ff; display: flex; align-items: center; justify-content: center; font-size: 1.5em; color: #fff; font-weight: bold;">${cell || ''}</div>`;
            });
        });
        html += '</div>';
        html += `<p style="text-align: center; color: #0099ff; margin-top: 20px;">Score: ${score}</p>`;
        html += `<p style="text-align: center; color: #aaa;">Use arrow keys to move. Combine tiles to reach 2048!</p>`;
        document.getElementById('game-content').innerHTML = html;
    }

    function move(direction) {
        let moved = false;
        let newBoard = board.map(row => [...row]);

        if (direction === 'right' || direction === 'left') {
            newBoard.forEach(row => {
                let line = row.filter(v => v !== 0);
                if (direction === 'right') line.reverse();

                for (let i = 0; i < line.length - 1; i++) {
                    if (line[i] === line[i + 1]) {
                        line[i] *= 2;
                        score += line[i];
                        line.splice(i + 1, 1);
                    }
                }

                while (line.length < 4) {
                    if (direction === 'right') line.unshift(0);
                    else line.push(0);
                }

                if (direction === 'right') line.reverse();

                for (let i = 0; i < 4; i++) {
                    if (row[i] !== line[i]) moved = true;
                    row[i] = line[i];
                }
            });
        }

        if (moved) {
            addNewTile();
            render();
        }
    }

    document.addEventListener('keydown', function handle2048Keys(e) {
        if (e.key === 'ArrowRight') move('right');
        else if (e.key === 'ArrowLeft') move('left');
    });

    addNewTile();
    addNewTile();
    render();
}

// DICE GAME
function loadDiceGame() {
    let rolls = [];

    const html = `
        <div style="text-align: center;">
            <div style="font-size: 4em; margin: 30px 0; color: #0099ff;" id="diceDisplay">🎲</div>
            <button onclick="rollDice()" style="padding: 15px 30px; background: #0066cc; color: #fff; border: none; cursor: pointer; border-radius: 5px; font-size: 1.1em; margin: 10px;">Roll Dice</button>
            <p style="color: #0099ff; margin-top: 20px; font-size: 1.5em;">Result: <span id="diceResult">-</span></p>
            <p style="color: #aaa;">Previous rolls: <span id="diceHistory">-</span></p>
        </div>
    `;
    document.getElementById('game-content').innerHTML = html;

    window.rollDice = function() {
        let dice = Math.floor(Math.random() * 6) + 1;
        let faces = ['🎲', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        document.getElementById('diceDisplay').textContent = faces[dice];
        document.getElementById('diceResult').textContent = dice;
        rolls.push(dice);
        if (rolls.length > 10) rolls.shift();
        document.getElementById('diceHistory').textContent = rolls.join(', ');
    };
}

// WORD SEARCH GAME
function loadWordSearch() {
    const words = ['SNAKE', 'GAME', 'PLAY', 'CODE', 'BLUE', 'GPROXY'];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let grid = [];

    for (let i = 0; i < 8; i++) {
        let row = [];
        for (let j = 0; j < 8; j++) {
            row.push(letters[Math.floor(Math.random() * 26)]);
        }
        grid.push(row);
    }

    words.forEach(word => {
        let row = Math.floor(Math.random() * 8);
        let col = Math.floor(Math.random() * (8 - word.length));
        for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word[i];
        }
    });

    let html = '<div style="display: grid; grid-template-columns: repeat(8, 40px); gap: 2px; margin: 20px auto;">';
    grid.forEach((row, r) => {
        row.forEach((letter, c) => {
            html += `<div style="width: 40px; height: 40px; background: #0066cc; border: 1px solid #0099ff; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; cursor: pointer;">${letter}</div>`;
        });
    });
    html += '</div>';
    html += '<p style="text-align: center; color: #0099ff; margin-top: 20px;">Find: ' + words.join(', ') + '</p>';
    document.getElementById('game-content').innerHTML = html;
}

// BRICK BREAKER GAME
function loadBrickBreaker() {
    const html = `
        <canvas id="brickCanvas" width="400" height="300" style="border: 2px solid #0099ff; display: block; margin: 0 auto; background: #000;"></canvas>
        <p style="text-align: center; margin-top: 10px; color: #0099ff;">Move: A/D or Arrow Keys | Score: <span id="brickScore">0</span></p>
    `;
    document.getElementById('game-content').innerHTML = html;

    const canvas = document.getElementById('brickCanvas');
    const ctx = canvas.getContext('2d');

    let paddle = {x: 150, y: 280, width: 80, height: 10};
    let ball = {x: 200, y: 250, radius: 5, dx: 3, dy: -3};
    let bricks = [];
    let score = 0;

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 8; j++) {
            bricks.push({x: j * 50, y: i * 20, width: 48, height: 18});
        }
    }

    let keys = {};
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
    });
    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });

    function drawGame() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 400, 300);

        ctx.fillStyle = '#0099ff';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0066cc';
        bricks.forEach(brick => {
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        });
    }

    function gameLoop() {
        if (keys['a'] || keys['arrowleft']) paddle.x -= 7;
        if (keys['d'] || keys['arrowright']) paddle.x += 7;
        paddle.x = Math.max(0, Math.min(320, paddle.x));

        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x - ball.radius < 0 || ball.x + ball.radius > 400) ball.dx *= -1;
        if (ball.y - ball.radius < 0) ball.dy *= -1;

        if (ball.y - ball.radius > 300) {
            alert('Game Over! Score: ' + score);
            closeGame();
            return;
        }

        if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy *= -1;
        }

        for (let i = 0; i < bricks.length; i++) {
            let brick = bricks[i];
            if (ball.x > brick.x && ball.x < brick.x + brick.width &&
                ball.y > brick.y && ball.y < brick.y + brick.height) {
                bricks.splice(i, 1);
                ball.dy *= -1;
                score += 10;
                document.getElementById('brickScore').textContent = score;
            }
        }

        drawGame();
        requestAnimationFrame(gameLoop);
    }

    drawGame();
    gameLoop();
}

// MEMORY GAME
function loadMemoryGame() {
    const pairs = ['🎮', '🎯', '🎲', '🎨', '🎭', '🎪', '🎬', '🎤'];
    let cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
    let flipped = Array(16).fill(false);
    let matched = Array(16).fill(false);
    let firstCard = null;
    let score = 0;

    function render() {
        let html = '<div style="display: grid; grid-template-columns: repeat(4, 80px); gap: 5px; margin: 20px auto;">';
        cards.forEach((card, i) => {
            html += `<div onclick="memoryClick(${i})" style="width: 80px; height: 80px; background: ${matched[i] ? '#333' : '#0066cc'}; border: 2px solid #0099ff; display: flex; align-items: center; justify-content: center; font-size: 2em; cursor: pointer;">${flipped[i] ? card : '?'}</div>`;
        });
        html += '</div>';
        html += `<p style="text-align: center; color: #0099ff; margin-top: 20px;">Pairs Found: ${score}/8</p>`;
        document.getElementById('game-content').innerHTML = html;
    }

    window.memoryClick = function(i) {
        if (flipped[i] || matched[i]) return;

        flipped[i] = true;

        if (firstCard === null) {
            firstCard = i;
            render();
        } else {
            if (cards[i] === cards[firstCard]) {
                matched[i] = true;
                matched[firstCard] = true;
                score++;
                firstCard = null;
                render();
                if (score === 8) alert('You Won! All pairs matched!');
            } else {
                render();
                setTimeout(() => {
                    flipped[i] = false;
                    flipped[firstCard] = false;
                    firstCard = null;
                    render();
                }, 1000);
            }
        }
    };

    render();
}
