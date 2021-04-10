const http = require('http')
const url = require('url')
const socketIO = require('socket.io')
const next = require('next')

const port = parseInt(process.env.PORT || "3000")
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = http.createServer(async (req, res) => {
        const parsedUrl = url.parse(req.url, true)
        await handle(req, res, parsedUrl)
    })

    const io = socketIO(server)
    
    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Started server on port ${port}`)
    })

    io.on('connect', (socket) => {
        socket.emit('now', {
            message: 'zeit'
        })
    })
})
