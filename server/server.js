const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

const app = express();

let server = http.createServer(app);

let io = socketIO(server);



app.use(express.static(path.join(__dirname,'../public')));


io.on('connection',(socket) => {
    console.log('New User Connected');

   

    socket.on('createMessage', (message) => {
        console.log(`${JSON.stringify(message,undefined,2)}`);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime() 
        });
    });


    socket.on('disconnect', () => {
        console.log(`User disconnect`);
    });
});





server.listen(port, (error) => {
    if(error) {
        return console.error(error);
    }
    console.log(`server started at port ${port}`);
});