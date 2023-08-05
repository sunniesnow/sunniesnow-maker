Sunniesnow.FieldNumber = class FieldNumber extends Sunniesnow.Field {

	populateInputDom() {
		super.populateInputDom();
		this.inputDom.type = 'number';
	}

	value() {
		return Number(this.inputDom.value);
	}
};
