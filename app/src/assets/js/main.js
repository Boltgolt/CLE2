function setTitle(title) {
	document.getElementById("headerTitle").innerHTML = title
}

document.addEventListener("DOMContentLoaded", function(event) {
	let drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector(".mdc-temporary-drawer"))

	document.querySelector(".menuHamburger").addEventListener("click", function() {
		drawer.open = true
	})

	if (!localStorage.usercode) {
		camera.init()
	}
 })
