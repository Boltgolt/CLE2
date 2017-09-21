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

// Start listening for API requests
require("./endpoints/drink.js")(server)
require("./endpoints/group.js")(server)
require("./endpoints/stat.js")(server)
require("./endpoints/user.js")(server)

// Allow any app trafic
server.get(/\/app\/?.*/, restifyPlugins.serveStatic({
	directory: __dirname + "/..",
	default: "/index.html"
}))

// Serve index at /
server.get("/", restifyPlugins.serveStatic({
	directory: __dirname + "/site",
	default: "/index.html"
}))

// Server static site assets
server.get("/site", restifyPlugins.serveStatic({
	directory: __dirname + "/site"
}))

// Redirect QR scans to the app
server.get(/\/[0-9A-F]{10}/, function(req, res, next) {
	res.redirect("/app#" + req.url.slice(1), next);
})

// Open the port and start listening for incomming connections
server.listen(8080, function() {
	console.log(server.name + " ready for incomming connections");
})
