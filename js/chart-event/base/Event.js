Sunniesnow.Event = class Event {
	static from(data) {
		switch (data.type) {
			case 'tap':
				return new Sunniesnow.Tap(data.beat, data.x, data.y, data.text);
		}
	}

	constructor(beat) {
		this.beat = beat;
		this.hasPosition = false;
	}

	evaluateAttributes() {
		console.log('Event.evaluateAttributes()')
	}
};
