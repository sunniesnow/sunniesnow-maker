Sunniesnow.Beats = class Beats extends PIXI.Container {

	static HEIGHT = 100;
	static CURSOR_WIDTH = 4;
	static BEAT_WIDTH = 2;
	static SUBDIVISION_WIDTH = 2;
	static CURSOR_COLOR = 0xffff00;
	static BEAT_COLOR = 0xff0000;
	static SUBDIVISION_COLOR = 0x0000ff;

	static async load() {
		this.cursorGeometry = this.createCursorGeometry();
		this.beatGeometry = this.createBeatGeometry();
		this.subdivisionGeometry = this.createSubdivisionGeometry();
	}

	static createCursorGeometry() {
		const graphics = new PIXI.Graphics();
		graphics.lineStyle(this.CURSOR_WIDTH, this.CURSOR_COLOR);
		graphics.moveTo(0, 0);
		graphics.lineTo(0, this.HEIGHT);
		graphics.finishPoly();
		return graphics.geometry;
	}

	static createBeatGeometry() {
		const graphics = new PIXI.Graphics();
		graphics.lineStyle(this.BEAT_WIDTH, this.BEAT_COLOR);
		graphics.moveTo(0, 0);
		graphics.lineTo(0, this.HEIGHT);
		graphics.finishPoly();
		return graphics.geometry;
	}

	static createSubdivisionGeometry() {
		const graphics = new PIXI.Graphics();
		graphics.lineStyle(this.SUBDIVISION_WIDTH, this.SUBDIVISION_COLOR);
		graphics.moveTo(0, 0);
		graphics.lineTo(0, this.HEIGHT);
		graphics.finishPoly();
		return graphics.geometry;
	}

	constructor() {
		super();
		this.createBeatsContainer();
		this.createCursor();
		this.beats = {};
		this.subdivisions = {};
		Sunniesnow.TimelineApp.app.renderer.on('resize', this.onResize.bind(this));
		this.onResize();
	}

	createCursor() {
		this.cursor = new PIXI.Graphics(this.constructor.cursorGeometry);
		this.addChild(this.cursor);
	}

	createBeatsContainer() {
		this.beatsContainer = new PIXI.Container();
		this.addChild(this.beatsContainer);
	}

	update(delta) {
		this.updatePosition();
		this.updateCursor();
		this.updateBeats();
	}

	updatePosition() {
		if (!Sunniesnow.Editor.music) {
			return;
		}
		const anchorX = Sunniesnow.workspace.offset / Sunniesnow.Config.secondsPerRow * Sunniesnow.workspace.zoom * Sunniesnow.TimelineApp.width;
		this.x = Sunniesnow.TimelineApp.width * Sunniesnow.workspace.cursorPosition - anchorX;
	}

	onResize() {
		this.scale.y = (Sunniesnow.TimelineApp.height - Sunniesnow.Config.sliderHeight) / this.constructor.HEIGHT;
	}

	updateCursor() {
		this.cursor.x = Sunniesnow.workspace.offset / Sunniesnow.Config.secondsPerRow * Sunniesnow.workspace.zoom * Sunniesnow.TimelineApp.width;
	}

	updateBeats() {
		this.bleedBeats();
		const [min, max] = Sunniesnow.workspace.timeWindow();
		const offset = Sunniesnow.Editor.project.offset;
		const baseBps = Sunniesnow.Editor.project.baseBps;
		const bpmChanges = Sunniesnow.Editor.project.bpmChangesCache;
		const subdivision = Sunniesnow.workspace.subdivision;
		let index = Sunniesnow.Utils.bisectRight(bpmChanges, e => e.time - min);
		if (bpmChanges.length === 0) {
			const firstBeat = Math.floor((min - offset) * baseBps);
			const firstTime = firstBeat / baseBps + offset;
			const lastBeat = Math.ceil((max - offset) * baseBps);
			for (let i = firstBeat; i <= lastBeat; i++) {
				this.setBeat(i, (i - firstBeat) / baseBps + firstTime);
				for (let j = 1; j < subdivision; j++) {
					this.setSubdivision(i, j, (i - firstBeat + j / subdivision) / baseBps + firstTime);
				}
			}
		} else {
			let last = bpmChanges[index];
			if (!last) {
				const firstBeat = Math.floor((min - offset) * baseBps);
				last = {beat: firstBeat, time: firstBeat / baseBps + offset, bps: baseBps};
			}
			let next = bpmChanges[index + 1];
			let time;
			const updateTime = beat => {
				time = (beat - last.beat) / last.bps + last.time;
				if (time > max) {
					return true;
				}
				if (time >= next.time) {
					index++;
					last = next;
					next = bpmChanges[index + 1];
					time = (beat - last.beat) / last.bps + last.time;
				}
			}
			let i = Math.floor((min - last.time) * last.bps + last.beat);
			while (true) {
				if (updateTime(i)) {
					break;
				}
				this.setBeat(i, time);
				for (let j = 1; j < subdivision; j++) {
					if (updateTime(i + j / subdivision)) {
						break;
					}
					this.setSubdivision(i, j, time);
				}
				i++;
			}
		}
	}

	setBeat(beat, time) {
		let beatUi = this.beats[beat];
		if (!beatUi) {
			this.beats[beat] = beatUi = new PIXI.Graphics(this.constructor.beatGeometry);
			this.beatsContainer.addChild(beatUi);
		}
		beatUi.visible = true;
		beatUi.x = time / Sunniesnow.Config.secondsPerRow * Sunniesnow.workspace.zoom * Sunniesnow.TimelineApp.width;
		beatUi.life = Sunniesnow.Config.bufferLife;
	}

	setSubdivision(beat, subdivision, time) {
		this.subdivisions[beat] ??= {};
		let subdivisionUi = this.subdivisions[beat][subdivision];
		if (!subdivisionUi) {
			this.subdivisions[beat][subdivision] = subdivisionUi = new PIXI.Graphics(this.constructor.subdivisionGeometry);
			this.beatsContainer.addChild(subdivisionUi);
		}
		subdivisionUi.visible = true;
		subdivisionUi.x = time / Sunniesnow.Config.secondsPerRow * Sunniesnow.workspace.zoom * Sunniesnow.TimelineApp.width;
		subdivisionUi.life = Sunniesnow.Config.bufferLife;
	}

	bleedBeats() {
		for (const beat in this.beats) {
			const beatUi = this.beats[beat];
			beatUi.visible = false;
			beatUi.life--;
			if (beatUi.life <= 0) {
				beatUi.destroy({children: true});
				this.beatsContainer.removeChild(beatUi);
				delete this.beats[beat];
			}
		}
		for (const beat in this.subdivisions) {
			for (const subdivision in this.subdivisions[beat]) {
				const subdivisionUi = this.subdivisions[beat][subdivision];
				subdivisionUi.visible = false;
				subdivisionUi.life--;
				if (subdivisionUi.life <= 0) {
					subdivisionUi.destroy({children: true});
					this.beatsContainer.removeChild(subdivisionUi);
					delete this.subdivisions[beat][subdivision];
				}
			}
		}
	}
};
