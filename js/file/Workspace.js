Sunniesnow.Workspace = class Workspace {

	static async fromObject(object) {
		const result = new this();
		result.restoreFromObject(object);
		return result;
	}

	constructor() {
		this.zoom = 1;
		this.cursorPosition = 0.1;
		this.offset = 0;
		this.subdivision = 2;
		this.currentChartIndex = 0;
		this.currentChannelIndex = 0;
		this.formatTime = true;
	}

	async toObject() {
		return this.toObjectSync();
	}

	toObjectSync() {
		return {
			zoom: this.zoom,
			cursorPosition: this.cursorPosition,
			offset: this.offset,
			subdivision: this.subdivision,
			currentChartIndex: this.currentChartIndex,
			currentChannelIndex: this.currentChannelIndex,
			formatTime: this.formatTime,
		};
	}

	restoreFromObject(object) {
		this.zoom = object.zoom ?? 1;
		this.cursorPosition = object.cursorPosition ?? 0.1;
		this.subdivision = object.subdivision ?? 2;
		this.currentChartIndex = object.currentChartIndex ?? 0;
		this.currentChannelIndex = object.currentChannelIndex ?? 0;
		this.formatTime = object.formatTime ?? true;
		this.setOffset(object.offset ?? 0);
	}

	timeWindow() {
		const duration = Sunniesnow.Config.secondsPerRow / this.zoom;
		return [this.offset - duration * this.cursorPosition, this.offset + duration * (1 - this.cursorPosition)];
	}

	update(delta) {
		this.offset = Sunniesnow.Editor.music?.currentTime();
	}

	setTimeWindow(min, max) {
		const duration = max - min;
		this.offset = min + duration * this.cursorPosition;
		this.zoom = Sunniesnow.Config.secondsPerRow / duration;
	}

	zoomBy(ratio) {
		this.zoom *= ratio;
	}

	setOffset(offset) {
		this.offset = offset;
		Sunniesnow.Editor.music?.seekTo(offset);
	}
};
