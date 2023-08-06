Sunniesnow.FieldFile = class FieldFile extends Sunniesnow.Field {

	createInputDom() {
		super.createInputDom();
		this.inputDom.type = 'file';
	}

	getValue() {
		return this.inputDom.multiple ? this.inputDom.files : this.inputDom.files[0];
	}
};
