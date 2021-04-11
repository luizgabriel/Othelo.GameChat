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

export default SentMessage;