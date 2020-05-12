const int R1 = 1000;             // Resistor = 1Kohm = 1000ohm
const int ECPWR = 3;             // Digitalpin 3
const int ECDATA = A4;           // Analogpin 4
const float factor = 0.640;      // Conversion factor EC -> PPM
const int readingPeriod = 5000;  // Milliseconds between readings
const int numberOfReadings = 10; // How much readings are combined into a mean reading
const int voltage = 5;           // How much volts the arduino gives to the sensor

unsigned long current_time = 0; // To save the current time in
unsigned long last_time = 0;    // Saves last time
float EC = 0;                   // To save the Electrical Conductivity in
float ppm = 0;                  // To save PartsPerMillion in

void setup()
{
  Serial.begin(9600);
  pinMode(ECPWR, OUTPUT);
  pinMode(ECDATA, INPUT);

  digitalWrite(ECPWR, LOW);
  last_time = millis()
}

void loop()
{
  current_time = millis(); // Reads current time (since program start)
  ppm = readPPM(current_time);
  if(ppm != 0) {
    Serial.println("PPM: " + String(ppm, 2));
  }
  
}

float readPPM(unsigned long current)
{
  if (current - last_time >= readingPeriod)
  {
    int i = 0;            // Counter
    float temp = 0;       //temporary
    float mean = 0;       // Gemiddelde
    float vDrop = 0;      // Voltage Drop
    float resistance = 0; // Water resistance

    while (i < numberOfReadings)
    {
      int raw = 0;
      digitalWrite(ECPWR, HIGH);
      raw = analogRead(ECDATA);
      raw = analogRead(ECDATA);
      digitalWrite(ECPWR, LOW);
      temp += raw;
      i++
    }

    mean = temp / numberOfReadings; // Calculate mean of the readings

    vDrop = (voltage * mean) / 1024.0;             // Divide by resolution of Analogpin
    resistance = (vDrop * R1) / (voltage - vDrop); // Formula of resistance
    EC = 1000 / (resistance * factor);

    last_time = millis();          // Reset timer
    return (EC * (factor * 1000)); // Return PartsPerMillion calculated
  }
  return 0;
}