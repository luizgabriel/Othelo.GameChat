import {useState} from "react";

const SystemMessage = ({ message, ts }) => {
    const [visibleTime, setVisibleTime] = useState(false);

    return (
        <div className="flex flex-row justify-center text-sm text-gray-600 content-center items-center" onMouseEnter={() => setVisibleTime(true)} onMouseLeave={() => setVisibleTime(false)}>
            <span className="text-gray-400 text-xs transition-all mr-2" style={{width: visibleTime ? 'auto' : 0, opacity: visibleTime ? 1 : 0}}>({ts.format('HH:mm')})</span>
            <span>{message}</span>
        </div>
    );
}

export default SystemMessage;