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
			db.users.findAndModify({usercode: req.params.usercode}, { cno: 1 }, {
				$set: {
					groupcode: req.params.groupcode
				}
			}, (err, user) => {
				console.log(user);
				// Let the client know if it didn't work
				if (!user || err) {
					res.send(400, {success: false, error: "Couldn't change group"});
					next();
				}
				else {
					db.groups.update({groupcode: user.value.groupcode}, {
						$pull: {
							users: {
								usercode: user.value.usercode
							}
						},
					}, (err, result) => {
						console.log("goy");
						// Let the client know if it didn't work
						if (!result || err) {
							res.send(400, {success: false, error: "Couldn't change group"});
							next();
						}
						else {
							db.groups.update({groupcode: req.params.groupcode}, {
								$push: {
									users: {
										leader: false,
										bob: false,
										name: user.value.name,
										usercode: user.value.usercode,
										amount: 0
									}
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
									next()
								}
							})
						}
					})
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

	server.get(PATH + "/get/:id", function(req, res, next) {
		if (!req.params.id) {
			res.send(400, {success: false, error: "Missing fields"});
			next();
		}
		else {
			db.groups.findOne({
				"groupcode": req.params.id
			}, (err, result) => {
				console.log(result);

				// Let the client know if it didn't work
				if (!result || err) {
					res.send(400, {success: false, error: "Couldn't change group"});
					next();
				}
				// Handle the response and stop
				else {
					delete result._id
					result.success = true

					res.send(200, result);
					next()
				}
			})
		}
	});
}
