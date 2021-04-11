import Board from "../components/Board"
import Layout from "../components/Layout"
import Chat from "../components/Chat"
import {useCallback, useEffect, useState} from "react"
import useWebSocket, {ReadyState} from 'react-use-websocket'
import B from '../lib/board'
import M from '../lib/messages'
import moment from "moment"
import 'moment/locale/pt-br'
import BoardController from "../components/BoardController";

const CONNECTION_STATUS = {
    [ReadyState.CONNECTING]: 'Conectando',
    [ReadyState.OPEN]: 'Aberta',
    [ReadyState.CLOSING]: 'Fechando',
    [ReadyState.CLOSED]: 'Fechada',
    [ReadyState.UNINSTANTIATED]: 'Não iniciada',
};

const parsedSocketMessage = (socketMessage) => {
    if (!socketMessage || !socketMessage.data) return null;
    return JSON.parse(socketMessage.data);
}

const fromSocketToMessage = (data) => {
    if (data.event === M.TEXT_MESSAGE_EVENT)
        return {
            type: "received",
            message: data.message
        }
    else if (data.event === M.HELLO_EVENT)
        return {
            type: "system",
            message: "Seu adversário entrou no jogo"
        }
    else if (data.event === M.SET_PLAYER_EVENT)
        return {
            type: "system",
            message: data.id === 1 ? "Você joga com as brancas!" : "Você joga com as pretas!"
        }
    else if (data.event === M.SURRENDER_EVENT)
        return {
            type: "system",
            message: "Seu adversário desistiu da partida!"
        }
    else if (data.event === M.RESET_GAME_EVENT)
        return {
            type: "system",
            message: "Seu adversário reiniciou o tabuleiro!"
        }
}

const appendMessageDate = (message) => {
    return {
        ...message,
        ts: moment(),
    };
}


// noinspection JSUnusedGlobalSymbols
export const getServerSideProps = () => {
    const socketUrl = process.env.SOCKET_URL || 'ws://localhost:3000/websocket';

    return {
        props: {socketUrl}
    }
};

const Home = ({socketUrl}) => {
    const [boardState, setBoardState] = useState(B.generateInitial())
    const [boardDisabled, setBoardDisabled] = useState(true)
    const {sendMessage, lastMessage, readyState} = useWebSocket(socketUrl)
    const [messages, setMessages] = useState([]);
    const [id, setId] = useState(0);
    const [endOfGame, setEndOfGame] = useState(0)

    const resetBoardState = () => setBoardState(B.generateInitial());
    const appendNewMessage = (message) => setMessages((oldMessages) => oldMessages.concat(appendMessageDate(message)));
    const touchBoard = useCallback((idx) => {
        const newBoard = B.touch(idx, id)(boardState);
        setBoardState(newBoard);
        return newBoard[idx];
    }, [boardState, id]);

    const updateBoard = (idx, value) => {
        setBoardState(B.update(idx, value));
        return value;
    }

    useEffect(() => {
        appendNewMessage({type: "system", message: "Você entrou no jogo!"})
        sendMessage(M.helloMessage())
    }, [])

    useEffect(() => {
        const message = parsedSocketMessage(lastMessage)
        if (!message) return

        if (message.event === M.SET_PLAYER_EVENT) {
            resetBoardState()
            setId(message.id)
            setBoardDisabled(message.id !== 2)
        } else if (message.event === M.FINISHED_TURN_EVENT) {
            setBoardDisabled(false)
        } else if (message.event === M.TOUCHED_BOARD_EVENT) {
            updateBoard(message.pos, message.value)
        } else if (message.event === M.END_OF_GAME_EVENT) {
            setEndOfGame(message.winner)
        } else if (message.event === M.SURRENDER_EVENT) {
            setBoardDisabled(false)
            setEndOfGame(id)
        } else if (message.event === M.RESET_GAME_EVENT) {
            resetBoardState()
            setEndOfGame(0)
            setBoardDisabled(true)
        }

        const textMessage = fromSocketToMessage(message)
        if (textMessage)
            appendNewMessage(textMessage)

    }, [lastMessage])

    const onClickCell = (pos) => {
        const newValue = touchBoard(pos)
        sendMessage(M.touchedBoardMessage(pos, newValue))
    }

    const onClickFinishTurn = () => {
        sendMessage(M.finishedTurnMessage())
        setBoardDisabled(true)
    }

    const onSendMessage = (message) => {
        appendNewMessage({type: "sent", message})
        sendMessage(M.textMessage(message))
    }

    const onClickSurrender = useCallback(() => {
        appendNewMessage({type: "system", message: "Você desistiu! Fim de jogo!"})
        sendMessage(M.surrenderMessage(id))
        setBoardDisabled(true)
    }, [id])

    const onRestartGame = () => {
        appendNewMessage({type: "system", message: "Fim de jogo! Reiniciando o tabuleiro!"})
        resetBoardState()
        setBoardDisabled(false)
        sendMessage(M.resetGameMessage())
        setEndOfGame(0)
    }

    return (
        <Layout>
            <div className="flex flex-col h-screen">
                <div className="flex border-red-100 border rounded-lg m-6 w-full h-full shadow-lg">
                    <div className="flex flex-col items-center justify-center content-center w-2/3 bg-gray-300">
                        <Board
                            state={boardState}
                            onClickCell={onClickCell}
                            disabled={boardDisabled || !id || endOfGame}/>

                        <BoardController
                            boardDisabled={boardDisabled}
                            endOfGame={endOfGame}
                            id={id}
                            onClickSurrender={onClickSurrender}
                            onRestartGame={onRestartGame}
                            onClickFinishTurn={onClickFinishTurn}/>
                    </div>
                    <Chat
                        messages={messages}
                        connectionMessage={CONNECTION_STATUS[readyState]}
                        onSendMessage={onSendMessage}/>
                </div>
            </div>
        </Layout>
    )
}

export default Home;