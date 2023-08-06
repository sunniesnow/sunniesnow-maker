Sunniesnow.FieldRadio = class FieldRadio extends Sunniesnow.Field {

	constructor(form, data) {
		super(form, data);
		this.hasExtraValues = true;
	}

	getExtraValues() {
		const result = {};
		for (const item of this.items) {
			if (item.form) {
				Object.assign(result, item.form.values());
			}
		}
		return result;
	}

	extractData() {
		super.extractData();
		this.itemsData = this.data.items;
		this.items = [];
	}

	createInputDom() {
		this.inputDom = document.createElement('div');
		this.inputDom.classList.add('field-radio');
		for (const itemData of this.itemsData) {
			this.createItemDom(itemData);
		}
	}

	createItemDom(itemData) {
		const item = new Sunniesnow.FieldRadioItem(this, itemData);
		this.items.push(item);
		this.inputDom.appendChild(item.dom);
	}

	getValue() {
		for (const item of this.items) {
			if (item.inputDom.checked) {
				return item.value;
			}
		}
		return null;
	}

	onInput(event) {
		this.updateSubformsDisabled();
		super.onInput(event);
	}

	setInputDomDisabled(disabled) {
		for (const item of this.items) {
			item.setDisabled(disabled);
		}
	}

	updateSubformsDisabled() {
		for (const item of this.items) {
			item.updateFormDisabled();
		}
	}

	purge() {
		super.purge();
		for (const item of this.items) {
			item.purge();
		}
	}

};
