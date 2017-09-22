var sendUserCode

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function(event) {
	sendUserCode = function(usercode) {
		socket.emit("passUser", usercode)
	}

	// Start socket connection
	var socket = io()

	var streamTimeout

	// Ident when server asks us to
	socket.on("whodis", function() {
		socket.emit("hello", {
			type: "app"
		})
	})

	function closeStream() {
		document.getElementById("stream").style.opacity = 0
		document.getElementById("stream").style.transform = "scale(.5)"

		setTimeout(function() {
			document.getElementById("stream").style.display = "none"
		}, 360)
	}

	socket.on("stream", function(data) {
		clearTimeout(streamTimeout)

		document.getElementById("streamDrink").innerHTML = data.type
		document.getElementById("streamAmount").innerHTML = data.amount

		document.getElementById("stream").style.display = "block"

		setTimeout(function() {
			document.getElementById("stream").style.opacity = 1
			document.getElementById("stream").style.transform = "scale(1)"
		}, 100)

		streamTimeout = setTimeout(function() {
			closeStream()
		}, 5100);
	})

	document.getElementById("stream").addEventListener("click", function() {
		clearTimeout(streamTimeout)
		closeStream()
	})
})
