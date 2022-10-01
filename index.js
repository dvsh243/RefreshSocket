var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http, {
    cors : {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.get('/', function(req, res){ res.sendFile('index.html') });  // add "CodV Socket Server" file here

//Whenever someone connects this gets executed
io.on('connection', async (socket) => {
    console.log('A user connected', socket.id);
    socket.join(socket.handshake.query.dashboard_id)
    console.log(`added user '${socket.id}' to room '${socket.handshake.query.dashboard_id}'`)
   
//    let roomUsers = await io.in(socket.handshake.query.dashboard_id).fetchSockets()
//    console.log(roomUsers)
    console.log(socket.rooms)
   
    console.log("\n")
   
   //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('refresh', (data) => {
        console.log('recieved -->', data, "in room -->", socket.handshake.query.dashboard_id)

        io.sockets.in(socket.handshake.query.dashboard_id).emit('refresh', {
            'refresher_id' : socket.id,
            'room_id' : socket.handshake.query.dashboard_id
        })  // sending event to all users connected to the room
        console.log(`emitted to room --> '${socket.handshake.query.dashboard_id}'`)
    })

})





http.listen(3001, function(){
   console.log('listening on *:3001');
});