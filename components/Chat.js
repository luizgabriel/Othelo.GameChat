import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatFooter from "./ChatFooter";
import {useEffect, useRef} from "react";

const Chat = ({ messages, connectionMessage, onSendMessage }) => {
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages]);

    return (
        <div className="w-1/3 border-l border-gray-400 flex flex-col bg-white rounded-r rounded-sm">
            <ChatHeader />
            <div className="flex-auto overflow-y-auto p-5 space-y-4" style={{maxHeight: 'calc(100vh - 250px)'}} ref={scrollRef}>
                {messages.map((message, i) => (
                    <ChatMessage key={i} {...message} />
                ))}
            </div>

            <ChatFooter connectionMessage={connectionMessage} onSendMessage={onSendMessage} />
        </div>
    );
}

export default Chat;