(() => {
	window.dataResolvers[21] = {
		mode: 21,
		plotName: 'TOS1A - light intensity',
		mappingFn: (data) => {
			const [executionTime, mode, lightIntensity, lightOutPercent, desiredIntensity] = data;
			return {
				x: executionTime,
				yLeft1: lightIntensity,
				yLeft2: desiredIntensity,
				yRight2: lightOutPercent
			};
		},
		getDataInConfig: (allData) => {
			const current = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.max(item.yLeft1, 0)),
				type: 'scatter',
				name: 'Light intensity'
			};

			const desired = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yLeft2),
				type: 'scatter',
				name: 'Desired intensity'
			};

			const outPercentage = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yRight2),
				type: 'scatter',
				name: 'input intensity (%)',
				yaxis: 'y2'
			};


			return [current, desired, outPercentage];
		},
		getRange: () => [[0, undefined], [0, undefined], [0, 100]],
		getAxisName: () => ({
			yLeft: 'Light intensity',
			yRight: 'Input intensity (%)',
			x: 'time (s)'
		})
	};
})();
