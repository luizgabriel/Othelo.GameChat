import Board from "../components/Board"
import Button from "../components/Button"
import Layout from "../components/Layout"
import Chat from "../components/Chat"
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from "react"
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { helloMessage, finishedTurnMessage, textMessage, touchedBoardMessage, HELLO_EVENT, FINISHED_TURN_EVENT, TEXT_MESSAGE_EVENT, TOUCHED_BOARD_EVENT, SET_PLAYER_EVENT } from '../lib/messages'
import moment from "moment"
import 'moment/locale/pt-br'

const CONNECTION_STATUS = {
  [ReadyState.CONNECTING]: 'Conectando',
  [ReadyState.OPEN]: 'Aberta',
  [ReadyState.CLOSING]: 'Fechando',
  [ReadyState.CLOSED]: 'Fechada',
  [ReadyState.UNINSTANTIATED]: 'Não iniciada',
};

const BOARD_SIZE = 64;

const parsedSocketMessage = (socketMessage) => {
  if (!socketMessage || !socketMessage.data) return null;
  return JSON.parse(socketMessage.data);
}

const fromSocketToMessage = (data) => {
  if (data.event === TEXT_MESSAGE_EVENT)
    return {
      type: "received",
      message: data.message
    }
  else if (data.event === HELLO_EVENT)
    return {
      type: "system",
      message: "Seu adversário entrou no jogo: " + data.name
    }
}

const appendMessageDate = (message) => {
  return {
    ...message,
    ts: moment(),
  };
}

const generateInitialBoard = () => new Array(BOARD_SIZE).fill(0)

export const getServerSideProps = () => {
  const socketUrl = process.env.SOCKET_URL || 'ws://localhost:3000/websocket';

  return {
    props: { socketUrl }
  }
};

const Home = ({ socketUrl }) => {
  const [boardState, setBoardState] = useState(generateInitialBoard())
  const [boardDisabled, setBoardDisabled] = useState(true)
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl)
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState();
  const [id, setId] = useState(0);

  const resetBoardState = () => setBoardDisabled(generateInitialBoard());
  const appendNewMessage = (message) => setMessages((oldMessages) => oldMessages.concat(appendMessageDate(message)));
  const updateBoard = useCallback((idx, value) => {
    const newState = [...boardState];
    const currentValue = boardState[idx];
    let newValue = value;
    if (typeof value === 'undefined') newValue = (currentValue !== id) ? id : 0;

    newState[idx] = newValue;
    setBoardState(newState);

    return newValue;
  }, [boardState, id]);

  useEffect(() => {
    if (!name) {
      const newName = prompt("Qual o seu nome?");
      setName(newName);

      if (newName) {
        sendMessage(helloMessage(newName))
        appendNewMessage({
          type: "system",
          message: "Você entrou no jogo: " + newName
        });
      }
    }

  }, [name]);

  useEffect(() => {
    const message = parsedSocketMessage(lastMessage);
    if (!message) return;

    if (message.event === SET_PLAYER_EVENT) {
      resetBoardState();
      setId(message.id);
      if (message.id === 2) // player 2 starts
        setBoardDisabled(false);

    } else if (message.event === FINISHED_TURN_EVENT) {
      setBoardDisabled(false);
    } else if (message.event === TOUCHED_BOARD_EVENT) {
      updateBoard(message.pos, message.value)
    }

    const textMessage = fromSocketToMessage(message);
    if (textMessage)
      appendNewMessage(textMessage);

  }, [lastMessage]);

  const onClickCell = (idx) => {
    sendMessage(touchedBoardMessage(idx, updateBoard(idx)))
  };

  const onClickFinishTurn = useCallback(() => {
    sendMessage(finishedTurnMessage());
    setBoardDisabled(true);
  }, [boardDisabled])

  const onSendMessage = useCallback((message) => {
    appendNewMessage({
      type: "sent",
      message
    })
    sendMessage(textMessage(message))
  })

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        <div className="flex border-red-100 border rounded-lg m-6 w-full h-full shadow-lg">
            <div className="flex flex-col items-center justify-center content-center w-2/3 bg-gray-300">
                <Board state={boardState} onClickCell={onClickCell} disabled={boardDisabled || !name || !id} />

                {name && id ? (
                  <div className="flex flex-row">
                    {boardDisabled ? (
                      <span className="text-md text-center">
                        <b>Tabuleiro bloqueado!</b>
                        <br /> 
                        O seu adversário está jogando. Aguarde...
                      </span>
                    ): (
                      <Button onClick={onClickFinishTurn}>
                        Finalizar Turno
                      </Button>
                    )}
                  </div>
                ): null}
                
            </div>
            <Chat 
              messages={messages}
              connectionMessage={CONNECTION_STATUS[readyState]}
              onSendMessage={onSendMessage} />
        </div>
      </div>
    </Layout>
  )
}

export default Home;