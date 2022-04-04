(() => {
	window.dataResolvers[22] = {
		mode: 22,
		plotName: 'TOS1A - temperature',
		mappingFn: (data) => {
			const [executionTime, mode, temp, tempOutPercent, desiredTemp] = data;
			return {
				x: executionTime,
				yLeft1: temp,
				yLeft2: desiredTemp,
				yRight2: tempOutPercent
			};
		},
		getDataInConfig: (allData) => {
			const current = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.max(item.yLeft1, 0)),
				type: 'scatter',
				name: 'Temperature'
			};

			const desired = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yLeft2),
				type: 'scatter',
				name: 'Desired temperature'
			};

			const outPercentage = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yRight2),
				type: 'scatter',
				name: 'input temp (%)',
				yaxis: 'y2'
			};


			return [current, desired, outPercentage];
		},
		getRange: () => [[0, undefined], [0, undefined], [0, 100]],
		getAxisName: () => ({
			yLeft: 'Temperature (°C)',
			yRight: 'Input temperature (%)',
			x: 'time (s)'
		})
	};
})();

