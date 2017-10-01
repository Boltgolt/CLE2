var HOST = "http://localhost/api/"

var drawer

function setTitle(title) {
	document.getElementById("headerTitle").innerHTML = title
}

function switchSection(id) {
	for (var i = 0; i < document.getElementsByClassName("section").length; i++) {
		document.getElementsByClassName("section")[i].style.display = "none"
	}

	document.getElementById(id).style.display = "block"
}

document.addEventListener("DOMContentLoaded", function(event) {
	drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector(".mdc-temporary-drawer"))

	document.querySelector(".menuHamburger").addEventListener("click", function() {
		drawer.open = true
	})

	if (!localStorage.usercode) {
		// camera.init()
	}

	document.getElementById("drawerGroup").addEventListener("click", function(event) {
		group.update()
		
		setTitle("Groep")
		switchSection("group")
		drawer.open = false
	 })
 })

 //= camera.js
 //= group.js
