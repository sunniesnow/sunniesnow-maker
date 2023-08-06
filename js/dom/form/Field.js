Sunniesnow.Field = class Field {

	constructor(form, data) {
		this.form = form;
		this.data = data;
		this.extractData();
		this.disabled = false;
		this.hasExtraValues = false;
		this.populate();
		this.applyAttributes();
		this.checkValidity();
	}

	extraValues() {
		if (this.disabled || !this.hasExtraValues) {
			return {};
		} else {
			return this.getExtraValues();
		}
	}

	getExtraValues() {
		return {};
	}

	extractData() {
		this.id = this.data.id;
		this.type = this.data.type;
		this.label = this.data.label;
		this.hint = this.data.hint;
		this.validityCheck = this.data.validityCheck;
		this.attributes = this.data.attributes ?? {};
	}

	populate() {
		this.createDom();
		this.populateLabelDom();
		this.populateValidityCheckDom();
		this.populateInputDom();
		this.setHint();
	}

	createDom() {
		this.dom = document.createElement('div');
		this.dom.classList.add('field');
		this.dom.title = this.hint ?? '';
	}

	setHint() {
		if (!this.hint) {
			return;
		}
		Sunniesnow.Hint.register(this.dom, this.hint, 'hover');
		Sunniesnow.Hint.register(this.inputDom, this.hint, 'focus');
	}

	unsetHint() {
		if (!this.hint) {
			return;
		}
		Sunniesnow.Hint.unregister(this.dom, 'hover');
		Sunniesnow.Hint.unregister(this.inputDom, 'focus');
	}

	populateLabelDom() {
		this.labelDom = document.createElement('div');
		this.labelDom.innerHTML = this.label ?? '';
		this.dom.appendChild(this.labelDom);
	}

	populateValidityCheckDom() {
		this.validityCheckDom = document.createElement('div');
		this.validityCheckDom.classList.add('field-validity-check');
		this.dom.appendChild(this.validityCheckDom);
	}

	createInputDom() {
		this.inputDom = document.createElement('input');
		this.inputDom.addEventListener('input', this.onInput.bind(this));
	}

	populateInputDom() {
		this.createInputDom();
		this.inputDom.classList.add('field-input');
		this.dom.appendChild(this.inputDom);
	}

	onInput(event) {
		this.checkValidity();
		this.form.onInput(event);
	}

	applyAttributes() {
		for (const key in this.attributes) {
			this.inputDom.setAttribute(key, this.attributes[key]);
		}
	}

	value() {
		return this.disabled ? null : this.getValue();
	}

	getValue() {
		return this.inputDom.value;
	}

	checkValidity() {
		const check = this.disabled ? null : this.validityCheck?.(this.value());
		if (check) {
			this.validityCheckDom.innerHTML = check;
			this.inputDom.classList.add('field-input-invalid');
			this.invalid = true;
		} else {
			this.validityCheckDom.innerHTML = '';
			this.inputDom.classList.remove('field-input-invalid');
			this.invalid = false;
		}
	}

	setDisabled(disabled) {
		if (this.disabled === disabled) {
			return;
		}
		this.disabled = disabled;
		this.setInputDomDisabled(disabled);
		this.onInput();
	}

	setInputDomDisabled(disabled) {
		this.inputDom.disabled = disabled;
	}

	purge() {
		this.unsetHint();
	}
};
