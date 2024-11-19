/*tik tak toe console version*/
function GameBoard(){
    const rows = 3;
    const columns = 3;
    board = []
    
    //2-D array to represent the board
    for (let i = 0; i < rows; i++){
        board[i] = [];
        for (let j = 0; j < columns; j++){
            board[i].push(Cell())
        }
    }
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
    return {getBoard, placeMaker, printBoard}

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
        const getwinnerPlayer = () => {

        }
        swithchPlayerTurn();
        printNewRound();
    };
    //Initial play game message.
    printNewRound();
    return {
        playRound,
        getActivePlayer
    };
}

const game = gameController();