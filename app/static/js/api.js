document.addEventListener("DOMContentLoaded", function(event) {
	var socket = io()

	socket.on("whodis", function() {
		socket.emit("hello", {
			type: "website"
		})
	});

	socket.on("newdata", function(data) {
		document.getElementById("statsUsersNum") = data.users.total
		document.getElementById("statsDrinksNum") = data.drinks.total
		document.getElementById("statsDrinksMl") = data.drinks.ml
	});
})
