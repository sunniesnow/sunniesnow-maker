Sunniesnow.Preprocess = {
	async run() {
		await this.loadAll();
	},

	async loadAll() {
		const loadList = await fetch('json/load-list.json').then(response => response.json());
		for (const property of loadList) {
			await Sunniesnow[property].load();
		}
	}
};

window.addEventListener('load', () => Sunniesnow.Preprocess.run());
