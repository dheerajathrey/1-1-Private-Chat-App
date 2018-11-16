var express = require('express')
var app = express()
// var http = require('http')
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)

var directory = "/"

server.listen(process.env.PORT || 3000)

console.log("Great! The server is up and running!\n")

console.log("Please goto localhost:3000" + directory)


app.get('/', function(req, res){
	res.sendFile(__dirname + "/index.html")
});


// console.log('flag1')


// console.log('flag2')

userList = []
connectionList = []
// console.log('flag3')

var idNo = 1

var userIdDict = {}

io.sockets.on('connection', function(socket) {
	// console.log('flag4')
	connectionList.push(socket)
	console.log("%s sockets connected", connectionList.length)


	socket.on('disconnect', function(data){
		// if(!socket.username) return;
		userList.splice(userList.indexOf(socket.username), 1)
		updateUsernames("d")

		var socketIndex = connectionList.indexOf(socket)
		connectionList.splice(socketIndex, 1)
		console.log("Socket disconnected, %s sockets connected", connectionList.length)
	})

	socket.on('send message', function(data){
		// console.log(data)
		io.sockets.emit('new message', data);
	});



	socket.on('new user', function(data, callback){
		callback(true);

		userIdDict[data] = idNo
		io.sockets.emit('update idNo', {id : idNo, userDict : userIdDict})
		idNo++

		console.log("userIdDict " + userIdDict)
		console.log('hi')
		console.log(data)
		socket.username = data;
		userList.push(socket.username)
		console.log('lenght of data ' + userList.length)
		updateUsernames("n")

	})

	function updateUsernames(k) {
		io.sockets.emit('get users', {list: userList, val: k})	
	};

});