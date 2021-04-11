import SentMessage from "./SentMessage";
import ReceivedMessage from "./ReceivedMessage";
import SystemMessage from "./SystemMessage";

const ChatMessage = ({ type, message, ts }) => {
    if (type === "sent")
        return <SentMessage message={message} ts={ts} />
    else if (type === "received")
        return <ReceivedMessage message={message} ts={ts} />
    else if (type === "system")
        return <SystemMessage message={message} ts={ts} />

    throw new Error(`Unknown message type ${type}`)
}

export default ChatMessage;