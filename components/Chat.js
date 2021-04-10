const ChatHeader = () => {
    return (
        <div class="flex-none h-20 flex flex-row justify-between items-center p-5 border-b">
            <div class="flex flex-col space-y-1">
                <strong>Jogue Othello!</strong>
                <span class="text-sm outline-none border-b border-dashed text-black color-gray-600">Engenharia de Computação IFCE</span>
            </div>
        </div>
    );
}

const ReceivedMessage = ({message}) => {
    return (
        <div class="flex flex-row space-x-2">
            <div class="flex flex-col">
                <div class="bg-gray-200 rounded p-5">
                    {message}
                </div>
                <div class="text-sm text-gray-600">4hr ago</div>
            </div>
        </div>
    );
}

const SystemMessage = ({ message }) => {
    return (
        <div class="flex flex-row justify-center text-sm text-gray-600">
            {message}
        </div>
    );
}

const SentMessage = ({ message }) => {
    return (
        <div class="flex flex-row space-x-2 flex-row-reverse space-x-reverse">
            <div class="flex flex-col">
                <div class="bg-blue-100 rounded p-5">
                    {message}
                </div>
                <div class="text-sm text-gray-600">5hr ago</div>
            </div>
        </div>
    );
}

const Chat = () => {
    return (
        <div class="w-1/3 border-l border-gray-400 flex flex-col bg-white rounded-r rounded-sm">
            <ChatHeader />
            <div class="flex-auto overflow-y-auto p-5 space-y-4">
                <ReceivedMessage message="Some message text" />
                <SystemMessage message="You assigned this conversation to yourself 5d ago" />
                <SentMessage message="Some message text"/>
            </div>

            <div class="flex-none h-20 p-4 pt-0">
                <textarea class="w-full h-full outline-none border focus:border-blue-600 hover:border-blue-600 rounded p-2 shadow-lg placeholder-gray-600" placeholder="Envie uma mensagem para o seu adversário..."></textarea>
            </div>
        </div>
    );
}

export default Chat;