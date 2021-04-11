const BOARD_SIZE = 64

const generateInitial = () => {
    const board = new Array(BOARD_SIZE).fill(0);
    board[27] = 2;
    board[28] = 1;
    board[35] = 1;
    board[36] = 2;

    return board;
}

const touch = (pos, currentId) => (oldBoard) => {
    const newBoard = [...oldBoard];
    const currentValue = newBoard[pos];
    newBoard[pos] = (currentValue !== currentId) ? currentId : 0;

    return newBoard;
}

const update = (pos, value) => (oldBoard) => {
    const newBoard = [...oldBoard];
    newBoard[pos] = value;

    return newBoard;
}

const isFinished = (board) => {
    for (const val of board) {
        if (val === 0)
            return false;
    }

    return true;
}

const getWinnerId = (board) => {
    let freq = {1: 0, 2: 0};

    for (const val of board) {
        if (val !== 0)
            freq[val] += 1;
    }

    return freq[1] > freq[2] ? 1 : 2;
}

module.exports = {
    generateInitial,
    update,
    touch,
    isFinished,
    getWinnerId
}