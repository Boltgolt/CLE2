var camera = {
	init: function() {
		setTitle("Scan glas")

		let scanner = new Instascan.Scanner({
			video: document.getElementById("qrVideo")
		})

		scanner.addListener("scan", function(content) {
			if (content.slice(0, 21) == "http://gzd.boltgo.lt/") {
				var usercode = content.slice(21, 31)

				console.log("found usercode ", usercode);
				sendUserCode(usercode)
			}
		})

		Instascan.Camera.getCameras().then(function(cameras) {
			if (cameras.length > 0) {
				scanner.start(cameras[0]);
			} else {
				console.error("No cameras found.");
			}
		}).catch(function(e) {
			console.error(e);
		})
	}
}
