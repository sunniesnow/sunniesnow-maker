Sunniesnow.BpmChange = class BpmChange extends Sunniesnow.Event {

	static async load() {
		Sunniesnow.Menu.setOnTrigger('bpm-change', () => this.userNewPopup());
	}

	static userNewPopup() {
		// TODO
	}

	static async fromObject(object) {
		const result = new this(object.beatExp ?? '0', object.bpmExp ?? '120');
		result.evaluateAttributes();
		return result;
	}

	constructor(beatExp, bpmExp) {
		super(beatExp);
		this.bpmExp = bpmExp;
	}

	evaluateAttributes() {
		super.evaluateAttributes();
		this.bps = math.evaluate(this.bpmExp) / 60;
	}

	async toObject() {
		return {beatExp: this.beatExp, bpmExp: this.bpmExp};
	}
};
