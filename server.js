const http = require('http')
const url = require('url')
const ws = require('ws')
const next = require('next')
const B = require("./lib/board");
const M = require('./lib/messages')

const port = parseInt(process.env.PORT || "3000")
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()


let BOARD = B.generateInitial();
const updateServerBoard = (updateFn) => BOARD = updateFn(BOARD)

app.prepare().then(() => {

    const server = http.createServer(async (req, res) => {
        const parsedUrl = url.parse(req.url, true)
        await handle(req, res, parsedUrl)
    })

    const wss = new ws.Server({server})

    wss.broadcast = (message, sender) => {
        console.log({broadcast: message});
        wss.clients.forEach((client) => {
            if (client !== sender)
                client.send(message);
        });
    }

    wss.broadcastFn = (messageFn, sender) => {
        wss.clients.forEach((client) => {
            if (client !== sender) {
                const message = messageFn();
                console.log({broadcast: message});
                client.send(message);
            }
        });
    }

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Started server on port ${port}`)
    });

    wss.on('connection', (ws) => {

        ws.on('message', (message) => {

            const data = JSON.parse(message);

            if (data.event === M.HELLO_EVENT || data.event === M.RESET_GAME_EVENT)
                updateServerBoard(B.generateInitial)
            else if (data.event === M.TOUCHED_BOARD_EVENT)
                updateServerBoard(B.update(data.pos, data.value))
            else if (data.event === M.SURRENDER_EVENT) {
                updateServerBoard(B.generateInitial)
                wss.broadcast(M.endOfGameMessage(data.id === 1 ? 2 : 1))
            }

            wss.broadcast(message, ws);

            if (B.isFinished(BOARD)) {
                wss.broadcast(M.endOfGameMessage(B.getWinnerId(BOARD)))
            }

        });

        if (wss.clients.size >= 2) {
            let i = 0;
            wss.broadcastFn(() => M.setPlayerMessage( 1 + i++ % 2));
        }

    })
})
