Sunniesnow.BpmChange = class BpmChange extends Sunniesnow.Event {

	static async fromObject(object) {
		const result = new this(object.beatExp, object.bpmExp);
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
