// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function(event) {
	// Call to update the stats in DOM
	function update(usersNum, drinksNum, drinksMl) {
		document.getElementById("statsUsersNum").innerHTML = usersNum
		document.getElementById("statsDrinksNum").innerHTML = drinksNum
		document.getElementById("statsDrinksLiter").innerHTML = Math.round(drinksMl / 100) / 10
	}

	// Start socket connection
	var socket = io()

	// Ident when server asks us to
	socket.on("whodis", function() {
		socket.emit("hello", {
			type: "website"
		})
	})

	// Update the data when a new one has been sent
	socket.on("newdata", function(data) {
		console.debug("New stats: ", data);
		
		update(data.users.total, data.drinks.total, data.drinks.ml)
	})

	// Fetch a fresh copy fromt the api immediatly
	fetch("/api/stat/list").then(function(response) {
		return response.json();
	}).then(function(json) {
		update(json.users.total, json.drinks.total, json.drinks.ml)
	})
})
