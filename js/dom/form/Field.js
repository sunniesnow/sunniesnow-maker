Sunniesnow.Field = class Field {

	constructor(form, data) {
		this.form = form;
		this.data = data;
		this.extractData();
		this.dom = document.createElement('div');
		this.dom.classList.add('field');
		this.populate();
		this.applyAttributes();
		this.checkValidity();
	}

	extractData() {
		this.id = this.data.id;
		this.type = this.data.type;
		this.label = this.data.label;
		this.validityCheck = this.data.validityCheck;
		this.attributes = this.data.attributes ?? {};
	}

	populate() {
		this.populateLabelDom();
		this.populateValidityCheckDom();
		this.populateInputDom();
	}

	populateLabelDom() {
		this.labelDom = document.createElement('div');
		this.labelDom.innerHTML = this.label;
		this.dom.appendChild(this.labelDom);
	}

	populateValidityCheckDom() {
		this.validityCheckDom = document.createElement('div');
		this.validityCheckDom.classList.add('field-validity-check');
		this.dom.appendChild(this.validityCheckDom);
	}

	populateInputDom() {
		this.inputDom = document.createElement('input');
		this.inputDom.classList.add('field-input');
		this.inputDom.addEventListener('input', this.onInput.bind(this));
		this.dom.appendChild(this.inputDom);
	}

	onInput(event) {
		this.checkValidity();
		this.form.onInput(event);
	}

	applyAttributes() {
		Object.assign(this.inputDom, this.attributes);
	}

	value() {
		return this.inputDom.value;
	}

	checkValidity() {
		const check = this.validityCheck?.(this.value());
		this.validityCheckDom.innerHTML = check ?? '';
		if (check) {
			this.inputDom.classList.add('field-input-invalid');
			this.invalid = true;
		} else {
			this.inputDom.classList.remove('field-input-invalid');
			this.invalid = false;
		}
	}
};
