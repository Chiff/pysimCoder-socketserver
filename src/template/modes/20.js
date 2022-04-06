(() => {
	window.dataResolvers[20] = {
		mode: 20,
		plotName: 'TOS1A - vent rpm',
		mappingFn: (data) => {
			const [executionTime, mode, ventRpm, ventOutPercent, desiredRpm] = data;
			return {
				x: executionTime,
				yLeft1: ventRpm,
				yLeft2: desiredRpm,
				yRight2: ventOutPercent
			};
		},
		getDataInConfig: (allData) => {
			const current = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.max(item.yLeft1, 0)),
				type: 'scatter',
				name: 'vent rpm (rpm)'
			};

			const desired = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yLeft2),
				type: 'scatter',
				name: 'vent target (rpm)'
			};

			const outPercentage = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yRight2),
				type: 'scatter',
				name: 'input vent (%)',
				yaxis: 'y2'
			};


			return [current, desired, outPercentage];
		},
		getRange: () => [[0, undefined], [0, undefined], [0, 100]],
		getAxisName: () => ({
			yLeft: 'vent rpm (rpm)',
			yRight: 'vent out (%)',
			x: 'execution time (s)'
		})
	};
})();

