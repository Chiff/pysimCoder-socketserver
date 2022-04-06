const init = () => {
	refresh();
};
(() => {
	init();
})();

/**
 * @typedef {Object} Resolver
 * @property {string} selector
 * @property {(TemplateData) => any} mappingFn
 */

/**
 * @type {Object.<string, Resolver>}
 */
const dataResolver = {
	// activeClient: {
	// 	selector: '#__holder__activeClient',
	// 	mappingFn: (dataResponse) => {
	// 		if (dataResponse.activeClientId && !shared.useClient) {
	// 			setActive(dataResponse.activeClientId);
	// 		}
	//
	// 		if (shared.useClient === shared.templateData?.activeClientId && !dataResponse.activeClientId) {
	// 			setActive(null);
	// 		}
	//
	// 		return dataResponse.activeClientId;
	// 	}
	// },
	clientList: {
		selector: '#__holder__clientList',
		mappingFn: (dataResponse) => {
			const d = dataResponse.clients || [];

			if (d.length === 0) {
				return `No client connected`;
			}

			return `${d.reverse().map((c) => {
				const isActive = c === shared.useClient;
				return `<div role="button" class="client-item ${isActive ? 'isActive' : ''}" onclick="setActive('${c}')">${c}</div>`;
			}).join('')}`;
		}
	},
	// serverData: {
	// 	selector: '#__holder__serverData',
	// 	mappingFn: (dataResponse) => {
	// 		return JSON.stringify(dataResponse, null, '\t');
	// 	}
	// },
	useClient: {
		selector: '#__holder__useClient',
		mappingFn: (dataResponse) => {
			return `${shared.useClient || 'No client selected'}`;
		}
	},
	plotData: {
		selector: '#__holder__plotData',
		mappingFn: (dataResponse) => {
			if (!shared.useClient) return '';
			if (!dataResponse.data || !dataResponse.data[shared.useClient]?.dataIn) return '';

			const data = dataResponse.data[shared.useClient].dataIn || [];
			if (!data[0] || !data[0].length) return '';

			const plotter = new DataPlotter(data[0][1], data);

			setTimeout(() => {
				const plotlyConf = plotter.getConfig();
				Plotly.newPlot(document.getElementById('__holder__plotData'), plotlyConf);
			}, 1000);

			return '';
		}
	}
};


const shared = {};

window.setActive = (client) => {
	shared.useClient = client;

	const resolver = dataResolver.useClient;
	const $element = $(resolver.selector);
	const data = resolver.mappingFn(shared.templateData);
	$element.html(data);

	$('#__holder__plotData').html('');
};

window.sendArray = () => {
	const array = $('#__holder__dataToSend').val();
	console.log('sendArray', JSON.parse(array));
	// if (!shared.useClient) return;

	const data = {
		clientId: shared.useClient,
		dataOut: JSON.parse(array)
	};


	$.ajax({
		url: '/api/send',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: (d) => {
			alert('sendArray success', d);
		},
		error: (e) => {
			alert('sendArray error', e);
		}
	});
};

window.handleFileSelect = () => {
	if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
		alert('The File APIs are not fully supported in this browser.');
		return;
	}

	const x = $('#uploadinput').prop('files');
	console.log('handleFileSelect', x[0]);

	var fr = new FileReader();
	fr.onload = function () {
		const json = fr.result;
		$.ajax({
			url: '/api/merge',
			type: 'POST',
			contentType: 'application/json',
			data: json,
			success: (d) => {
			},
			error: (e) => {
				alert('handleFileSelect error', e);
			}
		});
	};
	fr.readAsText(x[0]);
};


$('#uploadinput').on('change', handleFileSelect);

