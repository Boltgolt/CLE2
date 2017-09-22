// Import needed code
const db = require("../database.js");

// The path to use
const PATH = "/api/drink/"

module.exports = (server) => {
	server.put(PATH + "add", function(req, res, next) {
		// Check if all fields are there and fail if they aren't
		if (!req.params.usercode || !req.params.drink || !req.params.amount) {
			res.send(400, {success: false, error: "Missing fields"});
			next();
		}
		// Check if streak is an actual number, fail otherwise
		else if (isNaN(req.params.amount)) {
			res.send(400, {success: false, error: "Invalid amount"});
			next();
		}
		else {
			db.getUser(req.params.usercode, (user) => {
				// If we couldn't find a user with that token, it's invalid
				if (!user) {
					res.send(400, {success: false, error: "Invalid usercode"});
					next();
				}
				// Otherwise we have an authenticated client
				else {
					let amount = parseInt(req.params.amount)
					// Update the streak with the data provided
					db.groups.update({groupcode: user.groupcode}, {
						$push: {
							drinks: {
								type: req.params.drink,
								amount: amount,
								timestamp: new Date().getTime(),
								usercode: req.params.usercode
							}
						}
					}, (err, result) => {
						// Let the client know if it didn't work
						if (!result || err) {
							res.send(400, {success: false, error: "Couldn't add drink"});
							next();
						}
						// Handle the response and stop
						else {
							res.send(200, {success: true});
							next

							db.upStat("drinks.ml", amount)

							// Give all clients time to catch up to the last change
							setTimeout(function () {
								db.upStat("drinks.total", 1)
							}, 150)
						}
					})
				}
			})
		}
	});
}
