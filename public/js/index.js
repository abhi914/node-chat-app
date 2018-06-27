let socket = io();

  socket.on('connect', function() {

    console.log('Connected to server');

 

    
});




socket.on('disconnect',function()  {

    console.log('Disconnected from server');

});



socket.on('newMessage', function(message) {


    let formattedTime = moment(message.createdAt).format('h: mm a');

    console.log(`New Message ${JSON.stringify(message ,undefined,12)}`);
    let li = jQuery('<li class="message"></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`)

    jQuery('#message').append(li);

});

socket.on('newLocationMessage', function(message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location</a>');
    const formattedTime = moment().format('h: mm a');

    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#message').append(li); 
});



// jQuery here


jQuery('#message-form').on('submit',function(e) { 
    e.preventDefault();

    var messageTextBox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    },function() {

        messageTextBox.val('');

    });
});



let locationButton = jQuery('#send-location');


locationButton.on('click',function() {

    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled','disabled').text('Sending Location');

    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        alert('Unable to fetch location.');
        locationButton.removeAttr('disabled').text('Send Location');
        
    });
});
