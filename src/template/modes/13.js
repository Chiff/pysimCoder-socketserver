(() => {
	window.dataResolvers[13] = {
		mode: 13,
		plotName: 'Arduino Nano (with Arduino Firmata) - RC circuit',
		mappingFn: (data) => {
			const [executionTime, mode, capacitance, desiredCapacitance, outPerc] = data;
			return {
				x: executionTime,
				yLeft1: capacitance,
				yLeft2: desiredCapacitance,
				yRight2: outPerc
			};
		},
		getDataInConfig: (allData) => {
			const current = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.max(item.yLeft1, 0)),
				type: 'scatter',
				name: 'capacitance (C)'
			};

			const desired = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yLeft2),
				type: 'scatter',
				name: 'desired capacitance (C)'
			};

			const outPercentage = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yRight2),
				type: 'scatter',
				name: 'input (0-255)',
				yaxis: 'y2'
			};


			return [current, desired, outPercentage];
		},
		getRange: () => [[0, undefined], [0, undefined], [0, 255]],
		getAxisName: () => ({
			yLeft: 'capacitance (C)',
			yRight: 'input (0-255)',
			x: 'time (s)'
		})
	};
})();

