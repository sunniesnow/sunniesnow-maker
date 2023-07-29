Sunniesnow.Menu = {

	ITEMS_TAB_INDEX_START: 100,
	SUBMENU_ITEMS_TAB_INDEX_START: 200,

	current: null,

	async load() {
		this.menuJson = await fetch('json/menu.json').then(response => response.json());
		this.populate();
	},

	populate() {
		this.items = [];
		this.tabIndex = this.ITEMS_TAB_INDEX_START;
		this.submenuTabIndex = this.SUBMENU_ITEMS_TAB_INDEX_START;
		for (const data of this.menuJson) {
			this.items.push(new Sunniesnow.MenuItem(data));
		}
	},

	setOnTrigger(submenuItemId, onTrigger) {
		for (const item of this.items) {
			const submenuItem = item.submenuItems.find(submenuItem => submenuItem.id === submenuItemId);
			if (submenuItem) {
				submenuItem.onTrigger = onTrigger;
				break;
			}
		}
	}
};
