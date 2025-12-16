const cells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('game-status');
const currentPlayerDisplay = document.getElementById('current-player-display');
const resetButton = document.getElementById('reset-button');
const playerXScoreDisplay = document.getElementById('playerX-score');
const playerOScoreDisplay = document.getElementById('playerO-score');
const gameContainer = document.querySelector('.game-container');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function updateStatus(message) {
    gameStatus.innerHTML = message;
}

function updatePlayerDisplay() {
    currentPlayerDisplay.textContent = currentPlayer;
    if (currentPlayer === 'X') {
        gameContainer.style.borderColor = 'var(--player-x-color)';
    } else {
        gameContainer.style.borderColor = 'var(--player-o-color)';
    }
}

function updateScores() {
    playerXScoreDisplay.textContent = `X: ${playerXScore}`;
    playerOScoreDisplay.textContent = `O: ${playerOScore}`;
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    checkResult();
}

function checkResult() {
    let roundWon = false;
    let winningCells = [];

    for (let i = 0; i < winConditions.length; i++) {
        const winCondition = winConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningCells = winCondition;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        if (currentPlayer === 'X') {
            playerXScore++;
        } else {
            playerOScore++;
        }
        updateScores();
        updateStatus(`🎉 Jogador <span style="color:var(--${currentPlayer.toLowerCase()}-color)">${currentPlayer}</span> Venceu!`);
        
        // Aplica o estilo de vencedor
        winningCells.forEach(index => {
            cells[index].classList.add('winner');
        });
        return;
    }

    // Verifica Empate
    let roundDraw = !board.includes('');
    if (roundDraw) {
        gameActive = false;
        updateStatus('🤝 Empate!');
        return;
    }

    // Alterna o Jogador
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Vez do Jogador <span id="current-player-display">${currentPlayer}</span>`);
    updatePlayerDisplay();
}

function resetRound() {
    gameActive = true;
    board = ['', '', '', '', '', '', '', '', ''];

    // Limpa a UI
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
    });

    // Garante que o turno começa pelo jogador 'X' após um reset, mas mantém a pontuação
    currentPlayer = 'X';
    updateStatus(`Vez do Jogador <span id="current-player-display">${currentPlayer}</span>`);
    updatePlayerDisplay();
}

// Inicialização
updatePlayerDisplay();
updateScores();

// Adiciona Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetRound);