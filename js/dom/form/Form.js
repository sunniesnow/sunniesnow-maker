Sunniesnow.Form = class Form {

	static DATA = [];

	createField(data) {
		switch (data.type) {
			case 'text':
				return new Sunniesnow.FieldText(this, data);
			case 'number':
				return new Sunniesnow.FieldNumber(this, data);
			case 'file':
				return new Sunniesnow.FieldFile(this, data);
			case 'list':
				return new Sunniesnow.FieldList(this, data);
			case 'radio':
				return new Sunniesnow.FieldRadio(this, data);
			case 'color':
				return new Sunniesnow.FieldColor(this, data);
			case 'checkbox':
				return new Sunniesnow.FieldCheckbox(this, data);
			case 'select':
				return new Sunniesnow.FieldSelect(this, data);
		}
	}

	constructor(fieldsData) {
		this.dom = document.createElement('div');
		this.dom.classList.add('form');
		this.fieldsData = fieldsData;
		this.fields = [];
		this.inputListeners = [];
		this.populate();
	}

	addInputListener(listener) {
		this.inputListeners.push(listener);
	}

	removeInputListener(listener) {
		const index = this.inputListeners.indexOf(listener);
		if (index !== -1) {
			this.inputListeners.splice(index, 1);
		}
	}

	onInput(event) {
		for (const listener of this.inputListeners) {
			listener(event);
		}
	}

	populate() {
		for (const fieldData of this.fieldsData) {
			const field = this.createField(fieldData);
			this.fields.push(field);
			this.dom.appendChild(field.dom);
		}
		Sunniesnow.Utils.setLoadListener(this.dom, () => this.onInput());
	}

	allValid() {
		for (const field of this.fields) {
			if (field.invalid) {
				return false;
			}
			if (!field.subforms) {
				continue;
			}
			for (const subform of field.subforms) {
				if (!subform.allValid()) {
					return false;
				}
			}
		}
		return true;
	}

	values() {
		const result = {};
		for (const field of this.fields) {
			result[field.id] = field.value();
			if (!field.subforms) {
				continue;
			}
			for (const subform of field.subforms) {
				Object.assign(result, subform.values());
			}
		}
		return result;
	}
};
