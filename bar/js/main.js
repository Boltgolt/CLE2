var lastData = []
var keyState = 0

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function(event) {
	updateList();

	// Fetch a fresh copy fromt the api immediatly
	fetch("/api/group/list").then(function(response) {
		return response.json();
	}).then(function(json) {
		lastData = json.groups
	
	})
})
