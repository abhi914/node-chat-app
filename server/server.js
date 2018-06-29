const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');


const port = process.env.PORT || 3000;
const app = express();


let server = http.createServer(app);
let io = socketIO(server);



app.use(express.static(path.join(__dirname,'../public')));


io.on('connection',(socket) => {
    console.log('New User Connected');

    socket.emit('newMessage',generateMessage('Admin','welcome to the chat app'));
        

    socket.broadcast.emit('newMessage', generateMessage('Admin','New User Joined'));


    socket.on('join',(param,callback) => {
        if(!isRealString(param.name) || !isRealString(param.room)) {
            callback('Name and room name are required');
        }


        callback();

    });

    socket.on('createMessage', (message,callback) => {
        console.log(`${JSON.stringify(message,undefined,2)}`);

        callback();

        io.emit('newMessage',generateMessage(message.from,message.text)); 

        // socket.broadcast.emit('newMessage',generateMessage(message.from,message.text) );
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage',generateLocationMessage('User',coords.latitude,coords.longitude));
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