import React from 'react'

const BoardCheck = ({ idx, dark, chip, onClick }) => {
    let color;

    if (chip === 1)
        color = "white"
    else if (chip === 2)
        color = "black"

    return (
        <div className="flex items-center justify-center content-center" style={{width: 62, height: 62, backgroundColor: dark ? "#4DB04D" : "#FFFFFF"}} onClick={() => onClick(idx)}>
            <div className={color && `bg-${color}` + ' rounded-full shadow-sm border border-gray-600'} style={{width: 30, height: 30}}></div> 
        </div>
      );
}

const Board = ({ state, onClickCell }) => {
    return (
        <div className="rounded-sm mb-4 flex flex-wrap" style={{width: 496, height: 496, backgroundColor: '#4db04d'}}>
            {state.map((item, i) => 
                (<BoardCheck key={i} idx={i} dark={(( 9 * i + 8 ) >> 3) & 1} chip={item} onClick={onClickCell} />)
            )}
        </div>
    );
}

export default Board;