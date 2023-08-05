Sunniesnow.Preprocess = {
	async run() {
		Sunniesnow.Editor.init();
		await this.loadAll();
		Sunniesnow.Editor.main();
	},

	async loadAll() {
		const loadList = await fetch('json/load-list.json').then(response => response.json());
		for (const property of loadList) {
			await Sunniesnow[property].load();
		}
	}
};

window.addEventListener('load', () => Sunniesnow.Preprocess.run());
