Sunniesnow.PopupButton = class PopupButton {
	constructor(popup, name, onClick) {
		this.popup = popup;
		this.name = name;
		this.onClick = onClick;
		this.createDom();
	}

	createDom() {
		this.dom = document.createElement('button');
		this.dom.tabIndex = Sunniesnow.Popup.BUTTONS_TAB_INDEX_START + this.popup.buttons.length;
		this.dom.classList.add('popup-button');
		this.dom.innerHTML = this.name;
		this.dom.addEventListener('click', () => this.onClick());
		this.popup.buttonsDom.appendChild(this.dom);
	}
};
