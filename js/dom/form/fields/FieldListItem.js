Sunniesnow.FieldListItem = class FieldListItem {

	constructor(fieldList, index) {
		this.fieldList = fieldList;
		this.index = index;
		this.disabled = false;
		this.form = new Sunniesnow.Form(fieldList.subformData);
		this.form.addInputListener(event => this.fieldList.onInput(event));
		this.populate();
	}

	populate() {
		this.dom = document.createElement('div');
		this.dom.classList.add('field-list-item');
		this.dom.appendChild(this.form.dom);
		this.createButtons();
	}

	createButtons() {
		this.buttonsDom = document.createElement('div');
		this.dom.appendChild(this.buttonsDom);
		this.createInsertButton();
		this.createAppendButton();
		this.createRemoveButton();
		this.createMoveUpButton();
		this.createMoveDownButton();
		this.dom.appendChild(document.createElement('hr'));
	}

	createInsertButton() {
		this.insertButtonDom = document.createElement('button');
		this.insertButtonDom.type = 'button';
		this.insertButtonDom.innerHTML = 'Insert';
		this.insertButtonDom.addEventListener('click', () => this.insert());
		this.buttonsDom.appendChild(this.insertButtonDom);
	}

	createAppendButton() {
		this.appendButtonDom = document.createElement('button');
		this.appendButtonDom.type = 'button';
		this.appendButtonDom.innerHTML = 'Append';
		this.appendButtonDom.addEventListener('click', () => this.append());
		this.buttonsDom.appendChild(this.appendButtonDom);
	}

	createRemoveButton() {
		this.removeButtonDom = document.createElement('button');
		this.removeButtonDom.type = 'button';
		this.removeButtonDom.innerHTML = 'Remove';
		this.removeButtonDom.addEventListener('click', () => this.remove());
		this.buttonsDom.appendChild(this.removeButtonDom);
	}

	createMoveUpButton() {
		this.moveUpButtonDom = document.createElement('button');
		this.moveUpButtonDom.type = 'button';
		this.moveUpButtonDom.innerHTML = 'Move Up';
		this.moveUpButtonDom.addEventListener('click', () => this.moveUp());
		this.buttonsDom.appendChild(this.moveUpButtonDom);
	}

	createMoveDownButton() {
		this.moveDownButtonDom = document.createElement('button');
		this.moveDownButtonDom.type = 'button';
		this.moveDownButtonDom.innerHTML = 'Move Down';
		this.moveDownButtonDom.addEventListener('click', () => this.moveDown());
		this.buttonsDom.appendChild(this.moveDownButtonDom);
	}

	insert() {
		this.fieldList.insert(this.index);
	}

	append() {
		this.fieldList.insert(this.index + 1);
	}

	remove() {
		this.fieldList.remove(this.index);
	}

	moveUp() {
		this.fieldList.swap(this.index, this.index - 1);
	}

	moveDown() {
		this.fieldList.swap(this.index, this.index + 1);
	}

	setDisabled(disabled) {
		if (this.disabled === disabled) {
			return;
		}
		this.disabled = disabled;
		this.form.setDisabled(disabled);
		for (const buttonDom of this.buttonsDom.children) {
			buttonDom.disabled = disabled;
		}
	}

	purge() {
		this.form.purge();
	}

};
