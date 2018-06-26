let socket = io();

  socket.on('connect', function() {

    console.log('Connected to server');

    socket.emit('createMessage', {
        to: 'abhigyan.nayak@gmail.com',
        text:'Hey abhigyan, how are you?'
    });

});



socket.on('disconnect',function()  {

    console.log('Disconnected from server');

});



socket.on('newMessage', function(message) {

    console.log(`New Message ${JSON.stringify(message ,undefined,12)}`);

});
