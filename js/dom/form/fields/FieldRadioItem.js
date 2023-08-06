Sunniesnow.FieldRadioItem = class FieldRadioItem {

	constructor(fieldRadio, data) {
		this.fieldRadio = fieldRadio;
		this.disabled = false;
		this.data = data;
		this.extractData();
		this.populate();
		this.applyAttributes();
	}

	extractData() {
		this.label = this.data.label;
		this.value = this.data.value;
		this.formData = this.data.subform;
		this.attributes = this.data.attributes ?? {};
		this.hint = this.data.hint;
	}

	applyAttributes() {
		for (const key in this.attributes) {
			this.inputDom.setAttribute(key, this.attributes[key]);
		}
	}

	populate() {
		this.createDom();
		this.populateInputDom();
		this.populateLabelDom();
		this.populateFormDom();
		this.setHint();
	}

	createDom() {
		this.dom = document.createElement('div');
		this.dom.classList.add('field-radio-item');
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

	populateFormDom() {
		if (!this.formData) {
			return;
		}
		this.form = new Sunniesnow.Form(this.formData);
		this.form.addInputListener(event => this.fieldRadio.onInput(event));
		this.dom.appendChild(this.form.dom);
	}

	populateInputDom() {
		this.inputDom = document.createElement('input');
		this.inputDom.id = `${this.fieldRadio.id}-${this.value}-radio`
		this.inputDom.type = 'radio';
		this.inputDom.name = `${this.fieldRadio.id}-${Sunniesnow.Utils.objectId(this.fieldRadio)}`;
		this.inputDom.value = this.value;
		this.inputDom.addEventListener('input', event => this.fieldRadio.onInput(event));
		this.dom.appendChild(this.inputDom);
	}

	populateLabelDom() {
		this.labelDom = document.createElement('label');
		this.labelDom.innerHTML = this.label ?? '';
		this.labelDom.setAttribute('for', this.inputDom.id);
		this.dom.appendChild(this.labelDom);
	}

	updateFormDisabled() {
		this.form?.setDisabled(!this.inputDom.checked || this.disabled);
	}

	setDisabled(disabled) {
		if (this.disabled === disabled) {
			return;
		}
		this.disabled = disabled;
		this.inputDom.disabled = disabled;
		this.updateFormDisabled();
	}

	purge() {
		this.form?.purge();
		this.unsetHint();
	}
};
