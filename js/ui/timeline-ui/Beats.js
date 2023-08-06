Sunniesnow.Beats = class Beats extends Sunniesnow.TimelineUi {

	static HEIGHT = 100
	static CURSOR_WIDTH = 4
	static BEAT_WIDTH = 2
	static BEAT_FONT_SIZE = 20
	static SUBDIVISION_WIDTH = 2
	static CURSOR_COLOR = 0xffff00
	static BEAT_COLOR = 0xff0000
	static SUBDIVISION_COLOR = 0x0000ff

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
		this.createContainers();
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

	createContainers() {
		this.beatsContainer = new PIXI.Container();
		this.addChild(this.beatsContainer);
		this.textsContainer = new PIXI.Container();
		this.addChild(this.textsContainer);
	}

	update(delta) {
		this.updatePosition();
		this.updateCursor();
		this.updateBeats();
	}

	onResize() {
		const scale = (Sunniesnow.TimelineApp.height - Sunniesnow.Config.sliderHeight) / this.constructor.HEIGHT;
		this.beatsContainer.scale.y = scale;
		this.cursor.scale.y = scale;
	}

	updateCursor() {
		this.cursor.x = Sunniesnow.workspace.offset / Sunniesnow.Config.secondsPerRow * Sunniesnow.workspace.zoom * Sunniesnow.TimelineApp.width;
	}

	updateBeats() {
		this.bleed();
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
		let sprite, text;
		if (!this.beats[beat]) {
			sprite = new PIXI.Graphics(this.constructor.beatGeometry);
			text = new PIXI.Text(beat, { fontSize: this.constructor.BEAT_FONT_SIZE, fill: this.constructor.BEAT_COLOR });
			this.beats[beat] = {sprite, text};
			this.beatsContainer.addChild(sprite);
			this.textsContainer.addChild(text);
		} else {
			({sprite, text} = this.beats[beat]);
		}
		sprite.visible = text.visible = true;
		sprite.x = text.x = this.XAt(time);
		this.beats[beat].life = Sunniesnow.Config.bufferLife;
	}

	setSubdivision(beat, subdivision, time) {
		this.subdivisions[beat] ??= {};
		let sprite;
		if (!this.subdivisions[beat][subdivision]) {
			sprite = new PIXI.Graphics(this.constructor.subdivisionGeometry);
			this.subdivisions[beat][subdivision] = {sprite};
			this.beatsContainer.addChild(sprite);
		} else {
			({sprite} = this.subdivisions[beat][subdivision]);
		}
		sprite.visible = true;
		sprite.x = this.XAt(time);
		this.subdivisions[beat][subdivision].life = Sunniesnow.Config.bufferLife;
	}

	bleed() {
		for (const beat in this.beats) {
			const {sprite, text, life} = this.beats[beat];
			sprite.visible = false;
			text.visible = false;
			if (life <= 0) {
				sprite.destroy({children: true});
				this.beatsContainer.removeChild(sprite);
				text.destroy({children: true});
				this.textsContainer.removeChild(text);
				delete this.beats[beat];
			} else {
				this.beats[beat].life--;
			}
		}
		for (const beat in this.subdivisions) {
			for (const subdivision in this.subdivisions[beat]) {
				const {sprite, life} = this.subdivisions[beat][subdivision];
				sprite.visible = false;
				if (life <= 0) {
					sprite.destroy({children: true});
					this.beatsContainer.removeChild(sprite);
					delete this.subdivisions[beat][subdivision];
				} else {
					this.subdivisions[beat][subdivision].life--;
				}
			}
		}
	}
};
