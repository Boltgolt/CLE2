const socketio = require("socket.io")

// Import needed code
const db = require("./database.js");

let io

let websiteClients = {}
let appClients = {}

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
				case "app":
					client.type = "app"
					client.usercode = false
					break;
				case "pi":
					// Verify this is a real pi
					if (data.secret != "b47135bc68aec5c79038ab51519eebc35c29f5515481faabfbf9eac9ed56b") {
						console.log("illegal pi with sig ", data.secret);
						return
					}

					console.log("pi connected");
					client.type = "pi"
					break;
			}
		})

		socket.on("stream", function(data) {
			if (client.type != "pi") {
				return
			}

			if (appClients[data.usercode]) {
				appClients[data.usercode].emit("stream", {
					type: data.type,
					amount: data.amount
				})
			}
		})

		socket.on("passUser", function(data) {
			client.usercode = data
			appClients[client.usercode] = socket
		})

		socket.emit("whodis")

		socket.on("disconnect", function(data) {
			switch (client.type) {
				case "website":
					delete websiteClients[socket.id]
					break;
				case "app":
					delete appClients[client.usercode]
					break;
				case "pi":
					console.log("lost the pi!");
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
