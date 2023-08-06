Sunniesnow.Preprocess = {
	async run() {
		Sunniesnow.Editor.init();
		await this.loadAll();
		Sunniesnow.Editor.main();
	},

	async loadAll() {
		const loadList = await fetch('json/load-list.json').then(response => response.json());
		for (const property of loadList) {
			const module = Sunniesnow[property];
			if (!module) {
				throw new Error(`Module ${property} not found`);
			}
			if (!module.load) {
				throw new Error(`Module ${property} has no load() method`);
			}
			await module.load();
		}
	}
};

window.addEventListener('load', () => Sunniesnow.Preprocess.run());
