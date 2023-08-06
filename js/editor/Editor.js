Sunniesnow.Editor = {

	project: null,
	channelIndex: 0,

	// idle, select, freeTransform
	state: 'idle',

	async save() {
		const key = this.project.localStorageKey();
		localStorage.setItem('lastProject', key);
		localStorage.setItem(
			key,
			JSON.stringify(await this.project.toObject())
		);
	},

	async loadLastProject() {
		const lastProject = localStorage.getItem('lastProject');
		if (lastProject) {
			const object = JSON.parse(localStorage.getItem(lastProject));
			this.project = await Sunniesnow.Project.fromObject(object);
			await this.reloadProject();
		}
	},

	init() {
		this.createApps();
	},

	main() {
		this.initTicker();
		this.initScene();
		this.loadLastProject();
	},

	createApps() {
		Sunniesnow.MainApp.init();
		Sunniesnow.TimelineApp.init();
	},

	initTicker() {
		PIXI.Ticker.shared.add(delta => {
			this.update(delta);
		});
	},

	update(delta) {
		Sunniesnow.workspace?.update(delta);
		Sunniesnow.MainApp.update(delta);
		Sunniesnow.TimelineApp.update(delta);
		Sunniesnow.Status.update(delta);
	},

	initScene() {
		Sunniesnow.MainApp.initScene();
		Sunniesnow.TimelineApp.initScene();
	},

	async reloadProject() {
		Sunniesnow.workspace = this.project.workspace;
		localStorage.setItem('lastProject', this.project.localStorageKey());
		Sunniesnow.Music.audio = this.music = await Sunniesnow.Audio.fromBlob(this.project.music);
		Sunniesnow.ChartSelect.refresh();
		Sunniesnow.TimelineApp.reloadProject();
		Sunniesnow.MainApp.reloadProject();
	}
};
