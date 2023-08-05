Sunniesnow.FieldList = class FieldList extends Sunniesnow.Field {

	extractData() {
		super.extractData();
		this.subformData = this.data.subform;
		this.length = 0;
		this.items = [];
	}

	populateInputDom() {
		this.inputDom = document.createElement('div');
		this.inputDom.classList.add('field-input');
		this.listDom = document.createElement('div');
		this.listDom.classList.add('field-list');
		this.buttonsDom = document.createElement('div');
		this.addButtonDom = document.createElement('button');
		this.addButtonDom.innerHTML = 'Add';
		this.addButtonDom.addEventListener('click', event => {
			this.addItem();
			this.form.onInput(event);
		});
		this.inputDom.appendChild(this.listDom);
		this.inputDom.appendChild(this.buttonsDom);
		this.buttonsDom.appendChild(this.addButtonDom);
		this.dom.appendChild(this.inputDom);
	}

	addItem() {
		this.insert(this.length);
	}

	insert(index) {
		const item = new Sunniesnow.FieldListItem(this, index);
		if (index === this.length) {
			this.listDom.appendChild(item.dom);
		} else {
			this.listDom.insertBefore(item.dom, this.items[index].dom);
		}
		for (let i = index; i < this.length; i++) {
			this.items[i].index++;
		}
		this.items.splice(index, 0, item);
		this.length++;
		if (index === 0) {
			item.moveUpButtonDom.disabled = true;
			if (this.items[1]) {
				this.items[1].moveUpButtonDom.disabled = false;
			}
		}
		if (index === this.length - 1) {
			item.moveDownButtonDom.disabled = true;
			if (this.items[index - 1]) {
				this.items[index - 1].moveDownButtonDom.disabled = false;
			}
		}
		this.checkValidity();
	}

	remove(index) {
		const item = this.items[index];
		this.listDom.removeChild(item.dom);
		for (let i = index + 1; i < this.length; i++) {
			this.items[i].index--;
		}
		this.items.splice(index, 1);
		this.length--;
		if (index === 0 && this.items[0]) {
			this.items[0].moveUpButtonDom.disabled = true;
		}
		if (index === this.length && this.items[index - 1]) {
			this.items[index - 1].moveDownButtonDom.disabled = true;
		}
		this.checkValidity();
	}

	swap(index1, index2) {
		[index1, index2] = [Math.min(index1, index2), Math.max(index1, index2)];
		let t = this.items[index1];
		this.items[index1] = this.items[index2];
		this.items[index2] = t;
		this.items[index1].index = index1;
		this.items[index2].index = index2;
		if (index1 === 0) {
			this.items[index1].moveUpButtonDom.disabled = true;
			this.items[index2].moveUpButtonDom.disabled = false;
		}
		if (index2 === this.length - 1) {
			this.items[index1].moveDownButtonDom.disabled = false;
			this.items[index2].moveDownButtonDom.disabled = true;
		}
		t = document.createElement('div');
		this.listDom.replaceChild(t, this.items[index1].dom);
		this.listDom.replaceChild(this.items[index1].dom, this.items[index2].dom);
		this.listDom.replaceChild(this.items[index2].dom, t);
		this.checkValidity();
	}

	value() {
		return this.items.map(item => item.form.values());
	}

	checkValidity() {
		this.validityCheckDom.innerHTML = '';
		this.inputDom.classList.remove('field-input-invalid');
		this.invalid = this.items.some(item => !item.form.allValid());
		if (!this.invalid) {
			super.checkValidity();
		}
	}

};
