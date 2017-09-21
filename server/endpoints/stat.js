// Import needed code
const db = require("../database.js");

// The path to use
const PATH = "/api/stat/"

module.exports = (server) => {
	server.get(PATH + "list", function(req, res, next) {
		db.statistics.findOne({}, (err, result) => {
			delete result._id
			result.success = true

			res.send(200, result);
			next()
		});
	});
}