function refresh() {
	// ajax get index html
	$.ajax({
		url: 'api/data',
		/**
		 * @param {TemplateData} response
		 */
		success: function (response) {
			Object.values(dataResolver).forEach((resolver) => {
				const $element = $(resolver.selector);
				const data = resolver.mappingFn(response);

				if (data) {
					$element.html(data);
				}
			});

			shared.templateData = response;

			if (!shared.useClient || shared.useClient !== response.activeClientId && response.activeClientId) {
				window.setActive(response.activeClientId);
			}

			if (response.activeClientId) {
				document.querySelector('header').classList.add('isActive');

				document.querySelector('header').classList.remove('isWaiting');
				document.body.classList.remove('isWaiting');

			} else {
				document.querySelector('header').classList.add('isWaiting');
				document.body.classList.add('isWaiting');

				document.querySelector('header').classList.remove('isActive');
			}


			setTimeout(function () {
				refresh();
			}, 1000);
		}
	});
}

// Model
/**
 * @param {0|1} mode - 0: heatshield, 1: tclab
 * @param {EventData.dataIn} eventData.dataIn
 * @param {PlotResolver} resolver
 * @method getData
 */
class DataPlotter {
	mode = -1;
	dataIn = [];

	constructor(mode, dataIn) {
		this.mode = mode;
		this.dataIn = dataIn;
		this.resolver = window.dataResolvers[mode];

		if (this.resolver) return;
		$.getScript(`/modes/${mode}.js`, () => {
			this.resolver = window.dataResolvers[mode];
		});
	}

	getConfig() {
		const mapped = this.dataIn.map(this.resolver.mappingFn);
		const dataInconf = this.resolver.getDataInConfig(mapped);

		return plotlyDefault(this.resolver, dataInconf);
	}
}

/**
 * @typedef {Object} AxisName
 * @property {string} yLeft
 * @property {string} yRight
 * @property {string} x
 */

/**
 * @typedef {Object} PlotResolver
 * @property {number} mode
 * @property {string} plotName
 * @property {(p: number[]) => any} mappingFn
 * @property {(p: number[][]) => any} getDataInConfig
 * @property {() => number[][]} getRange
 * @property {() => AxisName} getAxisName
 */

/**
 * @define
 * @type {Object.<number, PlotResolver>}
 */
