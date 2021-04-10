import Board from "../components/Board"
import Button from "../components/Button"
import Layout from "../components/Layout"
import Chat from "../components/Chat"
import { useCallback, useEffect, useState } from "react"
import useWebSocket, { ReadyState } from 'react-use-websocket'

const connectionStatus = {
  [ReadyState.CONNECTING]: 'Connecting',
  [ReadyState.OPEN]: 'Open',
  [ReadyState.CLOSING]: 'Closing',
  [ReadyState.CLOSED]: 'Closed',
  [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
};

const Home = () => {
  const [boardState, setBoardState] = useState(new Array(64).fill(0))
  const [boardDisabled, setBoardDisabled] = useState(false);
  const { sendMessage, lastMessage, readyState } = useWebSocket('wss://localhost:3000/socket.io')

  const onClickCell = useCallback((idx) => {
    const newState = [...boardState];
    newState[idx] = (newState[idx] + 1) % 3;
    setBoardState(newState);
  }, [boardState])

  const onClickReset = () => {
    setBoardState(new Array(64).fill(0));
  }

  const onClickFinishTurn = () => {
    console.log('finish turn');
    sendMessage('finish-turn');
  }

  useEffect(() => {
    setBoardState(readyState !== ReadyState.OPEN);
  }, [readyState]);

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        <div className="flex border-red-100 border rounded-lg m-6 w-full h-full shadow-lg">
            <div className="flex flex-col items-center justify-center content-center w-2/3 bg-gray-300">
                <Board state={boardState} onClickCell={onClickCell} disabled={boardDisabled} />

                <div className="flex flex-row">
                  {connectionStatus[readyState]}
                  <Button onClick={onClickFinishTurn}>
                    Finalizar Turno
                  </Button>
                  <Button onClick={onClickReset}>
                    Resetar Jogo
                  </Button>
                </div>
            </div>
            <Chat />
        </div>
      </div>
    </Layout>
  )
}

export default Home;