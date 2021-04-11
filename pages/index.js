import Board from "../components/Board"
import Button from "../components/Button"
import Layout from "../components/Layout"
import Chat from "../components/Chat"
import { useCallback, useEffect, useState } from "react"
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { helloMessage, finishedTurnMessage, textMessage, HELLO_EVENT, FINISHED_TURN_EVENT, TEXT_MESSAGE_EVENT, touchedBoardMessage, TOUCHED_BOARD_EVENT } from '../lib/messages'
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
  else if (data.event === FINISHED_TURN_EVENT)
    return {
      type: "system",
      message: "Finalizou o turno: " + data.connectionId
    }
}

const appendMessageDate = (message) => ({
  ...message,
  ts: moment()
})

const Home = () => {
  const [boardState, setBoardState] = useState(new Array(BOARD_SIZE).fill(0))
  const [boardDisabled, setBoardDisabled] = useState(false);
  const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:3000/websocket')
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState();

  const resetBoardState = () => setBoardDisabled(new Array(BOARD_SIZE).fill(0));
  const appendNewMessage = (message) => setMessages((oldMessages) => oldMessages.concat(appendMessageDate(message)));
  const updateBoard = useCallback((idx, value) => {
    const newState = [...boardState];
    const newValue = value || (newState[idx] + 1) % 3;
    newState[idx] = newValue;
    setBoardState(newState);

    return newValue;
  }, [boardState]);

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

    if (message.event === HELLO_EVENT) {
      resetBoardState();
      setBoardDisabled(true);
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

  useEffect(() => {
    setBoardDisabled(readyState !== ReadyState.OPEN);
  }, [readyState]);

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
                <Board state={boardState} onClickCell={onClickCell} disabled={boardDisabled || !name} />

                {name ? (
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