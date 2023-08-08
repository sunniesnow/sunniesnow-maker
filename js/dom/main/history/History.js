Sunniesnow.History = {

	MAX: 10000,

	async load() {
		this.dom = document.getElementById('history');

		Sunniesnow.Menu.set('undo', () => this.operations?.[this.pointer - 1], () => this.undoLast());
		Sunniesnow.Menu.set('redo', () => this.operations?.[this.pointer + 1], () => this.redoNext());
	},

	reloadProject() {
		this.dom.innerHTML = '';
		this.initializeOperations();
	},

	initializeOperations() {
		this.operations = [];
		this.pointer = -1;
		this.addAndRun(new Sunniesnow.Operation({ name: 'Load project' }));
	},

	addAndRun(operation) {
		if (this.pointer < this.operations.length - 1) {
			for (let i = this.operations.length - 1; i > this.pointer; i--) {
				this.operations[i].dom.remove();
				this.operations[i] = undefined;
			}
			this.operations.length = this.pointer + 1;
		}
		this.operations.push(operation);
		this.dom.appendChild(operation.dom);
		operation.index = this.pointer + 1;
		this.seekTo(operation);
		this.dom.scrollTo(this.dom.scrollLeft, this.dom.scrollHeight);
		if (this.pointer >= this.MAX) {
			const index = this.pointer - this.MAX;
			this.operations[index].dom.remove();
			this.operations[index] = undefined;
		}
	},

	seekTo(index) {
		let operation;
		if (index instanceof Sunniesnow.Operation) {
			operation = index;
			index = operation.index;
		} else {
			operation = this.operations[index];
		}
		if (index === this.pointer) {
			return;
		}
		if (index < this.pointer) {
			for (let i = this.pointer; i > index; i--) {
				this.operations[i].undo();
			}
		} else {
			for (let i = this.pointer + 1; i <= index; i++) {
				this.operations[i].redo();
			}
		}
		this.operations[this.pointer]?.dom.classList.remove('history-pointer');
		this.pointer = index;
		operation.dom.classList.add('history-pointer');
	},

	undoLast() {
		if (this.operations[this.pointer - 1]) {
			this.seekTo(this.pointer - 1);
		}
	},

	redoNext() {
		if (this.operations[this.pointer + 1]) {
			this.seekTo(this.pointer + 1);
		}
	}
	
};
