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
