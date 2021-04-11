import React from 'react'

const BoardCheck = ({ idx, dark, chip, disabled, onClick }) => {
    let color;

    if (chip === 1)
        color = "white"
    else if (chip === 2)
        color = "black"

    let background;
    if (disabled)
        background = (dark ? "#A0A0A0" : "#EBEBEB")
    else
        background = (dark ? "#4DB04D" : "#FFFFFF")

    const onClickButton = () => {
        if (!disabled)
            onClick(idx);
    }

    return (
        <div className="flex items-center justify-center content-center" style={{width: 62, height: 62, backgroundColor: background}} onClick={onClickButton}>
            <div className={color && `bg-${color}` + ' rounded-full shadow-sm border border-gray-600'} style={{width: 30, height: 30}}></div> 
        </div>
      );
}

const Board = ({ state, disabled, onClickCell }) => {
    let classes = "rounded-sm mb-4 flex flex-wrap";
    if (disabled)
        classes += " cursor-not-allowed";

    return (
        <div className={classes} style={{width: 496, height: 496}}>
            {state.map((item, i) => 
                (<BoardCheck key={i} idx={i} dark={(( 9 * i + 8 ) >> 3) & 1} chip={item} disabled={disabled} onClick={onClickCell} />)
            )}
        </div>
    );
}

export default Board;