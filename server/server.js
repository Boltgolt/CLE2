// Import required modules
const restify = require("restify");
const restifyPlugins = require("restify-plugins");

// Import needed code
const db = require("./database.js")

// Setup the basic REST server
let server = restify.createServer({
	name: "god-zei-drank"
});

// Connect to the Mongodb
db.connect();

// Enable POST data as params
server.use(restifyPlugins.bodyParser());

// Start listening for requests
require("./endpoints/drink.js")(server)
require("./endpoints/group.js")(server)
require("./endpoints/stat.js")(server)
require("./endpoints/user.js")(server)

// Open the port and start listening for incomming connections
server.listen(8080, function() {
	console.log(server.name + " ready for incomming connections");
});
