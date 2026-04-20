// I need a 3x3 game board
function gameBoard() {
	// -> define the rows and cols and the 2d board array itself
	const rows = 3;
	const col = 3;
	const board = [];

	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; i < col; j++) {
			board.push(Cell());
		}
	}
}
// -> have a for loop to fill that 2d board using .push method filling it with cells which are objects that contain the player and that players value
// -> have a method to get the current state of the board
// -> have a method method to check if the cell a user picked is valid or invalid, place their value there if valid, else return
// -> have a method to print the current state of the board

// I need a constructor for the cells, return methods: get the value inside the cell and add the value to the cell, figure it out later
function Cell() {
	// 0 for nothing in this cell
	let value = 0;

	// method for adding the players value to the cell
	const addPlayerValue = (playerValue) => {
		value = playerValue;
	};

	// method for sending / getting the current value of the cell

	const getValue = () => value;

	return { addPlayerValue, getValue };
}
// -> use factory functions instead and make use of private variables and functions

// now assuming we have every method to be able to simulate a real game, we make a controller for the game
// first we need to define our players and their values
// define a variable for the game board to get access to its methods
// have a method to get the current active player
// have a method to switch the active player per round
// have a method to print the current round, the positions, active player etc
// have a method to play the round
// have a method to check the current state of the board and determine if a player has a winning pattern respective of their values
