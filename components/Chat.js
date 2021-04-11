import { useRef } from "react";

const ChatHeader = () => {
    return (
        <div className="flex-none h-20 flex flex-row justify-between items-center p-5 border-b">
            <div className="flex flex-col space-y-1">
                <strong>Jogue Othello!</strong>
                <span className="text-sm outline-none border-b border-dashed text-black color-gray-600">Engenharia de Computação IFCE</span>
            </div>
        </div>
    );
}

const ReceivedMessage = ({ message, ts }) => {
    return (
        <div className="flex flex-row space-x-2">
            <div className="flex flex-col">
                <div className="bg-gray-200 rounded py-2 px-5">
                    {message}
                </div>
                {ts ? <div className="text-xs text-gray-400">{ts.format('HH:mm')}</div> : null}
            </div>
        </div>
    );
}

const SystemMessage = ({ message }) => {
    return (
        <div className="flex flex-row justify-center text-sm text-gray-600">
            {message}
        </div>
    );
}

const SentMessage = ({ message, ts }) => {
    return (
        <div className="flex flex-row space-x-2 flex-row-reverse space-x-reverse">
            <div className="flex flex-col">
                <div className="bg-blue-100 rounded py-2 px-5">
                    {message}
                </div>
                {ts ? <div className="text-xs text-gray-400">{ts.format('HH:mm')}</div> : null}
            </div>
        </div>
    );
}

const ChatMessage = ({ type, message, ts }) => {
    if (type === "sent")
        return <SentMessage message={message} ts={ts} />
    else if (type === "received")
        return <ReceivedMessage message={message} ts={ts} />
    else if (type === "system")
        return <SystemMessage message={message} ts={ts} />

    throw new Error(`Unknown message type ${type}`)
}

const Chat = ({ messages, connectionMessage, onSendMessage }) => {
    const inputRef = useRef();
    const getCurrentInputText = () => inputRef.current.value;

    const sendMessage =() => {
        onSendMessage(getCurrentInputText());
        inputRef.current.value = "";
    };

    const onKeyUp = (e) => {
        if (e.key === 'Enter')
            sendMessage();
        return true;
    }

    return (
        <div className="w-1/3 border-l border-gray-400 flex flex-col bg-white rounded-r rounded-sm">
            <ChatHeader />
            <div className="flex-auto overflow-y-auto p-5 space-y-4">
                {messages.map((message, i) => (
                    <ChatMessage key={i} {...message} />
                ))}
            </div>

            <div className="flex-none h-25 p-4 pt-0">
                <span className="text-gray-400 text-sm">Status da Conexão: {connectionMessage}</span>    
                <div className="flex flex-row">
                    <input type="text" 
                        ref={inputRef}
                        onKeyUp={onKeyUp}
                        className="w-full outline-none border focus:border-blue-600 hover:border-blue-600 rounded px-4 py-4 shadow-lg placeholder-gray-500 resize-none" 
                        placeholder="Envie uma mensagem para o seu adversário..." rows="1"/>

                    <button onClick={sendMessage} className="p-2 w-10 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
                
            </div>
        </div>
    );
}

export default Chat;