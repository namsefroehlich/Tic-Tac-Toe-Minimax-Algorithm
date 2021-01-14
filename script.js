let origBoard;

// Players
const huPlayer = "O";
const aiPlayer = "X";

// All the possible TicTacToe Winning Cominations
const winCombos = [
    [0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

// Reference to each HTML Cell
const cells = document.querySelectorAll(".cell");

// Game Starts
startGame()

// decl. startGame()
function startGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());

    // Clearing all the X and O's from the origBoard for a fresh start and also the background-color for the winner declaration
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
        cells[i].style.removeProperty("background-color");
        cells[i].addEventListener("click", turnClick, false);
    }
}


function turnClick(square) {

    if (typeof origBoard[square.target.id] == "number") {

        // Id of cell that was clicked && Calling the turn() for the huPlayer
        console.log(square.target.id);
        turn(square.target.id, huPlayer);
    
        // if it's not a tie ai player clicks the best possible spot
        if (!checkTie()) turn(bestSpot(), aiPlayer);
    }
}

// Updating the display each time the Player clicks on a Cell && After each turn checking if game has been won with checkWin()
function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;

    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {

    // Find every Index the player has played in 
    let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, [])
    let gameWon = null;

    for (let [index, win] of winCombos.entries()) {
        // has the player played in every spot that constitutes a winning combo
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break
        }
    }
    return gameWon
}


function gameOver(gameWon) {
    // setting background color for huPlayer or aiPlayer if they won
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = 
        gameWon.player == huPlayer ? "white" : "lightgrey";
    }
    // every cell that was clicked is now unclickable && if gameWon no more clicking possible
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

// finding empty Squares for the ai 
function emptySquares() {
    return origBoard.filter(s => typeof s == "number")
}

function bestSpot() {
    return minimax(origBoard, aiPlayer).index;    
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "lightgrey";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

// Minimax Algorithm
function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}

    var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

        // The recursion happens until it reaches a terminal state and returns a score one level up
        if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}
        // minimax resets newBoard to what it was before and pushes the move object to the moves array
        newBoard[availSpots[i]] = move.index;


        moves.push(move);
    }

    // minimax algorithm needs to evaluate the best move in the moves array and should choose the highest score when aiPlayer is playing and the lowest when humPlayer is Playing
	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
