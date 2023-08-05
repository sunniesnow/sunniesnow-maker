Sunniesnow.Workspace = class Workspace {

	static async fromObject(object) {
		const result = new this();
		result.zoom = object.zoom;
		result.cursorPosition = object.cursorPosition;
		result.offset = object.offset;
		result.subdivision = object.subdivision;
		return result;
	}

	constructor() {
		this.zoom = 1;
		this.cursorPosition = 0.1;
		this.offset = 0;

		this.subdivision = 2;
	}

	async toObject() {
		return {
			zoom: this.zoom,
			cursorPosition: this.cursorPosition,
			offset: this.offset,
			subdivision: this.subdivision
		};
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
};
