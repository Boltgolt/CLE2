var QrCode = require('qrcode-reader');
var fs = require('fs');
var qr = new QrCode();
var Jimp = require("jimp");
while (true){
 
require('child_process').execSync('D:/Users/Amy/Documents/GitHub/CLE2/pi/CommandCam.exe /filename "qrCode.jpg" /delay 1 /devname "Trust Webcam"');
 console.log(new Date().getMilliseconds());

	var buffer = fs.readFileSync('D:/Users/Amy/Documents/GitHub/CLE2/pi/qrCode.jpg');
	Jimp.read(buffer, function(err, image) {
	    if (err) {
	        console.error(err);
	    }
	    var qr = new QrCode();
	    qr.callback = function(err, value) {
	        if (err) {
	            console.error(err);
	        }
	        console.log(value.result);
            console.log(value);
            console.log(new Date().getMilliseconds());
	    };
	    qr.decode(image.bitmap);
	});
}