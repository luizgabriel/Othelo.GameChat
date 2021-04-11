import Button from "./Button";

const TurnController = ({ boardDisabled, onClickFinishTurn, onClickSurrender }) => {
    return (
        <div className="flex flex-row">
            {boardDisabled ? (
                <span className="text-md text-center">
                    <b>Tabuleiro bloqueado!</b>
                    <br />
                    O seu adversário está jogando. Aguarde...
                </span>
            ): (
                <>
                    <Button onClick={onClickFinishTurn}>
                        Finalizar Turno
                    </Button>
                    <Button onClick={onClickSurrender} color="red" className="ml-4">
                        Desistir
                    </Button>
                </>
            )}
        </div>
    )
}

const EndOfGameController = ({ id, endOfGame, onRestartGame }) => {
    return (
        <>
            {id === endOfGame ? (
                <>
                    <span className="text-md text-center">
                      Você venceu o jogo! Parabéns
                    </span>
                    <Button onClick={onRestartGame}>
                        Reiniciar
                    </Button>
                </>
            ): (
                <span className="text-md text-center">
                  Você perdeu...
                </span>
            )}
        </>
    )
}

const BoardController = ({ id, endOfGame, boardDisabled, onClickFinishTurn, onClickSurrender, onRestartGame }) => {
    return (
        <>
            {id && !endOfGame ? (
                <TurnController boardDisabled={boardDisabled} onClickFinishTurn={onClickFinishTurn} onClickSurrender={onClickSurrender} />
            ): null}

            {endOfGame ? (
                <EndOfGameController id={id} endOfGame={endOfGame} onRestartGame={onRestartGame} />
            ): null}
        </>
    );
}

export default BoardController;