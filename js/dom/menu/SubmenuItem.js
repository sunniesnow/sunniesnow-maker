Sunniesnow.SubmenuItem = class SubmenuItem {
	constructor(menuItem, {id, name, shortcut, hint}) {
		this.menuItem = menuItem;
		this.id = id;
		this.index = menuItem.submenuItems.length;
		this.name = name;
		this.shortcut = shortcut;
		this.hint = hint;
		this.createDom();
		this.createNameDom();
		this.createShortcutDom();
		this.addEventListeners();
	}

	createDom() {
		this.dom = document.createElement('div');
		this.dom.id = this.id;
		this.dom.classList.add('menu-submenu-item');
		this.dom.tabIndex = Sunniesnow.Menu.submenuTabIndex++;
		this.dom.title = this.hint;
		this.menuItem.submenuDom.appendChild(this.dom);
	}

	createNameDom() {
		this.nameDom = document.createElement('span');
		this.nameDom.classList.add('menu-submenu-item-name');
		this.nameDom.innerHTML = this.name;
		this.dom.appendChild(this.nameDom);
	}

	createShortcutDom() {
		if (!this.shortcut) {
			return;
		}
		this.shortcutDom = document.createElement('span');
		this.shortcutDom.classList.add('menu-submenu-item-shortcut');
		this.shortcutDom.innerHTML = this.shortcut.replace(/[^+]+/g, x => `<kbd>${x}</kbd>`);
		this.dom.appendChild(this.shortcutDom);
	}

	focus() {
		this.dom.focus();
	}

	blur() {
		this.dom.blur();
	}

	trigger() {
		console.log('trigger', this.id);
		this.menuItem.blur();
		this.onTrigger?.();
	}

	addEventListeners() {
		this.focused = false;
		this.dom.addEventListener('focusout', event => {
			this.focused = false;
			Sunniesnow.Dom.hint.innerHTML = '';
			if (event.relatedTarget && !this.menuItem.submenuDom.contains(event.relatedTarget)) {
				this.menuItem.blur();
			}
		});
		this.dom.addEventListener('focusin', event => {
			this.focused = true;
			Sunniesnow.Dom.hint.innerHTML = this.hint;
		});
		window.addEventListener('blur', event => this.focused = false);
		document.addEventListener('keydown', event => {
			if (!this.focused) {
				return;
			}
			if (event.key === 'ArrowUp' || event.key === 'k') {
				event.preventDefault();
				if (this.index === 0) {
					this.menuItem.focus();
				} else {
					this.menuItem.submenuItems[this.index - 1].focus();
				}
				event.stopImmediatePropagation();
			}
			if (event.key === 'ArrowDown' || event.key === 'j') {
				event.preventDefault();
				this.menuItem.submenuItems[this.index + 1]?.focus();
				event.stopImmediatePropagation();
			}
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				this.trigger();
				event.stopImmediatePropagation();
			}
		});
		this.dom.addEventListener('click', event => this.trigger());
		this.dom.addEventListener('mouseleave', event => this.blur());
		this.dom.addEventListener('mouseenter', event => this.focus());
		this.addShortcutEventListeners();
	}

	addShortcutEventListeners() {
		if (!this.shortcut) {
			return;
		}
		const shortcutKeys = this.shortcut.split('+');
		const ctrlIndex = shortcutKeys.indexOf('Ctrl');
		if (ctrlIndex !== -1) {
			this.ctrl = true;
			shortcutKeys.splice(ctrlIndex, 1);
		} else {
			this.ctrl = false;
		}
		const shiftIndex = shortcutKeys.indexOf('Shift');
		if (shiftIndex !== -1) {
			this.shift = true;
			shortcutKeys.splice(shiftIndex, 1);
		} else {
			this.shift = false;
		}
		const altIndex = shortcutKeys.indexOf('Alt');
		if (altIndex !== -1) {
			this.alt = true;
			shortcutKeys.splice(altIndex, 1);
		} else {
			this.alt = false;
		}
		this.shortcutKey = shortcutKeys[0].toLowerCase();
		if (this.shortcutKey === 'spacebar') {
			this.shortcutKey = ' ';
		}
		document.addEventListener('keydown', event => {
			if (Sunniesnow.Menu.current) {
				return;
			}
			if (event.key.toLowerCase() === this.shortcutKey) {
				if (this.ctrl === event.ctrlKey && this.shift === event.shiftKey && this.alt === event.altKey) {
					event.preventDefault();
					this.trigger();
					event.stopImmediatePropagation();
				}
			}
		});
	}
};
