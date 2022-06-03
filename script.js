const Player = (_name, _mark, _isCpu, _level) => {
    const getName = () => {
        return _name;
    }

    const getMark = () => {
        return _mark;
    }

    const play = () => {
        if(!_isCpu) return;

        let indices = gameBoard.getEmptyIndices();
        let randIndex = Math.floor(Math.random()*indices.length);
        let choice = indices[randIndex];
        game.playTurn(choice);
    }

    return {getName, 
            getMark, 
            play};
}

const gameBoard = (() => {
    let _board = [];

    const addMark = (index, mark) => {
        _board[index] = mark
    };

    const isMarked = (index) => {
        return _board[index];
    }

    const clear = () => {
        _board = [];
    };

    const hasWon = (mark) => {
        // check horizontal
        for(let i=1; i<=7; i+=3) {
            for(let j=0; j<=2; ++j) {
                if(_board[i+j] !== mark) break;
                if(j >= 2) return true;
            }
        }
        // check vertical
        for(let i=1; i<=3; ++i) {
            for(let j=0; j<=6; j+=3) {
                if(_board[i+j] !== mark) break;
                if(j >= 6) return true;
            }
        }
        // check diagonal 1
        for(let i=1; i<=9; i+=4) {
            if(_board[i] !== mark) break;
            if(i >= 9) return true;
        }
        // check diagonal 2
        for(let i=3; i<=7; i+=2) {
            if(_board[i] !== mark) break;
            if(i >= 7) return true;
        }

        return false;
    }

    const isFull = () => {
        for(let i=1; i<=9; ++i) {
            if(!_board[i]) return false;
        }

        return true;
    }

    const getEmptyIndices = () => {
        let indices = [];
        for(let i=1; i<=9; ++i) {
            if(!_board[i]) indices.push(i);
        }
        return indices;
    }

    return {addMark, 
            isMarked, 
            hasWon, 
            isFull, 
            clear,
            getEmptyIndices};
})();

const displayManager = (() => {
    const _squares = document.querySelectorAll('.container div');
    const _header = document.querySelector('h2');

    const displayMark = (index, mark) => {
        _squares[index-1].textContent = mark;
    };

    const clearMarks = () => {
        for(let i=0; i<_squares.length; ++i) {
            _squares[i].textContent = '';
        }
    }

    const displayTurn = (name) => {
        _header.textContent = `${name}'s turn`;
    }

    const displayWin = (name) => {
        _header.textContent = `${name} wins!`;
    }

    const displayTie = () => {
        _header.textContent = `It's a tie!`;
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

        let p1cpu = document.getElementById('p1cpu').checked;
        let p2cpu = document.getElementById('p2cpu').checked;

        gameRunning = true;
        player1 = Player('player 1', 'X', p1cpu, 0);
        player2 = Player('player 2', 'O', p2cpu, 0);
        turn = player1;

        gameBoard.clear();
        displayManager.clearMarks();
        displayManager.displayTurn(turn.getName());

        turn.play();
    }

    const switchTurn = () => {
        if(turn === player1) turn = player2;
        else turn = player1;

        displayManager.displayTurn(turn.getName());
        turn.play();
    }

    const playTurn = (index) => {
        if(gameBoard.isMarked(index) || !gameRunning) 
            return;

        let mark = turn.getMark();
        let name = turn.getName();

        gameBoard.addMark(index, mark);
        displayManager.displayMark(index, mark);

        // detect win
        if(gameBoard.hasWon(mark)) {
            displayManager.displayWin(name);
            gameRunning = false;
            return;
        }
        // detect tie
        if(gameBoard.isFull()) {
            displayManager.displayTie();
            gameRunning = false;
            return;
        }

        switchTurn();
    };

    return {start, playTurn};
})();