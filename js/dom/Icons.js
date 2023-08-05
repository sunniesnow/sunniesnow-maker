Sunniesnow.Icons = {

	icons: {},

	async load() {
		this.icons = await fetch('json/icons.json').then(r => r.json());
	},

	createDom(id) {
		if (!this.icons[id]) {
			return null;
		}
		const result = document.createElement('img');
		result.src = this.icons[id];
		result.draggable = false;
		return result;
	}
};
