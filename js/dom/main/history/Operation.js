Sunniesnow.Operation = class Operation {

	static run(data) {
		const operation = new Sunniesnow.Operation(data);
		Sunniesnow.History.addAndRun(operation);
		return operation;
	}

	constructor(data) {
		this.data = data;
		this.extractData();
		this.done = false;
		this.populate();
	}

	extractData() {
		this.redoFunction = this.data.redo;
		this.undoFunction = this.data.undo;
		this.name = this.data.name;
		this.icon = this.data.icon;
		this.info = this.data.info ?? {};
	}

	redo() {
		if (this.done) {
			console.error('Operation already done');
			return;
		}
		this.backupWorkspace = Sunniesnow.workspace.toObjectSync();
		this.redoFunction?.();
		this.done = true;
		this.dom.classList.add('operation-done');
	}

	undo() {
		if (!this.done) {
			console.error('Operation not done yet');
			return;
		}
		this.undoFunction?.();
		Sunniesnow.workspace.restoreFromObject(this.backupWorkspace);
		this.done = false;
		this.dom.classList.remove('operation-done');
	}

	populate() {
		this.createDom();
		this.populateIcon();
		this.populateName();
		this.addEventListeners();
	}

	createDom() {
		this.dom = document.createElement('div');
		this.dom.classList.add('operation');
	}

	populateIcon() {
		this.iconDivDom = document.createElement('div');
		this.iconDivDom.classList.add('operation-icon');
		this.dom.appendChild(this.iconDivDom);

		if (!this.icon) {
			return;
		}
		this.iconDom = Sunniesnow.Icons.createDom(this.icon);
		if (!this.iconDom) {
			return;
		}
		this.iconDivDom.appendChild(this.iconDom);
	}

	populateName() {
		this.nameDom = document.createElement('div');
		this.nameDom.classList.add('operation-name');
		this.nameDom.innerHTML = this.name;
		this.dom.appendChild(this.nameDom);
	}

	addEventListeners() {
		this.dom.addEventListener('click', () => Sunniesnow.History.seekTo(this));
	}

};
