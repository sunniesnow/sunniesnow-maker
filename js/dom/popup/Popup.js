Sunniesnow.Popup = class Popup {

	static BUTTONS_TAB_INDEX_START = 1;

	static stack = [];

	static active() {
		return this.stack.length > 0;
	}

	static flash() {
		if (!this.active()) {
			return;
		}
		const dom = this.stack[this.stack.length - 1].dom;
		dom.classList.add('popup-flash');
		setTimeout(() => dom.classList.remove('popup-flash'), 500);
	}

	// buttonsData: {buttonName: buttonOnClick}
	constructor(title, contentsHtml, buttonsData) {
		this.title = title;
		this.contentsHtml = contentsHtml;
		this.buttonsData = buttonsData;
		this.createDom();
		this.addEventListeners();
		this.constructor.stack.push(this);
	}

	createDom() {
		this.dom = document.createElement('div');
		this.dom.classList.add('popup');
		this.createTitleDom();
		this.createContentsDom();
		this.createButtonsDom();
		document.body.appendChild(this.dom);
	}

	createTitleDom() {
		this.titleDom = document.createElement('div');
		this.titleDom.classList.add('popup-title');
		this.titleDom.innerHTML = this.title;
		this.dom.appendChild(this.titleDom);
	}

	createContentsDom() {
		this.contentsDom = document.createElement('div');
		this.contentsDom.classList.add('popup-contents');
		if (this.contentsHtml instanceof HTMLElement) {
			this.contentsDom.appendChild(this.contentsHtml);
		} else {
			this.contentsDom.innerHTML = this.contentsHtml;
		}
		this.dom.appendChild(this.contentsDom);
	}

	createButtonsDom() {
		this.buttonsDom = document.createElement('div');
		this.buttonsDom.classList.add('popup-buttons');
		this.buttons = [];
		for (const buttonName in this.buttonsData) {
			const buttonOnClick = this.buttonsData[buttonName];
			this.buttons.push(new Sunniesnow.PopupButton(this, buttonName, buttonOnClick));
		}
		this.dom.appendChild(this.buttonsDom);
	}

	close() {
		const popped = this.constructor.stack.pop();
		if (popped !== this) {
			console.warn('Popup stack is corrupted.');
		}
		document.body.removeChild(popped.dom);
		popped.removeEventListeners();
	}

	addEventListeners() {
		this.dragging = false;
		this.titleDom.addEventListener('mousedown', event => {
			this.dragging = true;
			this.dragStartX = event.clientX;
			this.dragStartY = event.clientY;
		});
		this.mouseMoveListener = event => {
			if (!this.dragging) {
				return;
			}
			this.dom.style.left = `${this.dom.offsetLeft + event.clientX - this.dragStartX}px`;
			this.dom.style.top = `${this.dom.offsetTop + event.clientY - this.dragStartY}px`;
			this.dragStartX = event.clientX;
			this.dragStartY = event.clientY;
		};
		document.addEventListener('mousemove', this.mouseMoveListener);
		this.mouseUpListener = event => this.dragging = false;
		document.addEventListener('mouseup', this.mouseUpListener);
	}

	removeEventListeners() {
		document.removeEventListener('mousemove', this.mouseMoveListener);
		document.removeEventListener('mouseup', this.mouseUpListener);
	}
};
