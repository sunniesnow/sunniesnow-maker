Sunniesnow.Waveform = class Waveform extends Sunniesnow.TimelineUi {

	constructor() {
		super();
		this.populate();
		this.addInteraction();
	}

	populate() {
		this.waveform = new PIXI.Graphics(Sunniesnow.Editor.music.createWaveform());
		this.waveform.alpha = 0.3;
		const samplesPerRow = Sunniesnow.Editor.music.buffer.sampleRate * Sunniesnow.Config.secondsPerRow;
		this.waveform.scale.x = Sunniesnow.Config.timelineWidth / samplesPerRow;
		this.waveformWrapper = new PIXI.Container();
		this.waveformWrapper.addChild(this.waveform);
		this.addChild(this.waveformWrapper);
	}

	addInteraction() {
		this.hitArea = {contains: (x, y) => y <= Sunniesnow.Config.waveformHeight};
		Sunniesnow.PointerManager.register('timeline', this);
		this.on('pointerdown', event => {
			if (Sunniesnow.workspace) {
				this.seeking = true;
			}
			if (Sunniesnow.Editor.music?.playing) {
				this.temporaryPause = true;
				Sunniesnow.Editor.music.pause();
			}
		});
		this.on('pointermove', ({position, localPosition}) => {
			if (!Sunniesnow.workspace) {
				return;
			}
			Sunniesnow.workspace.setOffset(this.timeAt(localPosition.x));
			Sunniesnow.workspace.cursorPosition = position.x / Sunniesnow.Config.timelineWidth;
		});
		this.on('pointerup', event => {
			if (this.temporaryPause) {
				Sunniesnow.Editor.music?.play();
				this.temporaryPause = false;
			}
			this.seeking = false;
		});
	}

	update(delta) {
		this.updatePosition();
		this.waveformWrapper.scale.x = Sunniesnow.workspace.zoom;
	}
};
