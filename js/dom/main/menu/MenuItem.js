Sunniesnow.MenuItem = class MenuItem {
	constructor({id, name, shortcut, items}) {
		this.id = id;
		this.name = name;
		this.shortcut = shortcut;
		this.index = Sunniesnow.Menu.items.length;
		this.createDom();
		this.createMasterDom();
		this.createSubmenu(items);
		this.addEventListeners();
	}

	createDom() {
		this.dom = document.createElement('div');
		this.dom.id = this.id;
		this.dom.classList.add('menu-item');
		Sunniesnow.Menu.dom.appendChild(this.dom);
	}

	createMasterDom() {
		this.masterDom = document.createElement('div');
		this.masterDom.classList.add('menu-master');
		this.masterDom.tabIndex = Sunniesnow.Menu.tabIndex++;
		this.masterDom.innerHTML = this.name.replace(new RegExp(this.shortcut, 'i'), x => `<u>${x}</u>`);
		this.dom.appendChild(this.masterDom);
	}

	createSubmenu(items) {
		this.submenuDom = document.createElement('div');
		this.submenuDom.classList.add('menu-submenu');
		this.submenuItems = [];
		for (const itemData of items) {
			if (itemData === 'separator') {
				this.submenuDom.appendChild(document.createElement('hr'));
				continue;
			}
			this.submenuItems.push(new Sunniesnow.SubmenuItem(this, itemData));
		}
		this.dom.appendChild(this.submenuDom);
	}

	focus() {
		this.masterDom.focus();
	}

	blur() {
		this.masterDom.blur();
		Sunniesnow.Menu.current = null;
		this.submenuDom.style.display = 'none';
	}

	addEventListeners() {
		this.focused = false;
		this.masterDom.addEventListener('focusout', event => {
			this.focused = false;
			if (!this.submenuDom.contains(event.relatedTarget)) {
				Sunniesnow.Menu.current = null;
				this.submenuDom.style.display = 'none';
			}
		});
		this.masterDom.addEventListener('focusin', event => {
			if (Sunniesnow.Popup.active()) {
				Sunniesnow.Popup.flash();
				return;
			}
			this.focused = true;
			Sunniesnow.Menu.current = this;
			this.submenuDom.style.display = 'block';
		});
		this.masterDom.addEventListener('mouseleave', event => {
			if (Sunniesnow.Popup.active()) {
				this.blur();
			}
		});
		window.addEventListener('blur', event => event => {
			this.focused = false;
			Sunniesnow.Menu.current = null;
			this.submenuDom.style.display = 'none';
		});
		document.addEventListener('keydown', event => {
			if (Sunniesnow.Menu.current !== this) {
				return;
			}
			if (event.key === 'ArrowLeft' || event.key === 'h') {
				if (this.index > 0) {
					this.blur();
					Sunniesnow.Menu.items[this.index - 1].focus();
					event.stopImmediatePropagation();
				}
			}
			if (event.key === 'ArrowRight' || event.key === 'l') {
				if (this.index < Sunniesnow.Menu.items.length - 1) {
					this.blur();
					Sunniesnow.Menu.items[this.index + 1].focus();
					event.stopImmediatePropagation();
				}
			}
			if (event.key === 'Escape') {
				this.blur();
				event.stopImmediatePropagation();
			}
			if (this.focused && (event.key === 'ArrowDown' || event.key === 'j')) {
				event.preventDefault();
				this.submenuItems[0]?.focus();
				event.stopImmediatePropagation();
			}
		});
		document.addEventListener('mousedown', event => {
			if (!this.submenuDom.contains(event.target)) {
				this.blur();
			}
		});
		document.addEventListener('keydown', event => {
			if (Sunniesnow.Popup.active()) {
				return;
			}
			if (event.key.toLowerCase() === this.shortcut && event.altKey) {
				event.preventDefault();
				this.focus();
				event.stopImmediatePropagation();
			}
		})
	}
}