const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage} = require('./utils/message');


const port = process.env.PORT || 3000;
const app = express();


let server = http.createServer(app);
let io = socketIO(server);



app.use(express.static(path.join(__dirname,'../public')));


io.on('connection',(socket) => {
    console.log('New User Connected');

    socket.emit('newMessage',generateMessage('admin','welcome to the chat app'));
        

    socket.broadcast.emit('newMessage', generateMessage('admin','New User Joined'));



    socket.on('createMessage', (message,callback) => {
        console.log(`${JSON.stringify(message,undefined,2)}`);

        callback();




        io.emit('newMessage',generateMessage(message.from,message.text)); 

        // socket.broadcast.emit('newMessage',generateMessage(message.from,message.text) );
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
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