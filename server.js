let express = require('express')
let app = express()
let http = require('http').createServer(app)
let io = require('socket.io')(http)
let path = require('path')

if(process.env.NODE_ENV === "production"){
      app.use(express.static(path.join(__dirname, '/client/build')))
      app.get('/', (req, res, next) => res.sendFile(path.resolve(__dirname, "client", "build", "index.html")))
}

io.on('connection', (socket)=> {
      socket.on('canvas-data', (data)=> {
            socket.broadcast.emit('canvas-data', data)
      })
})

let PORT = process.env.PORT || 5000
http.listen(PORT, () => {
    console.log(`Started on : ${PORT}`)
})