Sunniesnow.FieldFile = class FieldFile extends Sunniesnow.Field {

	populateInputDom() {
		super.populateInputDom();
		this.inputDom.type = 'file';
	}

	value() {
		return this.inputDom.files[0];
	}
};
