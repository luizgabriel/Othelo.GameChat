const TEXT_MESSAGE_EVENT = "message";
const HELLO_EVENT = "hello";
const TOUCHED_BOARD_EVENT = "touched-board";
const FINISHED_TURN_EVENT = "finished-turn";

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
 const helloMessage = (name) => {
    return JSON.stringify({
        event: HELLO_EVENT,
        name,
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

module.exports = {
    TEXT_MESSAGE_EVENT,
    HELLO_EVENT,
    TOUCHED_BOARD_EVENT,
    FINISHED_TURN_EVENT,

    textMessage,
    helloMessage,
    finishedTurnMessage,
    touchedBoardMessage
}