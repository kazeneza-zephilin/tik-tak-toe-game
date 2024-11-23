/*tik tak toe console version*/
function GameBoard(){
    const rows = 3;
    const columns = 3;
    let board = []
    
    //initializing game board to be able to reset
    //game easily
    const initializeBoard = () => {
        board = []
        for (let i = 0; i < rows; i++){
            board[i] = [];
            for (let j = 0; j < columns; j++){
                board[i].push(Cell())
            }
        }
    };
    initializeBoard();
    const getBoard = () => board;

    const placeMaker = (row, column, player) => {
        //checking if cell is empty
        const validCell = board[row][column].getValue() === 0;
        if(!validCell) return
        board[row][column].addMaker(player)
    }
    //printing the running board as player change
    //this should be removed after bulding UI
    const printBoard = () => {
        const boardWithCellValues = board
        .map((row) => row
        .map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    }
    const reset = () => initializeBoard();
    return {getBoard,
        placeMaker,
        printBoard,
        reset}

}
function Cell(){
    let value = 0
    const addMaker = (player) => value = player;
    const getValue = () => value;
    return {
        addMaker,
        getValue
    }

}

function gameController(
    playerOneName= "player one",
    playerTwoName = "player two"
){
    const board = GameBoard();
    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name:playerTwoName,
            token: 2
        }];
    let activePlayer = players[0];
    const swithchPlayerTurn = () => {
        activePlayer = activePlayer === players[0]? players[1]:players[0];
    }
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }
    const playRound = (row, column) => {
        //placing a marker for current user
        console.log(
            `placing ${getActivePlayer().name}'s token into
            row ${row} and column ${column}`
        )
        board.placeMaker(row, column, getActivePlayer().token)
        //winner logic
        const getWinnerPlayer = (player) => {
            //logic checking if player got all row's cell
            const baordArray = board.getBoard();
            const size = 3;
            for (let row of baordArray){
                if(row.every((cell) => cell.getValue() === player)){
                    console.log(`player ${player} win round (row)`);
                    return true;
                }
            }
            //checking if player got all three column
            //remember: the inner loop is being treated as row that would be
            // for col = 0 (outer loop) inner loop would be [0][0], [1][0] and [2][0]  
            for (let col = 0; col < size; col++){
                let isWinningColumn = true;
                for (let row = 0; row < size; row++){
                    if (baordArray[row][col].getValue() !== player){
                        isWinningColumn = false;
                        break;
                    }
                }
                if (isWinningColumn){
                    console.log(`${player} won this round (column)`)
                    return true;
                }
                //checking for diagonal win
                //checking top left to bottom right corner for indeces[0][0], [1][1], [2][2]
                if (baordArray.every((row, idx) => row[idx].getValue() === player)){
                    console.log(`${player} won (diagonal)`);
                    return true;
                }
                //top right to bottom left
                //checking for the indeces [0][2], [1][1], and [2][0]
                if (baordArray.every((row, idx) => row[size - idx - 1].getValue() === player)){
                    console.log(`${player} won the round (diagonal)`);
                    return true;
                }
                //checking for tie
                //all game bord cell must be occupied by the players tokens
                const isBoardFull = baordArray.every((row) => row.every((cell) => cell.getValue() !== 0))
                if (isBoardFull){
                    console.log("it's a tie")
                    return true;
                }
                //end the game.
                return false;


            };
        }
        const hasWinner = getWinnerPlayer(getActivePlayer().token);
        if (hasWinner){
            console.log("game Over");
            board.reset(); //reseting board
            console.log("board has been reset");
            printNewRound();
            return;
        }

        getWinnerPlayer(getActivePlayer().token);
        swithchPlayerTurn();
        printNewRound();
    };
    //Initial play game message.
    printNewRound();
    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}
// we nolenger need this game object, all game will be
//contrelled with DOM elements
//const game = gameController();

function screenController() {
    const game = gameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        //clear the board
        boardDiv.textContent = ""

        //get the most up to date board and active player
        const board = game.getBoard()
        const activePlayer = game.getActivePlayer()

        //disaplay the player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        //render board squares
        board.forEach((row, rowIdx) => {
            row.forEach((cell, colIdx) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                //creating data attribute to easily access the cell
                //rows and column positions
                cellButton.dataset.row = rowIdx;
                cellButton.dataset.column = colIdx;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })


    }
    //add event listener to the board
    function boardClickHandler(e){
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        //check if user clicked in the cell square not
        //gap inbetween
        if ((!selectedRow) || (!selectedColumn)) return
        game.playRound(selectedRow, selectedColumn)
        updateScreen()
    }
    boardDiv.addEventListener("click", boardClickHandler);
    //initioal render
    updateScreen();
    // we don't need to return anything because everything is encapsulated
    //inside screenController.
}
screenController();