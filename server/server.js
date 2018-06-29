const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');


const port = process.env.PORT || 3000;
const app = express();


let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();



app.use(express.static(path.join(__dirname,'../public')));


io.on('connection',(socket) => {
    console.log('New User Connected');



    socket.on('join',(param,callback) => {
        if(!isRealString(param.name) || !isRealString(param.room)) {
           return  callback('Name and room name are required');
        }


        socket.join(param.room);

        // socket.leave(param.room);
        users.removeUser(socket.id);

        users.addUser(socket.id,param.name,param.room);

        io.to(param.room).emit('updateUserList',users.getUserList(param.room));


        socket.emit('newMessage',generateMessage('Admin','welcome to the chat app'));
        

        socket.broadcast.to(param.room).emit('newMessage', generateMessage('Admin',`${param.name} has Joined`));
    



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
        // console.log(`User disconnect`);

        var user = users.removeUser(socket.id);
        console.log(user);

        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} left`));
        }
    });
});





server.listen(port, (error) => {
    if(error) {
        return console.error(error);
    }
    console.log(`server started at port ${port}`);
});