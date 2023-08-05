Sunniesnow.Project = class Project {

	static async load() {
		Sunniesnow.Menu.setOnTrigger('new', () => this.userNewPopup());
	}

	constructor(data) {
		this.pathDig = data.path.split('/');
		this.name = this.pathDig[this.pathDig.length - 1];
		this.title = data.title;
		this.musicBlob = data.music;
		this.artist = data.artist;
		this.baseBps = data.baseBpm / 60;
		this.offset = data.offset;
		this.bpmChanges = [];
		this.chartList = [];

		this.bpmChangesCache = [];

		this.workspace = new Sunniesnow.Workspace();
		Sunniesnow.workspace = this.workspace;
	}

	static userNew(data) {
		const project = new this(data);
		project.chartList = data.charts.map(chartData => {
			return Sunniesnow.Chart.userNew(project, chartData);
		});
		return project;
	}

	static userNewPopup() {
		new Sunniesnow.PopupForm('New project', new Sunniesnow.FormNew(), values => {
			const project = this.userNew(values);
			Sunniesnow.Editor.project = project;
			Sunniesnow.Editor.save();
			Sunniesnow.Editor.reloadProject();
		});
	}

	localStorageKey() {
		return this.constructor.localStorageKey(this.pathDig.join('/'));
	}

	static localStorageKey(path) {
		return `projects/${path}`;
	}

	async toObject() {
		const charts = [];
		for (const chart of this.chartList) {
			charts.push(await chart.toObject());
		}
		const bpmChanges = [];
		for (const bpmChange of this.bpmChanges) {
			bpmChanges.push(await bpmChange.toObject());
		}
		return {
			path: this.pathDig.join('/'),
			title: this.title,
			music: await Sunniesnow.Utils.blobToBase64(this.musicBlob),
			artist: this.artist,
			baseBpm: this.baseBps * 60,
			offset: this.offset,
			charts,
			bpmChanges,
			workspace: await this.workspace.toObject()
		};
	}

	static async fromObject(object) {
		const data = Object.assign({}, object);
		data.music = await Sunniesnow.Utils.base64ToBlob(data.music);
		const project = new this(data);
		for (let i = 0; i < object.charts.length; i++) {
			project.chartList[i] = await Sunniesnow.Chart.fromObject(project, object.charts[i]);
		}
		for (let i = 0; i < object.bpmChanges.length; i++) {
			project.bpmChanges[i] = await Sunniesnow.BpmChange.fromObject(project, object.bpmChanges[i]);
		}
		project.workspace = await Sunniesnow.Workspace.fromObject(object.workspace);
		Sunniesnow.workspace = project.workspace;
		project.flushBpmChangesCache();
		return project;
	}

	flushBpmChangesCache() {
		this.bpmChangesCache = [];
		if (this.bpmChanges.length === 0) {
			return;
		}
		if (this.bpmChanges[0].beat >= 0) {
			let last = {time: this.offset, beat: 0, bps: this.baseBps};
			for (const {beat, bps} of this.bpmChanges) {
				const time = last.time + (beat - last.beat) / last.bps;
				last = {time, beat, bps};
				this.bpmChangesCache.push(last);
			}
		} else {
			const nonnegativeIndex = Sunniesnow.Utils.bisectLeft(this.bpmChanges, e => e.beat);
			let last = {time: this.offset, beat: 0};
			for (let i = nonnegativeIndex - 1; i >= 0; i--) {
				const {beat, bps} = this.bpmChanges[i];
				const time = last.time - (last.beat - beat) / bps;
				last = {time, beat, bps};
				this.bpmChangesCache.unshift(last);
			}
			last = this.bpmChanges[nonnegativeIndex - 1];
			for (let i = nonnegativeIndex; i < this.bpmChanges.length; i++) {
				const time = last.time + (beat - last.beat) / last.bps;
				last = {time, beat, bps};
				this.bpmChangesCache.push(last);
			}
		}
	}

	timeAt(beat) {
		const index = Sunniesnow.Utils.bisectRight(this.bpmChangesCache, e => e.beat - beat);
		if (index < 0) {
			if (this.bpmChangesCache.length === 0) {
				return this.offset + beat / this.baseBps;
			} else {
				const first = this.bpmChangesCache[0];
				return first.time - (first.beat - beat) / this.baseBps;
			}
		} else {
			const last = this.bpmChangesCache[index];
			return last.time + (beat - last.beat) / last.bps;
		}
	}

	beatAt(time) {
		const index = Sunniesnow.Utils.bisectRight(this.bpmChangesCache, e => e.time - time);
		if (index < 0) {
			if (this.bpmChangesCache.length === 0) {
				return (time - this.offset) * this.baseBps;
			} else {
				const first = this.bpmChangesCache[0];
				return first.beat - (first.time - time) * this.baseBps;
			}
		} else {
			const last = this.bpmChangesCache[index];
			return last.beat + (time - last.time) * last.bps;
		}
	}

};
