// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function(event) {
	window.addEventListener("keydown", function(event) {
		function search(code) {
			var matches = []

			// Loop through all active usercodes
			for (var i = 0; i < lastData.length; i++) {
				var match = true

				// Compair character to character for as long as the code has chars availible
				for (var t = 0; t < code.length; t++) {
					// If the char in the code does not match the one in the group, we know it can't be the right group
					if (lastData[i].groupcode[t] != code[t]) {
						match = false
					}
				}

				// If all characters we have so far match, add it to the list
				if (match) {
					matches.push(lastData[i])
				}
			}

			console.log(matches);

			// If we have 0 matches we have an issue.
			//
			// Even if we only have 1 out of 3 characters entered yet, if we hit an empty
			// matches array we will not get any matches with additional characters
			if (matches.length == 0) {
				return 0
			}
			// If we only have one, we got the one we were searching for
			else if (matches.length == 1) {
				return matches[0]
			}
			// If we have more than 1, continue searching
			else {
				return 1
			}
		}

		var key = event.key.toUpperCase()
		var codeLetters = document.getElementById("codeLetters").children
		var codeStyle = document.getElementById("codeScreen").style

		// Only HEX keys, and exclude keys such as F5
		if (!/[0-9A-F]/g.test(key) || key.length != 1) {
			return
		}

		switch (keyState) {
			case 0:
				codeLetters[0].innerHTML = key
				codeStyle.display = "block"

				setTimeout(function() {
					codeStyle.backgroundColor = "rgba(70,148,187,1)"
					codeStyle.opacity = 1
					codeStyle.transform = "scale(1)"
				}, 50)

				if (typeof searchResult == "object") {
					codeLetters[1].innerHTML = searchResult[1]
					codeLetters[0].innerHTML = searchResult[1]
				}
				break;
			case 1:
				codeLetters[1].innerHTML = key
				break;
			case 2:
				codeLetters[2].innerHTML = key
				break;
			case 3:
				return
				break;
		}

		var searchResult = search(codeLetters[0].innerHTML + codeLetters[1].innerHTML + codeLetters[2].innerHTML)

		if (searchResult === 0 || searchResult === 1 && keyState == 2) {
			codeStyle.backgroundColor = "rgba(187,70,70,1)"
		}

		if (typeof searchResult == "object") {
			for (var i = 0; i <= 2; i++) {
				codeLetters[i].innerHTML = searchResult.groupcode[i]
			}

			var drinks = {}
			var users = []

			for (var i = 0; i < searchResult.drinks.length; i++) {
				var drink = searchResult.drinks[i]

				if (drinks[drink.type] > 0) {
					drinks[drink.type] += drink.amount
				}
				else {
					drinks[drink.type] = drink.amount
				}

				if (users.indexOf(drink.usercode) == -1) {
					users.push(drink.usercode)
				}
			}

			var html = "<tr><th>Type (" + users.length + " " + (users.length == 1 ? "uniek glas" : "unieke glazen") + ")</th><th>ML</th></tr>"

			for (var type in drinks) {
				html += "<tr><td>" + type + "</td><td>" + drinks[type] + "</td></tr>"
			}

			document.getElementById("codeTable").innerHTML = html

			console.log(users);
			console.log(drinks);

			keyState = 3
		}




		keyState++
	})
})
