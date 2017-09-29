// Incluse I2C lib
#include <Wire.h>

// Define the I2C to listen for the pi on
#define SLAVE_ADDRESS 0x04

void setup(void) {
  Serial.begin(9600);

  // Start listening for I2C comm
  Wire.begin(SLAVE_ADDRESS);

  // Define callbacks for i2c communication
  Wire.onReceive(receiveData);
  Wire.onRequest(sendData);

  Serial.println("Gestart");
}

void loop(void) {

}

// Receives data from the pi but discards it as we don't need it
// We need to keep receiveing the data because the I2C connection will close otherwise
void receiveData(int byteCount) {
  while (Wire.available()) {
    Serial.println(Wire.read());
    Serial.println("Gestart");
  }
}

// When we're allowed to send data
void sendData() {
    Wire.write(2);
}
