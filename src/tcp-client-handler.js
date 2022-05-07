const net = require('net');
const SHARED = require('./shared.js');
const CONFIG = require('./config.js');

/**
 * @param {module:net.Socket} client
 * @param {function(EventData): Buffer|null} dataOutCallback
 */
module.exports = function (client, dataOutCallback) {
	console.log(`TCP\tclient connected ${client.remoteAddress}:${client.remotePort}`);

	SHARED.bus.subscribe('onDataOut', (d) => {
		let buffer = dataOutCallback(d);
		if (!buffer) {
			return;
		}

		client.write(buffer);
	});

	client.on('close', () => {
		console.log(`TCP\tclient disconnected from server`);
	});
};
/**
 * Example usage:
 *
 * tcpClientHandler(clientSocket, function (data) {
 *   const dataLength = 8;
 *   const totalLength = data.data.length;
 *   const buffer = Buffer.alloc(dataLength * totalLength);
 *   for (let i = 0; i < totalLength; i++) {
 *     buffer.writeDoubleLE(data.data[i], i * dataLength);
 *   }
 *   return buffer;
 * });
 */
