const gameBoard = (() => {
    const board = [];

    const addMark = (index, mark) => {
        board[index] = mark
    };

    const clear = () => {
        board = [];
    };

    return {addMark};
})();

const displayManager = (() => {
    const squares = document.querySelectorAll('.container div');

    const displayMark = (index, mark) => {
        squares[index].textContent = mark;
    };

    return {displayMark};
})();

const game = (() => {
    const player1 = Player('player 1', 'X');
    const player2 = Player('player 2', 'O');

    const turn = player1;

    const switchTurn = () => {
        if(turn === player1) turn = player2;
        else turn = player1;
    }

    const playTurn = (index) => {
        gameBoard.addMark(index, turn.getMark());
        displayManager.displayMark(index, turn.getMark());
        switchTurn();
    };

    return {playTurn};
})();

const Player = (name, mark) => {
    const getName = () => {
        return name;
    }

    const getMark = () => {
        return mark;
    }

    return {getName, getMark};
}