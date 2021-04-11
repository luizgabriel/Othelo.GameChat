import { useRef } from "react";

const ChatFooter = ({ connectionMessage, onSendMessage }) => {
    const inputRef = useRef();
    const getCurrentInputText = () => inputRef.current.value;

    const sendMessage =() => {
        const currentInputText = getCurrentInputText().trim();
        if (currentInputText.length > 0)
            onSendMessage(getCurrentInputText());
        inputRef.current.value = "";
    };

    const onKeyUp = (e) => {
        if (e.key === 'Enter')
            sendMessage();
        return true;
    }

    return (
        <div className="flex-none h-25 p-4 pt-0 mt-auto">
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
    );
}

export default ChatFooter;