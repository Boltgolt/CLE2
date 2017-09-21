// Import needed code
const db = require("../database.js");

// The path to use
const PATH = "/api/group/"

module.exports = (server) => {
	server.post(PATH + "update", function(req, res, next) {
		if (!req.params.usercode || !req.params.groupcode) {
			res.send(400, {success: false, error: "Missing fields"});
			next();
		}
		else {
			db.users.update({usercode: req.params.usercode}, {
				$set: {
					groupcode: req.params.groupcode
				}
			}, (err, result) => {
				// Let the client know if it didn't work
				if (!result || err) {
					res.send(400, {success: false, error: "Couldn't change group"});
					next();
				}
				// Handle the response and stop
				else {
					res.send(200, {success: true});
					next();

					db.upStat("changedGroup", 1)
				}
			})
		}
	});

	server.get(PATH + "list", function(req, res, next) {
		db.groups.find({}, (err, cursor) => {
			// Let the client know if it didn't work
			if (!cursor || err) {
				res.send(400, {success: false, error: "Couldn't change group"});
				next();
			}
			// Handle the response and stop
			else {
				let groups = []

				cursor.each(function(err, item) {
					if (item == null) {
						res.send(200, {success: true, groups: groups});
						next()
					}
					else {
						groups.push({
							groupcode: item.groupcode,
							drinks: item.drinks
						})
					}
				})
			}
		});
	});

	server.post(PATH + "pay", function(req, res, next) {
		if (!req.params.groupcode) {
			res.send(400, {success: false, error: "Missing fields"});
			next();
		}
		else {
			db.users.deleteMany({groupcode: req.params.groupcode}, (err, result) => {
				// Let the client know if it didn't work
				if (!result || err) {
					res.send(400, {success: false, error: "Couldn't delete users"});
					next();
				}

				db.groups.deleteOne({groupcode: req.params.groupcode}, (err, result) => {
					// Let the client know if it didn't work
					if (!result || err) {
						res.send(400, {success: false, error: "Couldn't delete group"});
						next();
					}

					else {
						res.send(200, {success: true});
						next();
					}
				})
			})
		}
	});
}
