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
				name: 'voltage (V)'
			};

			const desired = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yLeft2),
				type: 'scatter',
				name: 'desired voltage (V)'
			};

			const outPercentage = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.floor(item.yRight2)),
				type: 'scatter',
				name: 'input (0-1)',
				yaxis: 'y2'
			};


			return [current, desired, outPercentage];
		},
		getRange: () => [undefined, undefined, [-0.1, 1.1]],
		getAxisName: () => ({
			yLeft: 'voltage (V)',
			yRight: 'input (0-1)',
			x: 'execution time (s)'
		})
	};
})();

