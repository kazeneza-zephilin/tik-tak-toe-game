const updatePlayerNames = (callback) => {
    const dialog = document.querySelector("#my-dialog");
    const form = document.querySelector('#my-form');
  
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // prevent page reload
        const formData = new FormData(form); // getting form data
        const firstPlayerNames = formData.get("first-player");
        const secondPlayerNames = formData.get("second-player");
        const playerOneNamesDiv = document.querySelector(".player-one");
        const playerTwoNamesDiv = document.querySelector(".player-two");
  
        // Updating the UI
        playerOneNamesDiv.textContent = `first player name: ${firstPlayerNames}`;
        playerTwoNamesDiv.textContent = `second player name: ${secondPlayerNames}`;
  
        dialog.close();
        // Calling the callback to continue initializing the game
        callback(firstPlayerNames, secondPlayerNames);
    });
  };
  
  function GameBoard() {
    const rows = 3;
    const columns = 3;
    let board = [];
  
    const initializeBoard = () => {
        board = [];
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    };
    initializeBoard();
  
    const getBoard = () => board;
  
    const placeMaker = (row, column, player) => {
      //change the checker here from 0 to ' ' 
        const validCell = board[row][column].getValue() === ' ';
        if (!validCell) return;
        board[row][column].addMaker(player);
    };
  
    const reset = () => initializeBoard();
  
    return {
        getBoard,
        placeMaker,
        reset
    };
  }
  
  function Cell() {
      //change from 0 to ''
    let value = ' ';
    const addMaker = (player) => (value = player);
    const getValue = () => value;
    return {
        addMaker,
        getValue
    };
  }
  
  function gameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ) {
    const board = GameBoard();
    const players = [
        { name: playerOneName, token: 'X' },
        { name: playerTwoName, token: 'O' }
    ];
    let activePlayer = players[0];
  
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
  
    const getActivePlayer = () => activePlayer;
  
    const getWinnerPlayer = (player) => {
        const boardArray = board.getBoard();
        const size = 3;
  
        // Check rows
        for (let row of boardArray) {
            if (row.every((cell) => cell.getValue() === player)) {
                return true;
            }
        }
  
        // Check columns
        for (let col = 0; col < size; col++) {
            let isWinningColumn = true;
            for (let row = 0; row < size; row++) {
                if (boardArray[row][col].getValue() !== player) {
                    isWinningColumn = false;
                    break;
                }
            }
            if (isWinningColumn) {
                return true;
            }
        }
  
        // Check diagonals
        if (boardArray.every((row, idx) => row[idx].getValue() === player)) {
            return true;
        }
        if (boardArray.every((row, idx) => row[size - idx - 1].getValue() === player)) {
            return true;
        }
  
        return false; // No winner
    };
  
    const playRound = (row, column) => {
        board.placeMaker(row, column, getActivePlayer().token);
  
        if (getWinnerPlayer(getActivePlayer().token)) {
            console.log(`${getActivePlayer().name} wins the round!`);
            board.reset();
            return getActivePlayer().token;
        }
  
        //change full board logic from 0 check to ' 'check
        const isBoardFull = board.getBoard().every((row) =>
            row.every((cell) => cell.getValue() !== ' ')
        );
        if (isBoardFull) {
            console.log("It's a tie!");
            board.reset();
            return null;
        }
  
        switchPlayerTurn();
        return null;
    };
  
    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
  }
  
  function screenController() {
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const tokenOneDiv = document.querySelector(".token-one");
    const tokenTwoDiv = document.querySelector(".token-two");
    const playerOneScoreDiv = document.querySelector(".mark-one");
    const playerTwoScoreDiv = document.querySelector(".mark-two");
  
    let game = null;
    let updateScreen = null;
    let playerOneScore = 0;
    let playerTwoScore = 0;
  
    updatePlayerNames((firstPlayerNames, secondPlayerNames) => {
        game = gameController(firstPlayerNames, secondPlayerNames);
        updateScreen = () => {
            boardDiv.textContent = ""; // Clear the board
  
            const board = game.getBoard();
            const activePlayer = game.getActivePlayer();

            tokenOneDiv.textContent = `Token: X` //temporary hard coded 
            tokenTwoDiv.textContent = 'Token: O' //temporary hard coded
            playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
            playerOneScoreDiv.textContent = `Score: ${playerOneScore}`;
            playerTwoScoreDiv.textContent = `Score: ${playerTwoScore}`;
  
            board.forEach((row, rowIdx) => {
                row.forEach((cell, colIdx) => {
                    const cellButton = document.createElement("button");
                    cellButton.classList.add("cell");
                    cellButton.dataset.row = rowIdx;
                    cellButton.dataset.column = colIdx;
                    cellButton.textContent = cell.getValue();
                    boardDiv.appendChild(cellButton);
                });
            });
        };
  
        updateScreen();
    });
  
    function boardClickHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
  
        if (!selectedRow || !selectedColumn) return;
  
        const winner = game.playRound(selectedRow, selectedColumn);
  
        if (winner === 'X') {
            playerOneScore++;
  
        } else if (winner === 'O') {
            playerTwoScore++;
        }
        updateScreen();
    }
  
    boardDiv.addEventListener("click", boardClickHandler);
  }
  
  screenController();
  