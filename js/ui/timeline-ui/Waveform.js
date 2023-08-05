Sunniesnow.Waveform = class Waveform extends PIXI.Container {

	constructor() {
		super();
		this.waveform = new PIXI.Graphics(Sunniesnow.Editor.music.createWaveform());
		this.waveform.alpha = 0.3;
		const samplesPerRow = Sunniesnow.Editor.music.buffer.sampleRate * Sunniesnow.Config.secondsPerRow;
		this.waveform.scale.x = Sunniesnow.Config.timelineWidth / samplesPerRow;
		this.addChild(this.waveform);
	}

	update(delta) {
		const anchorX = Sunniesnow.workspace.offset / Sunniesnow.Editor.music.duration;
		this.scale.x = Sunniesnow.workspace.zoom;
		this.x = Sunniesnow.TimelineApp.width * Sunniesnow.workspace.cursorPosition - anchorX * this.width;
	}
};
