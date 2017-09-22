
const HOST = "http://localhost:8080/"

// Init socket
const socket = require("socket.io-client")(HOST);

socket.on("connect", function() {
	console.log("connected to socket");
})

socket.on("whodis", function(data) {
	socket.emit("hello", {
		type: "pi",
		secret: "b47135bc68aec5c79038ab51519eebc35c29f5515481faabfbf9eac9ed56b"
	})

	console.log("sending auth");
})

socket.on("disconnect", function() {
	console.log("lost connection to socket!")
})

setTimeout(function () {
	socket.emit("stream", {
		usercode: "012345678",
		type: "Bier",
		amount: 10
	})
	console.log("emet");
}, 1000);
