// I need a 3x3 game board
function gameBoard() {
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

	return { getBoard, setPlayerValue, printBoard };
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
// have a method to check the current state of the board and determine if a player has a winning pattern respective of their values
