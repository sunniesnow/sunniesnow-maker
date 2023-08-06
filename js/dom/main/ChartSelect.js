Sunniesnow.ChartSelect = {

	draggingIndex: null,
	tabsMouseDownListeners: [],

	async load() {
		this.dom = document.getElementById('chart-select');
		document.addEventListener('mouseup', event => this.draggingIndex = null);
		document.addEventListener('mousemove', event => this.onMouseMove(event));
		this.projectNameDom = document.getElementById('project-name');
	},

	refresh() {
		this.clean();
		this.projectNameDom.textContent = Sunniesnow.Editor.project.name;
		for (let i = 0; i < Sunniesnow.Editor.project.charts.length; i++) {
			this.addTab(i);
		}
		this.dom.children[Sunniesnow.workspace.currentChartIndex].classList.add('chart-tab-selected');
	},

	clean() {
		for (let i = 0; i < this.dom.children.length; i++) {
			this.dom.children[i].removeEventListener('mousedown', this.tabsMouseDownListeners[i]);
		}
		this.tabsMouseDownListeners = [];
		this.dom.innerHTML = '';
		this.projectNameDom.textContent = '';
	},

	addTab(index) {
		const chart = Sunniesnow.Editor.project.charts[index];
		const tab = document.createElement('div');
		tab.classList.add('chart-tab');
		tab.textContent = chart.name;
		this.tabsMouseDownListeners[index] = event => {
			this.switchTab(index);
			this.draggingIndex = index;
		};
		tab.addEventListener('mousedown', this.tabsMouseDownListeners[index]);
		this.dom.appendChild(tab);
	},

	switchTab(index) {
		if (Sunniesnow.workspace.currentChartIndex === index) {
			return;
		}
		this.dom.children[Sunniesnow.workspace.currentChartIndex].classList.remove('chart-tab-selected');
		this.dom.children[index].classList.add('chart-tab-selected');
		Sunniesnow.workspace.currentChartIndex = index;
	},

	onMouseMove(event) {
		if (this.draggingIndex === null) {
			return;
		}

	}

};
