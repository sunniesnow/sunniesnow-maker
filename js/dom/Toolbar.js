Sunniesnow.Toolbar = {

	TAB_INDEX_START: 300,

	buttons: {},

	async load() {
		this.toolbarJson = await fetch('json/toolbar.json').then(response => response.json());
		this.populate();
	},

	populate() {
		this.dom = document.getElementById('toolbar');
		for (const id of this.toolbarJson) {
			if (id === 'separator') {
				this.appendSeparator();
			} else {
				this.appendButton(id);
			}
		}
	},

	appendSeparator() {
		const separator = document.createElement('div');
		separator.classList.add('toolbar-separator');
		separator.innerHTML = '|';
		this.dom.appendChild(separator);
	},

	appendButton(id) {
		const button = document.createElement('div');
		button.classList.add('toolbar-button');
		button.title = Sunniesnow.Menu.submenuItems[id].name;
		button.tabIndex = this.TAB_INDEX_START + Object.keys(this.buttons).length;
		const shortcut = Sunniesnow.Menu.submenuItems[id].shortcut;
		if (shortcut) {
			button.title += ` (${shortcut})`;
		}
		button.appendChild(Sunniesnow.Icons.createDom(id));
		this.buttons[id] = button;
		this.addEventListeners(id);
		this.dom.appendChild(button);
	},

	addEventListeners(id) {
		this.buttons[id].addEventListener('click', event => {
			if (Sunniesnow.Popup.active()) {
				Sunniesnow.Popup.flash();
				return;
			}
			Sunniesnow.Menu.submenuItems[id].trigger();
		});
		this.buttons[id].addEventListener('mouseenter', event => {
			Sunniesnow.Dom.hint.innerHTML = Sunniesnow.Menu.submenuItems[id].hint;
		});
		this.buttons[id].addEventListener('mouseleave', event => {
			Sunniesnow.Dom.hint.innerHTML = '';
		});
		this.buttons[id].addEventListener('focus', event => {
			Sunniesnow.Dom.hint.innerHTML = Sunniesnow.Menu.submenuItems[id].hint;
		});
		this.buttons[id].addEventListener('blur', event => {
			Sunniesnow.Dom.hint.innerHTML = '';
		});
		document.addEventListener('keydown', event => {
			if (document.activeElement !== this.buttons[id]) {
				return;
			}
			if (event.key === 'Enter') {
				event.preventDefault();
				Sunniesnow.Menu.submenuItems[id].trigger();
			} else if (event.key === 'Escape') {
				event.preventDefault();
				this.buttons[id].blur();
			}
		});
	}
};
