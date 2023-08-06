Sunniesnow.BasicGrid = class BasicGrid extends PIXI.Container {

	static COLOR = 0x7f7f7f;

	static async load() {
		this.gridGeometry = this.createGridGeometry();
	}

	static createGridGeometry() {
		const w2 = Sunniesnow.Config.width / 2;
		const h2 = Sunniesnow.Config.height / 2;
		const wn = 8; // 100 / 12.5
		const hn = 4; // 50 / 12.5
		const scale = Sunniesnow.Config.scale * 12.5;
		const graphics = new PIXI.Graphics();
		graphics.lineStyle(2, this.COLOR);
		graphics.moveTo(0, h2);
		graphics.lineTo(0, -h2);
		graphics.moveTo(-w2, 0);
		graphics.lineTo(w2, 0);
		for (let i = 1; i <= wn; i++) {
			const x = i * scale;
			graphics.moveTo(x, hn * scale);
			graphics.lineTo(x, -hn * scale);
			graphics.moveTo(-x, hn * scale);
			graphics.lineTo(-x, -hn * scale);
		}
		for (let i = 1; i <= hn; i++) {
			const y = i * scale;
			graphics.moveTo(wn * scale, y);
			graphics.lineTo(-wn * scale, y);
			graphics.moveTo(wn * scale, -y);
			graphics.lineTo(-wn * scale, -y);
		}
		graphics.finishPoly();
		return graphics.geometry;
	}

	constructor() {
		super();
		this.grid = new PIXI.Graphics(this.constructor.gridGeometry);
		this.grid.alpha = 0.3;
		this.addChild(this.grid);
		this.x = Sunniesnow.Config.width / 2;
		this.y = Sunniesnow.Config.height / 2;
	}
};
