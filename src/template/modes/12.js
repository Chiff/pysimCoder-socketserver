(() => {
	window.dataResolvers[12] = {
		mode: 12,
		plotName: 'Arduino Uno (with Arduino Firmata) - FloatShield',
		mappingFn: (data) => {
			const [executionTime, mode, height, desiredHeight, outPerc] = data;
			return {
				x: executionTime,
				yLeft1: height,
				yLeft2: desiredHeight,
				yRight1: outPerc
			};
		},
		getDataInConfig: (allData) => {
			const current = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.max(item.yLeft1, 0)),
				type: 'scatter',
				name: 'distance (mm)'
			};

			const desired = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yLeft2),
				type: 'scatter',
				name: 'desired distance (mm)'
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
		getRange: () => [undefined, undefined, [-1, 101]],
		getAxisName: () => ({
			yLeft: 'distance (mm)',
			yRight: 'input (0-100)',
			x: 'execution time (s)'
		})
	};
})();

