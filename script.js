const gameBoard = (() => {
    let _board = [];

    const addMark = (index, mark) => {
        _board[index] = mark
    };


    const removeMark = (index) => {
        if(index === undefined) return;
        _board[index] = undefined;
    }

    const isMarked = (index) => {
        return _board[index];
    }

    const clear = () => {
        _board = [];
    };

    const print = () => {
        for(let i=1; i<_board.length; i+=3) {
            let content = '';
            for(let j=0; j<3; ++j) {
                if(!_board[i+j]) content += '  ';
                else content += _board[i+j] + ' ';
            }
            console.log(content);
        }
        console.log(' ');
    }

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
            if(!_board[i]) {
                indices.push(i);
            }
        }
        return indices;
    }

    return {
        addMark, 
        isMarked, 
        hasWon,
        isFull, 
        clear,
        getEmptyIndices, 
        print, 
        removeMark
    };
})();

const node = (_index) => {
    let _children = [];
    let _point = 0;

    const getChildren = () => {
        return _children;
    }

    const getPoint = () => {
        return _point;
    }

    const setPoint = (point) => {
        _point = point;
    }

    const addChild = (_node) => {
        getChildren().push(_node);
    }

    const findMaxChild = () => {
        let children = getChildren();
        if(children.length === 0)
            return;

        let maxChild = children[0];
        let maxPoint = children[0].getPoint();
        children.forEach(child => {
            let point = child.getPoint();
            if(point > maxPoint) {
                maxChild = child;
                maxPoint = point;
            }
        })
        return maxChild;
    }

    const findMinChild = () => {
        let children = getChildren();
        if(children.length === 0)
            return;

        let minChild = children[0];
        let minPoint = children[0].getPoint();
        children.forEach(child => {
            let point = child.getPoint();
            if(point < minPoint) {
                minChild = child;
                minPoint = point;
            }
        })
        return minChild;
    }

    const getIndex = () => {
        return _index;
    }

    return {
        getChildren,
        getIndex,
        addChild,
        getPoint,
        setPoint,
        findMaxChild,
        findMinChild
    };
}

const gameTree = (() => {
    let _root = node();
    const _p1mark = 'X';
    const _p2mark = 'O';

    const getRoot = () => {
        return _root;
    }

    const buildTree = (_currentNode, minimax=1) => {
        let indices = gameBoard.getEmptyIndices();

        if(gameBoard.hasWon(_p1mark)) {
            _currentNode.setPoint(indices.length+1);
            gameBoard.removeMark(_currentNode.getIndex());
            return;
        }
        else if(gameBoard.hasWon(_p2mark)) {
            _currentNode.setPoint(-(indices.length+1));
            gameBoard.removeMark(_currentNode.getIndex());
            return;
        }

        indices.forEach(index => {
            let newNode = node(index);
            _currentNode.addChild(newNode);

            if(indices.length % 2 !== 0) {
                gameBoard.addMark(index, _p1mark);
            }
            else {
                gameBoard.addMark(index, _p2mark);
            }

            buildTree(newNode, -minimax);
        });

        // if children exist
        if(_currentNode.getChildren().length > 0) {
            if(minimax === 1) {
                _currentNode.setPoint(_currentNode.findMaxChild().getPoint());
            }
            else {
                _currentNode.setPoint(_currentNode.findMinChild().getPoint());
            }
        }

        gameBoard.removeMark(_currentNode.getIndex());
    }

    buildTree(_root);

    return {getRoot,};
})();

const Player = (_name, _mark, _isCpu, _level, _firstmover) => {
    const getName = () => {
        return _name;
    }

    const getMark = () => {
        return _mark;
    }

    const play = () => {
        if(!_isCpu) return;

        switch(_level) {
                // easy mode
            case 0:
                break;
                // impossible mode
            case 2:
                // normal mode
            default:
                let indices = gameBoard.getEmptyIndices(gameBoard.getBoard());
                let randIndex = Math.floor(Math.random() * indices.length);
                let choice = indices[randIndex];
                game.playTurn(choice);
        }
    }

    return {
            getName, 
            getMark, 
            play
    };
}

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
    let gameNode;

    const start = () => {
        if(gameRunning)
            return;
        
        let p1cpu = document.getElementById('p1cpu').checked;
        let p2cpu = document.getElementById('p2cpu').checked;

        gameRunning = true;
        gameNode = gameTree.getRootNode();
        player1 = Player('player 1', 'X', p1cpu, 0, true);
        player2 = Player('player 2', 'O', p2cpu, 0, false);
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

    const playTurn = (index, newNode) => {
        if(gameBoard.isMarked(index) || !gameRunning) 
            return;

        let mark = turn.getMark();
        let name = turn.getName();

        // update node

        // update board
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

    const getGameNode = () => {
        return gameNode;
    }

    const setGameNode = (node) => {
        gameNode = node;
    }

    return {start, 
            playTurn, 
            getGameNode, 
            setGameNode};
})();