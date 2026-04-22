# tic tac toe

simple tic tac toe game for odin project with a retro? cmd window aesthetic.

### learned from this

- how to actually structure my javascript. instead of having one massive file with global variables everywhere, used factory functions and the module pattern to keep things scoped and clean (somewhat).
- separation of concerns. split the app into three distinct parts: the board (just the array), the game controller (the rules, wins, ties), and the screen controller (the dom stuff). making the console output work before moving to the visual web page is good, build without copying the connect 4 code next time.
- event listener management. avoid situations where you're sticking event listeners everywhere.

### stuff to learn for better programming

- stop destroying the dom. right now, every time a player clicks a square, i completely wipe the div and recreate all 9 buttons from scratch. works for this, but know i should probably build the buttons once and just update their text layer.
- dont rely on other people's source code so much when trying to learn

### to do's to make sure i actually learned something

- [x] **1. state management**
  - [x] add a proper `let isGameOver = false` variable inside `GameController` to not use UI text for logic
  - [x] update `playRound` to flip `isGameOver = true` when there's a win or tie, and flip it back to `false` in `restartGame`
  - [x] make `playRound` return if `isGameOver` is true

- [x] **2. dom recycling**
  - [x] move the `document.createElement("button")` loops out of `updateScreen` into a new `initializeBoard()` function that only runs once when the page loads
  - [x] change `updateScreen()` so it only loops through the _existing_ DOM `.cell` buttons and updates their `.textContent`

- [ ] **3. dynamic loops & board scaling**
  - [x] replace hardcoded boundary numbers like `i < 3` inside loops with `board.length` or `rows` / `cols` variables (specifically in `checkWin`)
  - [ ] accept an input `size` variable in `GameBoard(size)` so it can generate any shape `N x N` array instead of forcing a 3x3 array
  - [ ] update the css `grid-template-columns` dynamically via javascript (`boardDiv.style.gridTemplateColumns`) so the physical size matches the `size` input
  - [ ] refactor `checkWin` logic so it searches for winning loops dynamically across any board size instead of specifically hardcoding indices `[0]`, `[1]`, and `[2]`

- [ ] **4. extras**
  - [ ] add UI options to let the user select different board sizes before starting a game
  - [ ] implement an AI opponent and add a toggle to choose between "Player vs Player" or "Player vs AI"
