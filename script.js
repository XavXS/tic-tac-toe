const gameBoard = (() => {
    const board = [];
    const addMark = (mark, index) => board[index] = mark;
    return {addMark};
})();

const Player = (name, mark) => {
    return {name, mark}
}

const displayManager = (() => {
    const displayMark = (index) => {};
    return {displayMark};
})();

const game = (() => {
    const player1 = Player('player 1', 'X');
    const player2 = Player('player 2', 'O');
})();