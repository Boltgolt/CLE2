// Incluse I2C lib
#include <Wire.h>
 int buttonValue = 0;
// Define the I2C to listen for the pi on
#define SLAVE_ADDRESS 0x04
int pompPin = A0;
int buttonPin = 2;
bool pompAllow;

void setup(void) {
  Serial.begin(9600);
  pinMode(A0, OUTPUT);
  pinMode(buttonPin, INPUT);
  
  // Start listening for I2C comm
  Wire.begin(SLAVE_ADDRESS);

  // Define callbacks for i2c communication
  Wire.onReceive(receiveData);
  Wire.onRequest(sendData);

 // Serial.println("Gestart");
}

void loop(void) {
  buttonValue = digitalRead(buttonPin);
  
if(buttonValue == 1 && pompAllow){

  digitalWrite(pompPin, HIGH);
 
  }
else{
  digitalWrite(pompPin, LOW);
  
  }

}

// Receives data from the pi but discards it as we don't need it
// We need to keep receiveing the data because the I2C connection will close otherwise
void receiveData(int byteCount) {
  while (Wire.available()) {
   Serial.println(Wire.read());
   int wireRead = Wire.read();
  if(wireRead == 3){

    pompAllow = true;
    
    }
    else{
      pompAllow = false;
      }
  
  }
  
}

// When we're allowed to send data
void sendData() {
  Serial.println(buttonValue);
    Wire.write(buttonValue);
}
