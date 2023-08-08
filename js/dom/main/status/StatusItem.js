Sunniesnow.StatusItem = class StatusItem {

	constructor(data) {
		this.data = data;
		this.extractData();
		this.populate();
	}

	extractData() {
		this.id = this.data.id;
		this.label = this.data.label;
		this.hint = this.data.hint;
		this.condition = this.data.condition;
		this.contents = this.data.contents;
		this.onClick = this.data.onClick;
	}

	populate() {
		this.createDom();
		this.populateLabelDom();
		this.populateContentsDom();
		this.setHint();
	}

	createDom() {
		this.dom = document.createElement('div');
		this.dom.classList.add('status-item');
		this.dom.title = this.hint ?? '';
		if (this.onClick) {
			this.dom.addEventListener('click', event => {
				if (!this.condition || this.condition()) {
					this.onClick();
				}
			});
		}
	}

	setHint() {
		if (!this.hint) {
			return;
		}
		Sunniesnow.Hint.register(this.dom, this.hint, 'hover');
	}

	populateLabelDom() {
		this.labelDom = document.createElement('div');
		this.labelDom.classList.add('status-item-label');
		this.labelDom.innerHTML = this.label;
		this.dom.appendChild(this.labelDom);
	}

	populateContentsDom() {
		this.contentsDom = document.createElement('div');
		this.contentsDom.classList.add('status-item-contents');
		this.dom.appendChild(this.contentsDom);
	}

	update() {
		this.contentsDom.textContent = !this.condition || this.condition() ? this.contents() : '';
	}

};
