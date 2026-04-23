// construction of everything related to the base board
function GameBoard() {
	// define the rows and cols and the 2d board grid
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
	const getBoardRows = () => rows;
	const getBoardCols = () => cols;

	// method method add a players value to a cell, check if that cell is available first
	const setPlayerValue = (row, column, player) => {
		// safeguarding
		if (row < 0 || row > rows || column < 0 || column > cols) {
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

	return { getBoard, setPlayerValue, resetBoard, getBoardCols, getBoardRows };
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
	const totalRows = board.getBoardRows();
	const totalCols = board.getBoardCols();

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

		// my brain is expanding
		const isSamePlayer = (currentValue) => currentValue === playerValue;

		// rows
		for (let i = 0; i < totalRows; i++) {
			if (currentBoardValues[i].every(isSamePlayer)) isGameOver = true;
		}

		// columns
		for (let j = 0; j < totalCols; j++) {
			const colWin = currentBoardValues.every((row) => row[j] === playerValue);
			if (colWin) isGameOver = true;
		}

		// diagonals
		const diagLtoRwin = currentBoardValues.every(
			(row, index) => row[index] === playerValue,
		);

		const diagRtoLwin = currentBoardValues.every((row, index, array) => {
			const reverseIndex = array.length - 1 - index;

			return row[reverseIndex] === playerValue;
		});

		if (diagLtoRwin || diagRtoLwin) isGameOver = true;

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
		totalRows: board.getBoardRows,
		totalCols: board.getBoardCols,
	};
}

// renders and updates the game into the dom and accept inputs
function ScreenController() {
	const game = GameController();
	const playerTurnText = document.querySelector(".status");
	const boardDiv = document.querySelector(".board");
	const restartBtn = document.querySelector("#restart-btn");
	const board = game.getBoard();
	const totalRows = game.totalRows();
	const totalCols = game.totalCols();

	// renders the base grid of buttons
	function initializeBoard() {
		boardDiv.textContent = "";

		boardDiv.style.gridTemplateColumns = `repeat(${totalCols}, 110px)`;
		boardDiv.style.gridTemplateRows = `repeat(${totalRows}, 110px)`;

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
	// render that cell's text to reflect internal board values
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

function ModalController() {
	const modal = document.querySelector("#game-modal");
	const startBtn = document.querySelector("#start-game-btn");
	const customSizeInput = document.querySelector("#custom-size");
	const boardSizeRadios = document.querySelectorAll('input[name="board-size"]');

	modal.showModal();

	customSizeInput.addEventListener("focus", () => {
		boardSizeRadios.forEach((radio) => (radio.checked = false));
	});

	boardSizeRadios.forEach((radio) => {
		radio.addEventListener("change", () => {
			customSizeInput.value = "";
		});
	});

	function clickHandlerStart(e) {
		e.preventDefault();

		const hasRadio = Array.from(boardSizeRadios).some((r) => r.checked);
		const hasCustom = customSizeInput.value.trim() !== "";

		if (!hasRadio && !hasCustom) {
			customSizeInput.focus();
			return;
		}

		modal.close();
	}

	startBtn.addEventListener("click", clickHandlerStart);
}

ModalController();
ScreenController();
