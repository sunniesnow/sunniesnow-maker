Sunniesnow.Tap = class Tap extends Sunniesnow.Note {
	constructor(beat, text = '') {
		super(beat);
		this.text = text;
		this.setPosition('0', '0');
	}
	evaluateAttributes() {
		super.evaluateAttributes();
		console.log('Tap.evaluateAttributes()')
	}
}
