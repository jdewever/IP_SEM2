int R1 = 560; // hulpweerstand
int ECPwr = 3;
int ECData = A4;

float EC = 0;
float factor = 0.64;

float ppm = 0;

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(ECPwr, OUTPUT);
  pinMode(ECData, INPUT);

  digitalWrite(ECPwr, LOW);
}

void loop()
{
  // put your main code here, to run repeatedly:

  ppm = leesPPM();
  Serial.print("PPM: ");
  Serial.println(ppm);
}

float leesPPM()
{
  int i = 0;
  float temp = 0;
  float gem = 0;
  float vDrop = 0;
  float resistance = 0;

  while (i <= 10)
  {
    int raw = 0;
    digitalWrite(ECPwr, HIGH);
    raw = analogRead(ECData);
    raw = analogRead(ECData);
    digitalWrite(ECPwr, LOW);
    temp += raw;
    i++;

    Serial.println(raw);
    Serial.println(temp);

    delay(5000);
  }
  gem = temp / 10;
  Serial.println(gem);

  vDrop = (5 * gem) / 1024.0;
  resistance = (vDrop * R1) / (5 - vDrop);
  EC = 1000 / (resistance * factor);

  Serial.println(vDrop);
  Serial.println(resistance);
  Serial.println(EC);

  return EC * (factor * 1000);
}