window.dataResolvers = {
	[0]: {
		plotName: 'heatshield',
		mode: 0,
		mappingFn: (dataIn) => {
			const [executionTime, mode, output, input] = dataIn;
			return {
				x: executionTime,
				yLeft1: output,
				yRight1: input
			};
		},
		getDataInConfig: (allData) => {
			const tempGraph = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.max(item.yLeft1, 0)),
				type: 'scatter',
				name: 'output (C)'
			};

			const inputGraph = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yRight1 * (100 / 255)),
				type: 'scatter',
				name: 'input (%)',
				yaxis: 'y2'
			};

			return [tempGraph, inputGraph];
		},
		getRange: () => [[0, 120], [0, 120]]
	},
	[1]: {
		plotName: 'tclab',
		mode: 1,
		mappingFn: (dataIn) => {
			const [executionTime, mode, o1, o2, i1, i2] = dataIn;
			return {
				x: executionTime,
				yLeft1: o1,
				yLeft2: o2,
				yRight1: i1,
				yRight2: i2
			};
		},
		getDataInConfig: (allData) => {
			const tg1 = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.max(item.yLeft1, 0)),
				type: 'scatter',
				name: 'output (C)'
			};

			const tg2 = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.max(item.yLeft2, 0)),
				type: 'scatter',
				name: 'output (C)'
			};

			const ig1 = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yRight1 * (100 / 255)),
				type: 'scatter',
				name: 'input (%)',
				yaxis: 'y2'
			};

			const ig2 = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yRight2 * (100 / 255)),
				type: 'scatter',
				name: 'input (%)',
				yaxis: 'y2'
			};

			return [tg1, tg2, ig1, ig2];
		},
		getRange: () => [[0, 120], [0, 120]]
	},
	[2]: {
		plotName: 'floatshield',
		mode: 2,
		mappingFn: (dataIn) => {
			const [executionTime, mode, current, desired, input] = dataIn;
			return {
				x: executionTime,
				yLeft1: current,
				yLeft2: desired,
				yRight1: input
			};
		},
		getDataInConfig: (allData) => {
			const distGrapgh = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yLeft1),
				type: 'scatter',
				name: 'distance (mm)'
			};

			const desiredGraph = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yLeft2),
				type: 'scatter',
				name: 'desired distance (mm)'
			};

			const inputGraph = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yRight1 * (100 / 255)),
				type: 'scatter',
				name: 'input (%)',
				yaxis: 'y2'
			};

			return [distGrapgh, desiredGraph, inputGraph];
		},
		getRange: () => [[[0, 500], [0, 500]], [0, 100]]
	},
	[3]: {
		plotName: 'nano with capacitor',
		mode: 3,
		mappingFn: (dataIn) => {
			const [executionTime, mode, input, output] = dataIn;
			return {
				x: executionTime,
				yLeft1: output,
				yRight1: input
			};
		},
		getDataInConfig: (allData) => {
			const voltageGraph = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yLeft1),
				type: 'scatter',
				name: 'output (V)'
			};

			const inputGraph = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yRight1),
				type: 'scatter',
				name: 'input (%)',
				yaxis: 'y2'
			};

			return [voltageGraph, inputGraph];
		},
		getRange: () => [undefined, [0, 1]]
	},
	[4]: {
		plotName: 'tos1a',
		mode: 4,
		mappingFn: (dataIn) => {
			const [executionTime, mode, o1, o2, o3, i1, i2, i3] = dataIn;
			return {
				x: executionTime,
				yLeft1: o1,
				yLeft2: o2,
				yLeft3: o3,
				yRight1: i1,
				yRight2: i2,
				yRight3: i3
			};
		},
		getDataInConfig: (allData) => {
			const tg1 = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.max(item.yLeft1, 0)),
				type: 'scatter',
				name: 'temp internal (C)'
			};

			const tg2 = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.max(item.yLeft2, 0)),
				type: 'scatter',
				name: 'light intensity (?)'
			};

			const tg3 = {
				x: allData.map(item => item.x),
				y: allData.map(item => Math.max(item.yLeft3, 0)),
				type: 'scatter',
				name: 'vent rpm (rpm)'
			};

			const ig1 = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yRight1),
				type: 'scatter',
				name: 'input temp (%)',
				yaxis: 'y2'
			};

			const ig2 = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yRight2),
				type: 'scatter',
				name: 'input vent (%)',
				yaxis: 'y2'
			};

			const ig3 = {
				x: allData.map(item => item.x),
				y: allData.map(item => item.yRight3),
				type: 'scatter',
				name: 'input lamp (%)',
				yaxis: 'y2'
			};

			return [tg1, tg2, tg3, ig1, ig2, ig3];
		},
		getRange: () => [undefined, undefined, undefined, [0, 100], [0, 100], [0, 100]]
	}
};

/**
 * @param {PlotResolver} plotResolver
 * @param {any[]} plotData
 * @param {number[][]} range
 */
const plotlyDefault = (plotResolver, plotData, range = []) => {


	let newVar = {
		data: plotData,
		layout: {
			title: plotResolver.plotName,
			xaxis: {
				title: 'execution time',
				range: plotResolver.getRange()[0]
			},
			yaxis: {
				title: 'temperature in C',
				range: plotResolver.getRange()[1]
			},
			yaxis2: {
				title: 'input in % (0-255)',
				titlefont: {color: 'rgb(148, 103, 189)'},
				tickfont: {color: 'rgb(148, 103, 189)'},
				overlaying: 'y',
				side: 'right',
				range: plotResolver.getRange()[2]
			}
		}
	};

	const axisNames = plotResolver.getAxisName();
	if (axisNames.x) newVar.layout.xaxis.title = axisNames.x;
	if (axisNames.yLeft) newVar.layout.yaxis.title = axisNames.yLeft;
	if (axisNames.yRight) newVar.layout.yaxis2.title = axisNames.yRight;

	return newVar;
};

