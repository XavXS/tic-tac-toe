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
    let board = [];

    const addMark = (index, mark) => {
        board[index] = mark
    };

    const isMarked = (index) => {
        return board[index];
    }

    const clear = () => {
        board = [];
    };

    const hasWon = (mark) => {
        // check horizontal
        for(let i=1; i<=7; i+=3) {
            for(let j=0; j<=2; ++j) {
                if(board[i+j] !== mark) break;
                if(j >= 2) return true;
            }
        }
        // check vertical
        for(let i=1; i<=3; ++i) {
            for(let j=0; j<=6; j+=3) {
                if(board[i+j] !== mark) break;
                if(j >= 6) return true;
            }
        }
        // check diagonal 1
        for(let i=1; i<=9; i+=4) {
            if(board[i] !== mark) break;
            if(i >= 9) return true;
        }
        // check diagonal 2
        for(let i=3; i<=7; i+=2) {
            if(board[i] !== mark) break;
            if(i >= 7) return true;
        }

        return false;
    }

    const isFull = () => {
        for(let i=1; i<=9; ++i) {
            if(!board[i]) return false;
        }

        return true;
    }

    return {addMark, isMarked, hasWon, isFull, clear};
})();

const displayManager = (() => {
    const squares = document.querySelectorAll('.container div');
    const header = document.querySelector('h2');

    const displayMark = (index, mark) => {
        squares[index-1].textContent = mark;
    };

    const clearMarks = () => {
        for(let i=0; i<squares.length; ++i) {
            squares[i].textContent = '';
        }
    }

    const displayTurn = (name) => {
        header.textContent = `${name}'s turn`;
    }

    const displayWin = (name) => {
        header.textContent = `${name} wins!`;
    }

    const displayTie = () => {
        header.textContent = `It's a tie!`;
    }

    return {displayMark, 
            clearMarks,
            displayTurn, 
            displayWin, 
            displayTie};
})();

const game = (() => {
    let player1; 
    let player2;
    let turn;
    let gameRunning = false;

    const start = () => {
        if(gameRunning)
            return;

        gameRunning = true;
        player1 = Player('player 1', 'X');
        player2 = Player('player 2', 'O');
        turn = player1;

        gameBoard.clear();
        displayManager.clearMarks();
        displayManager.displayTurn(turn.getName());
    }

    const switchTurn = () => {
        if(turn === player1) turn = player2;
        else turn = player1;
    }

    const playTurn = (index) => {
        if(gameBoard.isMarked(index) || !gameRunning) 
            return;

        let mark = turn.getMark();
        let name = turn.getName();

        gameBoard.addMark(index, mark);
        displayManager.displayMark(index, mark);

        if(gameBoard.hasWon(mark)) {
            displayManager.displayWin(name);
            gameRunning = false;
            return;
        }

        if(gameBoard.isFull()) {
            displayManager.displayTie();
            gameRunning = false;
            return;
        }

        switchTurn();
        displayManager.displayTurn(turn.getName());
    };

    return {start, playTurn};
})();