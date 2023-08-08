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
			this.addTab();
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

	addTab() {
		const index = this.dom.children.length;
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
		if (this.draggingIndex > 0) {
			const leftTab = this.dom.children[this.draggingIndex - 1];
			if (event.clientX < leftTab.getBoundingClientRect().left) {
				this.swapTab(this.draggingIndex - 1);
				this.draggingIndex--;
			}
		}
		if (this.draggingIndex < this.dom.children.length - 1) {
			const rightTab = this.dom.children[this.draggingIndex + 1];
			if (event.clientX > rightTab.getBoundingClientRect().right) {
				this.swapTab(this.draggingIndex);
				this.draggingIndex++;
			}
		}
	},

	swapTab(index) {
		Sunniesnow.Editor.project.swapCharts(index, index + 1);
		const [tab1, tab2] = [this.dom.children[index], this.dom.children[index + 1]];
		this.dom.insertBefore(tab2, tab1);
		tab1.removeEventListener('mousedown', this.tabsMouseDownListeners[index]);
		tab2.removeEventListener('mousedown', this.tabsMouseDownListeners[index + 1]);
		tab1.addEventListener('mousedown', this.tabsMouseDownListeners[index + 1]);
		tab2.addEventListener('mousedown', this.tabsMouseDownListeners[index]);
	}
};
