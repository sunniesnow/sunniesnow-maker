Sunniesnow.TipPoint = class TipPoint {

	static userNew(note) {
		return new this(note, {skip: false, start: false, end: false});
	}

	// note: TipPointable
	constructor(note, data) {
		this.note = note;
		this.skip = data.skip; // boolean
		if (this.skip) {
			this.start = false;
			this.end = false;
			return;
		}
		this.start = data.start ?? false; // boolean
		this.end = data.end ?? false; // boolean
		if (this.start) {
			this.advanceBeat = data.advanceBeat; // rational
			this.relativePosition = data.relativePosition; // boolean
			this.x = data.x;
			this.y = data.y;
		}
	}

	startBeat() {
		if (!this.start) {
			return null;
		}
		return this.note.beat - this.advanceBeat;
	}

	startPosition() {
		if (!this.start) {
			return null;
		}
		if (this.relativePosition) {
			return [this.note.x + this.x, this.note.y + this.y];
		} else {
			return [this.x, this.y];
		}
	}

	toJson() {
		const result = {skip: this.skip, start: this.start, end: this.end};
		if (this.start) {
			result.advanceBeat = this.advanceBeat;
			result.relativePosition = this.relativePosition;
			result.x = this.x;
			result.y = this.y;
		}
		return result;
	}
};
