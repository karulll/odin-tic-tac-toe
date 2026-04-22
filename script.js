// construction of everything related to the base board
function GameBoard() {
	// -> define the rows and cols and the 2d board array itself
	const rows = 3;
	const cols = 3;
	const board = [];

	// create the board, array of objects
	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < cols; j++) {
			board[i].push(Cell());
		}
	}

	const getBoard = () => board;

	// method method add a players value to a cell, check if that cell is available first
	const setPlayerValue = (row, column, player) => {
		// safeguarding
		if (row < 0 || row > 2 || column < 0 || column > 2) {
			return false;
		}

		// check if that cell is available first
		if (board[row][column].getValue() === 0) {
			board[row][column].addValue(player);
			return true;
		} else {
			return false;
		}
	};

	// set all cells to empty
	const resetBoard = () => {
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				board[i][j].addValue(0);
			}
		}
	};

	return { getBoard, setPlayerValue, resetBoard };
}

// constructor for the individual cells
function Cell() {
	// 0 for nothing in this cell
	let value = 0;

	// method for adding the players value to the cell
	const addValue = (playerValue) => {
		value = playerValue;
	};

	// method for sending / getting the current value of the cell
	const getValue = () => value;

	return { addValue, getValue };
}

// control the flow of the game
function GameController(playerOne = "Player X", playerTwo = "Player O") {
	const players = [
		{
			name: playerOne,
			value: 1,
			symbol: "X",
		},
		{
			name: playerTwo,
			value: 2,
			symbol: "O",
		},
	];

	const board = GameBoard();

	let activePlayer = players[0];
	let isGameOver = false;
	let isGameTie = false;

	const getActivePlayer = () => activePlayer;
	const getIsGameOver = () => isGameOver;
	const getIsGameTie = () => isGameTie;

	const switchActivePlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	// method to check the current state of the board and determine
	// if a player has a winning pattern respective of their values
	const checkWin = () => {
		const currentBoardValues = board
			.getBoard()
			.map((row) => row.map((cell) => cell.getValue()));

		const playerValue = getActivePlayer().symbol;

		//  rows
		for (let i = 0; i < 3; i++) {
			if (
				currentBoardValues[i][0] === playerValue &&
				currentBoardValues[i][1] === playerValue &&
				currentBoardValues[i][2] === playerValue
			) {
				isGameOver = true;
			}
		}
		// columns
		for (let j = 0; j < 3; j++) {
			if (
				currentBoardValues[0][j] === playerValue &&
				currentBoardValues[1][j] === playerValue &&
				currentBoardValues[2][j] === playerValue
			) {
				isGameOver = true;
			}
		}

		// diagonals
		if (
			currentBoardValues[0][0] === playerValue &&
			currentBoardValues[1][1] === playerValue &&
			currentBoardValues[2][2] === playerValue
		) {
			isGameOver = true;
		}
		if (
			currentBoardValues[0][2] === playerValue &&
			currentBoardValues[1][1] === playerValue &&
			currentBoardValues[2][0] === playerValue
		) {
			isGameOver = true;
		}
		currentBoardValues.flat().includes(0)
			? (isGameTie = false)
			: (isGameTie = true);
	};

	// method to play a round
	// applies active player's symbol at the targeted cell
	// switches player's turn if game has not ended
	const playRound = (row, col) => {
		if (board.setPlayerValue(row, col, getActivePlayer().symbol)) {
			checkWin();
			if (isGameOver || isGameTie) return;
			switchActivePlayer();
		}
	};

	const restartGame = () => {
		isGameOver = false;
		isGameTie = false;
		board.resetBoard();
		activePlayer = players[0];
	};

	return {
		playRound,
		getActivePlayer,
		getBoard: board.getBoard,
		restartGame,
		getIsGameOver,
		getIsGameTie,
	};
}

// have a method to display the game into the dom and accept inputs from it
function ScreenController() {
	const game = GameController();
	const playerTurnText = document.querySelector(".status");
	const boardDiv = document.querySelector(".board");
	const restartBtn = document.querySelector("#restart-btn");
	const board = game.getBoard();

	// renders the base grid of buttons
	function initializeBoard() {
		boardDiv.textContent = "";

		board.forEach((row, i) => {
			row.forEach((cell, j) => {
				const cellButton = document.createElement("button");
				cellButton.classList.add("cell");

				cellButton.dataset.column = j;
				cellButton.dataset.row = i;

				cellButton.textContent = cell.getValue() === 0 ? " " : cell.getValue();
				boardDiv.appendChild(cellButton);
			});
		});
	}

	// gets row & col data attributes from the targeted cell
	// render that cell's dom to reflect internal board values
	function updateScreen(row, col) {
		const activePlayer = game.getActivePlayer();
		const allCells = document.querySelectorAll(".cell");

		if (row !== undefined && col !== undefined) {
			const cellButton = document.querySelector(
				`[data-row="${row}"][data-column="${col}"]`,
			);
			cellButton.textContent =
				board[row][col].getValue() === 0 ? " " : board[row][col].getValue();
		} else {
			allCells.forEach((cell) => (cell.textContent = " "));
		}

		if (game.getIsGameOver()) {
			playerTurnText.textContent = `${activePlayer.name} won!`;
		} else if (game.getIsGameTie()) {
			playerTurnText.textContent = "It's a tie!";
		} else {
			playerTurnText.textContent = `${activePlayer.name}'s turn.`;
		}
	}

	// gets the row & col data from the clicked cell
	function clickHandlerBoard(e) {
		if (game.getIsGameOver() || game.getIsGameTie()) return;

		const selectedColumn = e.target.dataset.column;
		const selectedRow = e.target.dataset.row;

		if (!selectedColumn || !selectedRow) return;

		game.playRound(selectedRow, selectedColumn);
		updateScreen(selectedRow, selectedColumn);
	}

	function clickHandlerRestart(e) {
		game.restartGame();
		updateScreen();
	}

	boardDiv.addEventListener("click", clickHandlerBoard);
	restartBtn.addEventListener("click", clickHandlerRestart);
	initializeBoard();
	updateScreen();
}

ScreenController();
