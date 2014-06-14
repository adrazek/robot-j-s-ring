// connect to the socket server
var socket = io.connect(); 

socket.on('info', function (data) {
	console.log(data);
});
