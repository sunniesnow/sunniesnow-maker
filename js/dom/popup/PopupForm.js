Sunniesnow.PopupForm = class PopupForm extends Sunniesnow.Popup {

	constructor(title, form, onSubmit) {
		super(title, form.dom, {OK: () => this.ok(), Cancel: () => this.close()});
		this.form = form;
		this.onSubmit = onSubmit;
		this.form.addInputListener(event => {
			this.buttons[0].dom.disabled = !this.form.allValid();
		});
	}

	ok() {
		if (!this.form.allValid()) {
			return;
		}
		this.onSubmit(this.form.values());
		this.close();
	}
};
