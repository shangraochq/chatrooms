let socketio = require('socket.io'),
	io,
	gusetNumber = 1,
	nickNames = {},
	nameUsed = [],
	currentRoom = {};

exports.listen = function (server) {
	io = socketio.listen(server);
	io.set("log level", 1);

	io.sockets.on('connection', function(socket){
		gusetNumber = assignGuestName(socket, gusetNumber, nickNames, nameUsed);
		joinRoom(socket, 'Lobby');

		handleMessageBroadcasting(socket, nickNames);
		handleNameChangeAttempts(socket, nickNames, nameUsed);
		handleRoomJoining(socket);

		socket.on('rooms', function(){
			socket.emit('rooms', io.sockets.manager.rooms);
		});

		hanleClientDisconnection(socket, nickNames, nameUsed);
	});
}
