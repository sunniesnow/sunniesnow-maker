Sunniesnow.TimelineApp = {

	init() {
		this.canvas = document.getElementById('timelines');
		this.app = new PIXI.Application({
			view: this.canvas,
			sharedTicker: true,
			width: this.width = this.canvas.width,
			height: this.height = this.canvas.height
		});
		this.app.renderer.on('resize', (width, height) => {
			this.width = width;
			this.height = height;
		});
	},

	initScene() {

	},

	reloadProject() {
		this.createWaveform();
		this.createBeats();
		this.createSlider();
	},

	createWaveform() {
		if (this.waveform) {
			this.waveform.destroy({ children: true });
		}
		this.waveform = new Sunniesnow.Waveform();
		this.app.stage.addChildAt(this.waveform, 0);
	},

	createBeats() {
		if (!this.beats) {
			this.beats = new Sunniesnow.Beats();
			this.app.stage.addChild(this.beats);
		}
	},

	createSlider() {
		if (!this.slider) {
			this.slider = new Sunniesnow.Slider();
			this.app.stage.addChild(this.slider);
		}
	},

	update(delta) {
		this.waveform?.update(delta);
		this.beats?.update(delta);
		this.slider?.update(delta);
	},

};
