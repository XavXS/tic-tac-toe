const Player = (name, mark) => {
    const getName = () => {
        return name;
    }

    const getMark = () => {
        return mark;
    }

    return {getName, getMark};
}

const gameBoard = (() => {
    const board = [];

    const addMark = (index, mark) => {
        board[index] = mark
    };

    const isMarked = (index) => {
        return board[index];
    }

    const clear = () => {
        board = [];
    };

    return {addMark, isMarked, clear};
})();

const displayManager = (() => {
    const squares = document.querySelectorAll('.container div');

    const displayMark = (index, mark) => {
        squares[index-1].textContent = mark;
    };

    return {displayMark};
})();

const game = (() => {
    const player1 = Player('player 1', 'X');
    const player2 = Player('player 2', 'O');

    let turn = player1;

    const switchTurn = () => {
        if(turn === player1) turn = player2;
        else turn = player1;
    }

    const playTurn = (index) => {
        if(gameBoard.isMarked(index)) return;

        gameBoard.addMark(index, turn.getMark());
        displayManager.displayMark(index, turn.getMark());
        switchTurn();
    };

    return {playTurn};
})();