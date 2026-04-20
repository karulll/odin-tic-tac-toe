# tic tac toe

simple tic tac toe game for odin project with a retro? cmd window aesthetic.

### learned from this

- how to actually structure my javascript. instead of having one massive file with global variables everywhere, used factory functions and the module pattern to keep things scoped and clean.
- separation of concerns. split the app into three distinct parts: the board (just the array), the game controller (the rules, wins, ties), and the screen controller (the dom stuff). making the console output work before moving to the visual web page is good, build without copying the connect 4 code next time
- event listener management. avoid situations where you're sticking event listeners everywgere

### stuff to learn for better programming

- stop destroying the dom. right now, every time a player clicks a square, i completely wipe the div and recreate all 9 buttons from scratch. works for this, but i know i should probably build the buttons once and just update their text layer.
