let socket = io();

function scrollToBottom() {
    //selectors
    var messages = jQuery('#messages');
    var newMessage = message.children('li:last-child');
    //height
    var clientHeight = message.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessage = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        console.log(`should scroll to bottom`);
        messges.scrollTop(scrollHeight);
    }

}

  socket.on('connect', function() {

    // console.log('Connected to server');    
    let params = jQuery.deparam(window.location.search);

    socket.emit('join',params, function(error) {
        
        if(error) {
            alert(error);
            window.location.href = "/";
        }
         else{
             console.log("No error");

        }

    });
});








socket.on('newMessage', function(message) {


    let formattedTime = moment(message.createdAt).format('h: mm a');

    console.log(`New Message ${JSON.stringify(message ,undefined,12)}`);
    let li = jQuery('<li class="message"></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`)

    jQuery('#message').append(li);

    // scrollToBottom();

});

socket.on('newLocationMessage', function(message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location</a>');
    const formattedTime = moment().format('h: mm a');

    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#message').append(li); 

    // scrollToBottom();
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



socket.on('disconnect',function()  {

    console.log('Disconnected from server');

});



socket.on('updateUserList', function(user) {
    console.log(`user list ${user}`);

    var ol = jQuery('<ol></ol>');

    user.forEach(function(user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});