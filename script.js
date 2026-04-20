// I need a 3x3 game board
function GameBoard() {
	// -> define the rows and cols and the 2d board array itself
	const rows = 3;
	const cols = 3;
	const board = [];

	// -> have a for loop to fill that 2d board using .push method filling it with cells which are objects that contain the player and that players value
	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < cols; j++) {
			board[i].push(Cell());
		}
	}

	// -> have a method to get the current state of the board
	const getBoard = () => board;

	// -> have a method method add a players value to a cell, check if that cell is available first (3x3 grid)
	const setPlayerValue = (row, column, player) => {
		// safeguardingS
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

	// -> have a method to print the current state of the board
	const printBoard = () => {
		const currentBoard = board.map((row) => row.map((cell) => cell.getValue()));
		console.table(currentBoard);
	};

	const resetBoard = () => {
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				board[i][j].addValue(0);
			}
		}
	};

	return { getBoard, setPlayerValue, printBoard, resetBoard };
}

// I need a constructor for the cells, return methods: get the value inside the cell and add the value to the cell, figure it out later
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

// now assuming we have every method to be able to simulate a real game, we make a controller for the game
function GameController(playerOne = "Player X", playerTwo = "Player O") {
	// first we need to define our players and their values
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

	// define a variable for the game board to get access to its methods
	const board = GameBoard();

	// have a method to get the current active player
	let activePlayer = players[0];

	const getActivePlayer = () => activePlayer;

	// have a method to switch the active player per round
	const switchActivePlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	// have a method to print the current round, the positions, active player etc
	const printRound = (winner) => {
		board.printBoard();
		if (!winner) console.log(`${getActivePlayer().name}'s turn.`);
		else console.log(`${getActivePlayer().name} won!`);
	};

	// have a method to check the current state of the board and determine if a player has a winning pattern respective of their values
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
				return true;
			}
		}
		// columns
		for (let j = 0; j < 3; j++) {
			if (
				currentBoardValues[0][j] === playerValue &&
				currentBoardValues[1][j] === playerValue &&
				currentBoardValues[2][j] === playerValue
			) {
				return true;
			}
		}

		// diagonals
		if (
			currentBoardValues[0][0] === playerValue &&
			currentBoardValues[1][1] === playerValue &&
			currentBoardValues[2][2] === playerValue
		) {
			return true;
		}
		if (
			currentBoardValues[0][2] === playerValue &&
			currentBoardValues[1][1] === playerValue &&
			currentBoardValues[2][0] === playerValue
		) {
			return true;
		}

		return false;
	};

	const checkTie = () => {
		const currentBoardValues = board
			.getBoard()
			.map((row) => row.map((cell) => cell.getValue()));

		return !currentBoardValues.flat().includes(0);
	};

	// have a method to play the round
	const playRound = (row, col) => {
		if (board.setPlayerValue(row, col, getActivePlayer().symbol)) {
			if (checkWin()) {
				printRound(true);
				return true;
			}

			if (checkTie()) {
				console.log("It's a tie.");
				return "tie";
			}

			switchActivePlayer();
			printRound(false);
			return false;
		} else {
			console.log("Invalid move");
			printRound();
		}
	};

	const restartGame = () => {
		board.resetBoard();
		activePlayer = players[0];
	};

	printRound();

	return { playRound, getActivePlayer, getBoard: board.getBoard, restartGame };
}

// have a method to display the game into the dom and accept inputs from it

function ScreenController() {
	const game = GameController();
	const playerTurnText = document.querySelector(".status");
	const boardDiv = document.querySelector(".board");
	const restartBtn = document.querySelector("#restart-btn");

	const updateScreen = (winner) => {
		boardDiv.textContent = "";

		const board = game.getBoard();
		const activePlayer = game.getActivePlayer();

		if (winner === true) {
			playerTurnText.textContent = `${activePlayer.name} won!`;
		} else if (winner === "tie") {
			playerTurnText.textContent = "It's a tie!";
		} else {
			playerTurnText.textContent = `${activePlayer.name}'s turn.`;
		}

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
	};

	function clickHandlerBoard(e) {
		if (
			playerTurnText.textContent.includes("won") ||
			playerTurnText.textContent.includes("tie")
		) {
			return;
		}
		const selectedColumn = e.target.dataset.column;
		const selectedRow = e.target.dataset.row;

		if (!selectedColumn || !selectedRow) return;

		updateScreen(game.playRound(selectedRow, selectedColumn));
	}

	function clickHandlerRestart(e) {
		game.restartGame();

		updateScreen();
	}

	boardDiv.addEventListener("click", clickHandlerBoard);
	restartBtn.addEventListener("click", clickHandlerRestart);
	updateScreen();
}

ScreenController();
