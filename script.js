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

const Player = (_name, _mark, _markId, _isCpu, _level, _firstmover) => {
    const getName = () => {
        return _name;
    }

    const getMark = () => {
        return _mark;
    }

    const getMarkId = () => {
        return _markId;
    }

    const play = () => {
        if(!_isCpu) return;

        switch(_level) {
            case 0: // easy
                if(_firstmover) {
                    let newNode = game.getGameNode().findMinChild();
                    game.playTurn(newNode.getIndex(), newNode);
                }
                else {
                    let newNode = game.getGameNode().findMaxChild();
                    game.playTurn(newNode.getIndex(), newNode);
                }
                break;
            case 1: // normal
                let indices = gameBoard.getEmptyIndices();
                let randIndex = Math.floor(Math.random() * indices.length);
                game.playTurn(indices[randIndex]);
                break;
            case 2: // impossible
                if(_firstmover) {
                    let newNode = game.getGameNode().findMaxChild();
                    game.playTurn(newNode.getIndex(), newNode);
                }
                else {
                    let newNode = game.getGameNode().findMinChild();
                    game.playTurn(newNode.getIndex(), newNode);
                }
                break;
            default:
                throw('Difficulty not found');
        }
    }

    return {
        getName, 
        getMark, 
        getMarkId,
        play
    };
}

const displayManager = (() => {
    const _squares = document.querySelectorAll('.container img');
    const _header = document.querySelector('h2');

    const displayMark = (index, mark) => {
        let path;
        switch(mark) {
            case 0:
                path = 'img/bee.png';
                break;
            case 1:
                path = 'img/burger.png';
                break;
            case 2:
                path = 'img/cat.png';
                break;
            case 3:
                path = 'img/dog.png';
                break;
            case 4:
                path = 'img/heart.png';
                break;
            case 5:
                path = 'img/ice-cream.png';
                break;
            case 6:
                path = 'img/penguin.png';
                break;
            case 7:
                path = 'img/star.png';
                break;
            case 8:
                path = 'img/triangle.png';
                break;
        }
        _squares[index-1].setAttribute('src', path);
    };

    const clearMarks = () => {
        for(let i=0; i<_squares.length; ++i) {
            _squares[i].setAttribute('src', 'img/empty.png');
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

    return {
        displayMark, 
        clearMarks,
        displayTurn, 
        displayWin, 
        displayTie
    };
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

        let p1name = document.getElementById('p1-name').value;
        let p2name = document.getElementById('p2-name').value;

        let p1marks = document.getElementsByName('p1-mark');
        let p2marks = document.getElementsByName('p2-mark');
        let p1markId, p2markId;
        
        let p1cpu = document.getElementById('p1cpu').checked;
        let p2cpu = document.getElementById('p2cpu').checked;

        let p1diffs = document.getElementsByName('p1-diff');
        let p2diffs = document.getElementsByName('p2-diff');
        let p1diff, p2diff;

        let p1first = document.getElementById('p1-first').checked;
        let p2first = document.getElementById('p2-first').checked;

        p1diffs.forEach(diff => {
            if(diff.checked)
                p1diff = parseInt(diff.value);
        });

        p2diffs.forEach(diff => {
            if(diff.checked)
                p2diff = parseInt(diff.value);
        });

        p1marks.forEach(mark => {
            if(mark.checked)
                p1markId = parseInt(mark.value);
        });

        p2marks.forEach(mark => {
            if(mark.checked)
                p2markId = parseInt(mark.value);
        });

        gameRunning = true;
        gameNode = gameTree.getRoot();
        player1 = Player(p1name, 'X', p1markId, p1cpu, p1diff, p1first);
        player2 = Player(p2name, 'O', p2markId, p2cpu, p2diff, p2first);
        turn = (p1first ? player1 : player2);

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

        // update node
        if(newNode) {
            gameNode = newNode;
        }
        else {
            gameNode = gameNode.getChildren().find(child => (child.getIndex() === index));
        }

        // update board
        gameBoard.addMark(index, mark);
        displayManager.displayMark(index, turn.getMarkId());

        // detect win
        if(gameBoard.hasWon(mark)) {
            displayManager.displayWin(turn.getName());
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

    return {
        start, 
        playTurn, 
        getGameNode, 
        setGameNode
    };
})();