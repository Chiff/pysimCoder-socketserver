(() => {
	window.dataResolvers[10] = {
		mode: 10,
		plotName: 'Arduino Uno (with Arduino Firmata) - TCLab shield (two heaters)',
		mappingFn: (data) => {
			const [executionTime, mode, temp1, temp2, desiredTemp1, desiredTemp2, outPerc1, outPerc2] = data;
			return {
				x: executionTime,
				yLeft1: temp1,
				yLeft2: desiredTemp1,
				yLeft3: temp2,
				yLeft4: desiredTemp2,
				yRight1: outPerc1,
				yRight2: outPerc2
			};
		},
		getDataInConfig: (allData) => {
			const current1 = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.max(item.yLeft1, 0)),
				type: 'scatter',
				name: 'temp 1 (C)'
			};

			const desired1 = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yLeft2),
				type: 'scatter',
				name: 'desired temp 1 (C)'
			};

			const current2 = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.max(item.yLeft3, 0)),
				type: 'scatter',
				name: 'temp 2 (C)'
			};

			const desired2 = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yLeft4),
				type: 'scatter',
				name: 'desired temp 2 (C)'
			};

			const outPercentage1 = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.floor(item.yRight1 / 2.55)),
				type: 'scatter',
				name: 'input 1 (0-100)',
				yaxis: 'y2'
			};

			const outPercentage2 = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.floor(item.yRight2 / 2.55)),
				type: 'scatter',
				name: 'input 2 (0-100)',
				yaxis: 'y2'
			};


			return [current1, desired1, current2, desired2, outPercentage1, outPercentage2];
		},
		getRange: () => [undefined, undefined, undefined, undefined, [-1, 101], [-1, 101]],
		getAxisName: () => ({
			yLeft: 'temperature (C)',
			yRight: 'input (0-100)',
			x: 'execution time (s)'
		})
	};
})();

