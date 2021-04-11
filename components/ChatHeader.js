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

export default ChatHeader;