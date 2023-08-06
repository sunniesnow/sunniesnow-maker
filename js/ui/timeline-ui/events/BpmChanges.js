Sunniesnow.BpmChanges = class BpmChanges extends Sunniesnow.TimelineUi {

	static COLOR = 0xff00ff
	static THICKNESS = 2
	static FONT_SIZE = 20

	static async load() {
		this.lineGeometry = this.createLineGeometry();
	}

	static createLineGeometry() {
		const graphics = new PIXI.Graphics();
		graphics.lineStyle(this.THICKNESS, this.COLOR);
		graphics.moveTo(0, 0);
		graphics.lineTo(0, Sunniesnow.Config.waveformHeight);
		graphics.finishPoly();
		return graphics.geometry;
	}

	constructor() {
		super();
		this.clear();
	}

	clear() {
		if (this.lines) {
			this.lines.forEach(({sprite, text}) => {
				this.removeChild(sprite);
				this.removeChild(text);
				sprite.destroy({children: true});
				text.destroy({children: true});
			})
		}
		this.lines = new Map();
	}

	update(delta) {
		this.updatePosition();
		this.updateLines();
	}

	updateLines() {
		this.bleed();
		const [min, max] = Sunniesnow.workspace.timeWindow();
		const bpmChanges = Sunniesnow.Editor.project.bpmChangesCache;
		let index = Sunniesnow.Utils.bisectLeft(bpmChanges, e => e.time - min);
		while (index < bpmChanges.length && bpmChanges[index].time <= max) {
			this.setLine(bpmChanges[index]);
			index++;
		}
	}

	setLine(bpmChange) {
		const {time, bps} = bpmChange;
		const bpm = bps * 60;
		let sprite, text;
		if (!this.lines.has(bpmChange)) {
			sprite = new PIXI.Graphics(this.constructor.lineGeometry);
			text = new PIXI.Text(bpm.toFixed(3), {fontSize: this.constructor.FONT_SIZE, fill: this.constructor.COLOR});
			this.lines.set(bpmChange, {sprite, text});
			this.addChild(sprite);
			this.addChild(text);
		} else {
			({sprite, text} = this.lines.get(bpmChange));
		}
		sprite.visible = text.visible = true;
		sprite.x = text.x = this.XAt(time);
		this.lines.get(bpmChange).life = Sunniesnow.Config.bufferLife;
	}

	bleed() {
		this.lines.forEach(object => {
			const {sprite, text, life} = object;
			sprite.visible = false;
			text.visible = false;
			if (life <= 0) {
				this.removeChild(sprite);
				this.removeChild(text);
				sprite.destroy({children: true});
				text.destroy({children: true});
				this.lines.delete(object);
			} else {
				object.life--;
			}
		});
	}
};
