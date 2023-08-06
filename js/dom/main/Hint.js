Sunniesnow.Hint = {

	registry: {focus: new Map(), hover: new Map()},

	async load() {
		this.dom = document.getElementById('hint');
	},

	register(element, hint, type) {
		if (!type) {
			this.register(element, hint, 'focus');
			this.register(element, hint, 'hover');
			return;
		}
		const registry = this.registry[type];
		if (registry.has(element)) {
			registry.get(element).hint = hint;
			return;
		}
		const entry = {hint};
		entry.onListener = event => this.dom.innerHTML = entry.hint ?? '';
		entry.offListener = event => this.dom.innerHTML = '';
		switch (type) {
			case 'focus':
				element.addEventListener('focusin', entry.onListener);
				element.addEventListener('focusout', entry.offListener);
				break;
			case 'hover':
				element.addEventListener('mouseenter', entry.onListener);
				element.addEventListener('mouseleave', entry.offListener);
				break;
		}
		registry.set(element, entry);
	},

	unregister(element, type) {
		if (!type) {
			this.unregister(element, 'focus');
			this.unregister(element, 'hover');
			return;
		}
		const registry = this.registry[type];
		if (!registry.has(element)) {
			return;
		}
		const entry = registry.get(element);
		switch (type) {
			case 'focus':
				element.removeEventListener('focusin', entry.onListener);
				element.removeEventListener('focusout', entry.offListener);
				break;
			case 'hover':
				element.removeEventListener('mouseenter', entry.onListener);
				element.removeEventListener('mouseleave', entry.offListener);
				break;
		}
		registry.delete(element);
	}

};
