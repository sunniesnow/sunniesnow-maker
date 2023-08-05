Sunniesnow.Event = class Event {
	static from(data) {
		let result;
		switch (data.type) {
			case 'tap':
				result = new Sunniesnow.Tap(data.beatExp, data.text);
				result.setPosition(data.xExp, data.yExp);
				break;
		}
		result.evaluateAttributes();
		return result;
	}

	constructor(beatExp) {
		this.beatExp = beatExp;
		this.hasPosition = false;
	}

	evaluateAttributes() {
		this.beat = math.evaluate(this.beatExp);
	}

	async toObject() {
		return {type: 'event', beatExp: this.beatExp};
	}
};
