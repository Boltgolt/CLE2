var group = {
	setBob: function(id, state) {
		fetch(HOST + "user/bob/" + localStorage.groupcode).then(function(response) {
			return response.json();
		}).then(function(json) {

		}).catch(function(err) {})
	},

	update: function() {
		fetch(HOST + "group/get/" + localStorage.groupcode).then(function(response) {
			return response.json();
		}).then(function(json) {
			document.getElementById("groupList").innerHTML = ""

			for (var i = 0; i < json.users.length; i++) {
				var role = {
					clas: "",
					icon: "account"
				}

				if (json.users[i].leader) {
					role = {
						clas: "leader",
						icon: "trophy"
					}
				}
				if (json.users[i].bob) {
					role = {
						clas: "bob",
						icon: "car"
					}
				}

				var li = document.createElement("li")
				li.className = "mdc-list-item " + role.clas

				li.innerHTML = `
					<span class="mdc-list-item__start-detail">
						<i class="mdi mdi-${role.icon}" aria-hidden="true"></i>
					</span>
					<span class="mdc-list-item__text">
						Jan
						<span class="mdc-list-item__text__secondary">€${(Math.round(json.users[i].amount * .008 * 100) / 100).toString().replace(".", ",")}</span>
					</span>
					<i class="mdc-list-item__end-detail mdi mdi-pencil" onclick="group.setBob('${json.users[i].usercode}', ${(json.users[i].bob ? "false" : "true")})"></i>`

				document.getElementById("groupList").appendChild(li)
			}
		}).catch(function(err) {
			console.error("Couldn't fetch groupdata");
		})
	}
}

setInterval(function() {
	if (localStorage.groupcode) {
		group.update()
	}
}, 2000)
