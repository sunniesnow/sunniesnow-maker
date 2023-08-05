Sunniesnow.MainApp = {
	init() {
		this.canvas = document.getElementById('main-canvas');
		this.app = new PIXI.Application({
			view: this.canvas,
			sharedTicker: true,
			width: this.canvas.width,
			height: this.canvas.height
		});
	},

	initScene() {
		this.app.stage.addChild(new Sunniesnow.Background());
		this.app.stage.addChild(new Sunniesnow.BasicGrid());
	},

	update(delta) {

	},

	reloadProject() {
	}
};
