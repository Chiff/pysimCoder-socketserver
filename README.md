### SocketServer

Express server that can be used to communicate with pysimCoder over TCP

Creates:

- simple web page to plot data from the Arduino and send commands to the Arduino
- express API
- TCP server that listens on port 5000
- Unix socket client

Prerequisites:

- Node.js (see package.json for version requirements)
- npm or yarn (see package.json for version requirements)

Usage:

- Navigate to pysimCoder/CodeGen/arduinoFirmata/tools/SocketServer
- If necessary edit the `src/config.js` file
- Run `npm run start` or `yarn start`

Modes and schemas:

| Schema Name                              | Tested with device                          | Mode number | Experiment description               |
|------------------------------------------|---------------------------------------------|-------------|--------------------------------------|
| schemas/x10_tclabregulator.dgm           | Arduino Uno/Leonardo (with Arduino Firmata) | 10          | TC Lab 2 heaters                     |
| schemas/x11_heatregulator.dgm            | Arduino Uno (with Arduino Firmata)          | 11          | HeatShield experiment                |
| schemas/x12_floatregulator.dgm           | Arduino Uno (with Arduino Firmata)          | 12          | FloatShield experiment               |
| schemas/x13_rcregulator.dgm              | Arduino Nano (with Arduino Firmata)         | 13          | Resistor capacitor circuit experiment |
| schemas/x20_tos1vent_rpm_regulator.dgm   | TOS1A                                       | 20          | Controls vent rpm                    |
| schemas/x21_tos1vent_light_regulator.dgm | TOS1A                                       | 21          | Controls light intensity             |
| schemas/x22_tos1vent_temp_regulator.dgm  | TOS1A                                       | 22          | Controls device temperature          |
