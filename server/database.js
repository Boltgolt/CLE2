// Import required modules
const mongo = require("mongodb");

// Create shorthands
const mongoClient = mongo.MongoClient;
const objectId = mongo.ObjectID;

const socket = require("./socket.js");

// The db url to connect to
const URL = "mongodb://localhost:27017/gzdDB";

// Will contain database instance
let db;

/**
 * Generate random unique token
 * @param  {Int}      length   Length of the token to return, max 10
 * @param  {String}   type     Type of token to return, either hex or alpha
 * @param  {Function} callback Will be called with the first argument either the token or false for failure
 */
function genToken(length, type, table, key, callback) {
	let base = 36

	if (type == "hex") {
		base = 16
	}

	let code = Math.round(Math.random() * Math.pow(36, 10)).toString(base).slice(0, length).toUpperCase()

	let query = {}
	query.key = key

	db.collection(table).findOne(query, (err, findData) => {
		if (err) return topCallback(false);

		if (findData) {
			genCode(length, type, callback)
		}
		else {
			callback(code)
		}
	})
}

genToken.ALPHA = "alpha"
genToken.HEX = "hex"

module.exports = {
	users: false,
	groups: false,

	/**
	 * Connect to database server, should always be the first te be called
	 */
	connect: () => {
		// Connect tot he mongo database on the url above
		mongoClient.connect(URL, (err, _db) => {
			// Throw a global error if we can't connect
			if (err) {
				throw err;
			}

			// Let the user know the connection was succesful
			console.log("connection to Mongodb established");

			// Set the global db variable to be used in other functions
			db = _db;

			module.exports.users = db.collection("users")
			module.exports.groups = db.collection("groups")
			module.exports.statistics = db.collection("statistics")

			db.collection("statistics").count({}, (err, result) => {
				if (result == 0) {
					console.log("new stats generated");

					db.collection("statistics").insertOne({
						drinks: {
							total: 0,
							ml: 0
						},
						users: {
							total: 0
						}
					});
				}
			})
		});
	},

	createUser: (usercode, name, topCallback) => {
		genToken(3, genToken.HEX, "groups", "code", function(groupcode) {
			db.collection("users").insertOne({
				name: name,
				usercode: usercode,
				groupcode: groupcode
			}, (err, userResult) => {
				if (err) return topCallback(false);

				db.collection("groups").insertOne({
					groupcode: groupcode,
					users: [{
						leader: true,
						bob: false,
						name: name,
						usercode: usercode,
						amount: 0
					}]
				}, (err, groupResult) => {
					if (err) return topCallback(false);

					topCallback(userResult.ops[0])
				});
			});
		})
	},

	getUser: (usercode, callback) => {
		// Try to find an user with that token assigned
		db.collection("users").findOne({
			usercode: usercode
		}, function(err, user) {
			// Call the callback, the argument will be the user object if the user is found, otherwise it will valuate to false
			callback(user);
		});
	},

	upStat: (stat, add) => {
		let query = {
			$inc: {}
		}

		query["$inc"][stat] = add

		db.collection("statistics").update({}, query, function(err, data) {
			db.collection("statistics").findOne({}, function(err, data) {
			console.log(data);
				socket.pushStats({
					users: {
						total: data.users.total
					},
					drinks: {
						total: data.drinks.total,
						ml: data.drinks.ml
					}
				})
			})
		})
	}
}
