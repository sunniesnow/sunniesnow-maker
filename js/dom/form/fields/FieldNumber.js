Sunniesnow.FieldNumber = class FieldNumber extends Sunniesnow.Field {

	createInputDom() {
		super.createInputDom();
		this.inputDom.type = 'number';
	}

	getValue() {
		return Number(this.inputDom.value);
	}
};
