// Import needed code
const db = require("../database.js");

// The path to use
const PATH = "/user/"

module.exports = (server) => {
	server.post(PATH + "create", function functionName(req, res, next) {
		if (!req.params.usercode) {
			res.send(400, {success: false, error: "Missing fields"});
			next();
		}
		else {
			db.createUser(req.params.usercode, function(data) {
				if (data === false) {
					res.send(400, {success: false});
				}
				else {
					data.success = true

					res.send(200, {
						name: data.name,
						usercode: data.usercode,
						groupcode: data.groupcode,
						success: true
					});

					db.upStat("users.total", 1)
				}

				next();
			})
		}
	});
}
