const http = require('http')
const url = require('url')
const ws = require('ws')
const next = require('next')
const { SEND_MESSAGE_ACTION, enteredGameMessage, receivedSystemMessageAction, textMessage, setColorMessage, setPlayerMessage } = require('./lib/messages')

const port = parseInt(process.env.PORT || "3000")
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const colors = ['black', 'white'];

app.prepare().then(() => {

    const server = http.createServer(async (req, res) => {
        const parsedUrl = url.parse(req.url, true)
        await handle(req, res, parsedUrl)
    })

    const wss = new ws.Server({ server })

    wss.broadcast = (message, sender) => {
        wss.clients.forEach((client) => {
            if (client !== sender)
                client.send(message);
        });
    }
    
    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Started server on port ${port}`)
    });

    wss.on('connection', (ws) => {

        ws.on('message', (message) => {
      
            console.log({message});
            wss.broadcast(message, ws);

        });

        if (wss.clients.size >= 2) {

            let i = 1;
            wss.clients.forEach((client) => {
                client.send(setPlayerMessage(i++));
            })

        }

    })
})
