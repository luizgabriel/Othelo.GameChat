const TEXT_MESSAGE_EVENT = "message";
const HELLO_EVENT = "hello";
const TOUCHED_BOARD_EVENT = "touched-board";
const FINISHED_TURN_EVENT = "finished-turn";
const SET_PLAYER_EVENT = "set-player";
const END_OF_GAME_EVENT = "end-of-game";
const SURRENDER_EVENT = "surrender";
const RESET_GAME_EVENT = "reset-game";

/**
 *
 * @param {string} message
 * @returns
 */
const textMessage = (message) => {
    return JSON.stringify({
        event: TEXT_MESSAGE_EVENT,
        message,
    });
}

/**
 *
 * @param {string} message
 * @returns
 */
const helloMessage = () => {
    return JSON.stringify({
        event: HELLO_EVENT,
    });
}

/**
 * @param {number} pos
 * @param {number} value
 * @returns {string}
 */
const touchedBoardMessage = (pos, value) => {
    return JSON.stringify({
        event: TOUCHED_BOARD_EVENT,
        pos,
        value,
    });
}

const finishedTurnMessage = () => {
    return JSON.stringify({
        event: FINISHED_TURN_EVENT,
    });
}

const setPlayerMessage = (id) => {
    return JSON.stringify({
        event: SET_PLAYER_EVENT,
        id,
    })
}

const endOfGameMessage = (winner) => {
    return JSON.stringify({
        event: END_OF_GAME_EVENT,
        winner,
    });
}

const surrenderMessage = (id) => {
    return JSON.stringify({
        event: SURRENDER_EVENT,
        id
    })
}

const resetGameMessage = () => {
    return JSON.stringify({
        event: RESET_GAME_EVENT,
    })
}

module.exports = {
    TEXT_MESSAGE_EVENT,
    HELLO_EVENT,
    TOUCHED_BOARD_EVENT,
    FINISHED_TURN_EVENT,
    SET_PLAYER_EVENT,
    END_OF_GAME_EVENT,
    SURRENDER_EVENT,
    RESET_GAME_EVENT,

    textMessage,
    helloMessage,
    finishedTurnMessage,
    touchedBoardMessage,
    setPlayerMessage,
    endOfGameMessage,
    surrenderMessage,
    resetGameMessage
}