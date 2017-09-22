const socketio = require("socket.io")

// Import needed code
const db = require("./database.js");

let io
let websiteClients = {}

module.exports = (server) => {
	io = socketio.listen(server.server)

	io.on("connection", function(socket) {
		let client = {
			type: "unknown"
		}

		socket.on("hello", function(data) {
			switch (data.type) {
				case "website":
					client.type = "website"
					websiteClients[socket.id] = socket
					break;
			}
		});

		socket.emit("whodis")

		socket.on("disconnect", function(data) {
			switch (client.type) {
				case "website":
					delete websiteClients[socket.id]
					break;
			}
		});
	})
}

module.exports.pushStats = function(stats) {
	for (var id in websiteClients) {
		websiteClients[id].emit("newdata", stats)
	}
}
