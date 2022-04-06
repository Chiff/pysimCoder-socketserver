(() => {
	window.dataResolvers[11] = {
		mode: 11,
		plotName: 'Arduino Uno (with Arduino Firmata) - HeatShield',
		mappingFn: (data) => {
			const [executionTime, mode, temp, desiredTemp, outPerc] = data;
			return {
				x: executionTime,
				yLeft1: temp,
				yLeft2: desiredTemp,
				yRight1: outPerc
			};
		},
		getDataInConfig: (allData) => {
			const current = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.max(item.yLeft1, 0)),
				type: 'scatter',
				name: 'temp (C)'
			};

			const desired = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yLeft2),
				type: 'scatter',
				name: 'desired temp (C)'
			};


			const outPercentage = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.floor(item.yRight1 / 2.55)),
				type: 'scatter',
				name: 'input 1 (0-100)',
				yaxis: 'y2'
			};

			return [current, desired, outPercentage];
		},
		getRange: () => [undefined, undefined, [-1, undefined]],
		getAxisName: () => ({
			yLeft: 'temperature (C)',
			yRight: 'input (0-100)',
			x: 'execution time (s)'
		})
	};
})();

