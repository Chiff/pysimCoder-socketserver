const net = require('net');
const SHARED = require('./shared.js');
const CONFIG = require('./config.js');

/**
 * @param {string|number} port
 * @param {function(EventData): Buffer|null} dataOutCallback
 * @returns {module:net.Socket}
 */
module.exports = function (port, dataOutCallback) {
	const conn = net.createConnection(port);
	conn.on('connect', () => {
		console.log(`SOCK\tclient connected to server ${port}`);

		SHARED.bus.subscribe('onDataOut', (d) => {
			let buffer = dataOutCallback(d);
			if (!buffer) {
				return;
			}

			conn.write(buffer);
		});
	});

	conn.on('close', () => {
		console.log(`SOCK\tclient disconnected from server ${port}`);
	});

	return conn;
};
/**
 * Example usage:
 *
 * const c1 = unixClient(CONFIG.port.sock, function (data) {
 *   const dataLength = 8;
 *   const totalLength = data.data.length;
 *   const buffer = Buffer.alloc(dataLength * totalLength);
 *   for (let i = 0; i < totalLength; i++) {
 *     buffer.writeDoubleLE(data.data[i], i * dataLength);
 *   }
 *   return buffer;
 * });
 */
