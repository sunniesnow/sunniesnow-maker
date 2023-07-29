Sunniesnow.Note = class Note extends Sunniesnow.Event {
	evaluateAttributes() {
		super.evaluateAttributes();
		console.log('Note.evaluateAttributes()')
	}
};
Sunniesnow.Utils.classInclude(Sunniesnow.Note, Sunniesnow.TipPointable);
