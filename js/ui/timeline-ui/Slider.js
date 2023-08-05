Sunniesnow.Slider = class Slider extends PIXI.Container {

	static RANGE_COLOR = 0x00ff00
	static ENDS_THICKNESS = 6
	static HANDLE_THICKNESS = 8
	static RANGE_THICKNESS = 10
	static HIT_WIDTH = 60

	static async load() {
		this.backgroundGeometry = this.createBackgroundGeometry();
		this.endsGeometry = this.createEndsGeometry();
		this.timeWindowHandleGeometry = this.createTimeWindowHandleGeometry();
		this.cursorGeometry = this.createCursorGeometry();
		this.rangeGeometry = this.createRangeGeometry();
	}

	static createBackgroundGeometry() {
		const graphics = new PIXI.Graphics();
		graphics.beginFill(0xffffff);
		graphics.drawRect(0, 0, Sunniesnow.Config.timelineWidth, Sunniesnow.Config.sliderHeight);
		graphics.endFill();
		return graphics.geometry;
	}

	static createEndsGeometry() {
		const graphics = new PIXI.Graphics();
		graphics.lineStyle(this.ENDS_THICKNESS, 0xffffff);
		graphics.moveTo(0, 0);
		graphics.lineTo(0, Sunniesnow.Config.sliderHeight);
		graphics.finishPoly();
		return graphics.geometry;
	}

	static createTimeWindowHandleGeometry() {
		const graphics = new PIXI.Graphics();
		graphics.lineStyle(this.HANDLE_THICKNESS, this.RANGE_COLOR);
		graphics.moveTo(0, 0);
		graphics.lineTo(0, Sunniesnow.Config.sliderHeight);
		graphics.finishPoly();
		return graphics.geometry;
	}

	static createCursorGeometry() {
		const graphics = new PIXI.Graphics();
		graphics.lineStyle(this.HANDLE_THICKNESS, Sunniesnow.Beats.CURSOR_COLOR);
		graphics.moveTo(0, 0);
		graphics.lineTo(0, Sunniesnow.Config.sliderHeight);
		graphics.finishPoly();
		return graphics.geometry;
	}

	static createRangeGeometry() {
		const graphics = new PIXI.Graphics();
		graphics.lineStyle(this.RANGE_THICKNESS, this.RANGE_COLOR);
		graphics.moveTo(0, Sunniesnow.Config.sliderHeight / 2);
		graphics.lineTo(Sunniesnow.Config.timelineWidth, Sunniesnow.Config.sliderHeight / 2);
		graphics.finishPoly();
		return graphics.geometry;
	}

	constructor() {
		super();
		this.createBackground();
		this.createEnds();
		this.createTimeWindowHandles();
		this.createCursor();
		Sunniesnow.TimelineApp.app.renderer.on('resize', this.onResize.bind(this));
		this.onResize();
		this.dragging = false;
	}

	onResize() {
		this.y = Sunniesnow.TimelineApp.height - Sunniesnow.Config.sliderHeight;
	}

	createBackground() {
		this.background = new PIXI.Graphics(this.constructor.backgroundGeometry);
		this.background.alpha = 0.4;
		this.addChild(this.background);
	}

	createEnds() {
		this.leftEnd = new PIXI.Graphics(this.constructor.endsGeometry);
		this.addChild(this.leftEnd);
		this.rightEnd = new PIXI.Graphics(this.constructor.endsGeometry);
		this.addChild(this.rightEnd);
		this.leftEnd.eventMode = 'static';
		this.rightEnd.eventMode = 'static';
		this.leftEnd.hitArea = new PIXI.Rectangle(-this.constructor.HIT_WIDTH / 2, 0, this.constructor.HIT_WIDTH, Sunniesnow.Config.sliderHeight);
		this.rightEnd.hitArea = new PIXI.Rectangle(-this.constructor.HIT_WIDTH / 2, 0, this.constructor.HIT_WIDTH, Sunniesnow.Config.sliderHeight);
		Sunniesnow.PointerManager.register('timeline', this.leftEnd);
		Sunniesnow.PointerManager.register('timeline', this.rightEnd);
		this.leftEnd.on('pointerdrag', event => this.onDrag(this.leftEnd, event.draggedTo, { x: 0 }, this.rightEnd));
		this.rightEnd.on('pointerdrag', event => this.onDrag(this.rightEnd, event.draggedTo, this.leftEnd, { x: Sunniesnow.Config.timelineWidth }));
		this.leftEnd.on('pointerup', event => this.dragging = false);
		this.rightEnd.on('pointerup', event => this.dragging = false);
	}

	createTimeWindowHandles() {
		this.leftHandle = new PIXI.Graphics(this.constructor.timeWindowHandleGeometry);
		this.addChild(this.leftHandle);
		this.rightHandle = new PIXI.Graphics(this.constructor.timeWindowHandleGeometry);
		this.addChild(this.rightHandle);
		this.range = new PIXI.Graphics(this.constructor.rangeGeometry);
		this.addChild(this.range);
		this.leftHandle.eventMode = 'static';
		this.rightHandle.eventMode = 'static';
		this.leftHandle.hitArea = new PIXI.Rectangle(-this.constructor.HIT_WIDTH / 2, 0, this.constructor.HIT_WIDTH, Sunniesnow.Config.sliderHeight);
		this.rightHandle.hitArea = new PIXI.Rectangle(-this.constructor.HIT_WIDTH / 2, 0, this.constructor.HIT_WIDTH, Sunniesnow.Config.sliderHeight);
		this.range.hitArea = new PIXI.Rectangle(0, 0, Sunniesnow.Config.timelineWidth, Sunniesnow.Config.sliderHeight);
		Sunniesnow.PointerManager.register('timeline', this.leftHandle);
		Sunniesnow.PointerManager.register('timeline', this.rightHandle);
		Sunniesnow.PointerManager.register('timeline', this.range);
		this.range.on('pointerdrag', event => this.onRangeDrag(event));
		this.range.on('pointerup', event => this.dragging = false);
		this.leftHandle.on('pointerdrag', event => this.onDrag(this.leftHandle, event.draggedTo, {x:0}, this.cursor));
		this.rightHandle.on('pointerdrag', event => this.onDrag(this.rightHandle, event.draggedTo, this.cursor, {x:Sunniesnow.Config.timelineWidth}));
		this.leftHandle.on('pointerup', event => this.dragging = false);
		this.rightHandle.on('pointerup', event => this.dragging = false);
	}

	createCursor() {
		this.cursor = new PIXI.Graphics(this.constructor.cursorGeometry);
		this.addChild(this.cursor);
		this.cursor.eventMode = 'static';
		this.cursor.hitArea = new PIXI.Rectangle(-this.constructor.HIT_WIDTH / 2, 0, this.constructor.HIT_WIDTH, Sunniesnow.Config.sliderHeight);
		Sunniesnow.PointerManager.register('timeline', this.cursor);
		this.cursor.on('pointerdrag', event => this.onDrag(this.cursor, event.draggedTo, this.leftHandle, this.rightHandle));
		this.cursor.on('pointerup', event => this.dragging = false);
	}

	update(delta) {
		if (this.dragging) {
			this.updateMusic();
		} else {
			this.updatePosition();
		}
	}

	onDrag(target, draggedTo, leftBound, rightBound) {
		this.dragging = true;
		const newX = draggedTo.x;
		if (leftBound && newX <= leftBound.x) {
			return;
		}
		if (rightBound && newX >= rightBound.x) {
			return;
		}
		target.x = newX;
	}

	onRangeDrag(event) {
		this.dragging = true;
		const leftX = event.draggedTo.x;
		const rightX = leftX + this.range.scale.x * Sunniesnow.Config.timelineWidth;
		if (leftX <= 0 || leftX >= this.cursor.x) {
			return;
		}
		if (rightX >= Sunniesnow.Config.timelineWidth || rightX <= this.cursor.x) {
			return;
		}
		this.range.x = leftX;
		this.leftHandle.x = leftX;
		this.rightHandle.x = rightX;
	}

	updateMusic() {
		if (!Sunniesnow.Editor.music) {
			return;
		}
		const duration = Sunniesnow.Editor.music.duration;
		const leftEndX = this.leftEnd.x;
		const rightEndX = this.rightEnd.x;
		Sunniesnow.Editor.music.seekTo((this.cursor.x - leftEndX) / (rightEndX - leftEndX) * duration);
		const leftHandleX = this.leftHandle.x;
		const rightHandleX = this.rightHandle.x;
		Sunniesnow.workspace.cursorPosition = (this.cursor.x - leftHandleX) / (rightHandleX - leftHandleX);
		const map = x => (x - leftEndX) / (rightEndX - leftEndX) * duration;
		Sunniesnow.workspace.setTimeWindow(map(leftHandleX), map(rightHandleX));
		this.background.x = leftEndX;
		this.background.scale.x = (rightEndX - leftEndX) / Sunniesnow.Config.timelineWidth;
		this.range.x = leftHandleX;
		this.range.scale.x = (rightHandleX - leftHandleX) / Sunniesnow.Config.timelineWidth;
	}

	updatePosition() {
		if (!Sunniesnow.Editor.music) {
			return;
		}
		const duration = Sunniesnow.Editor.music.duration;
		const [left, right] = Sunniesnow.workspace.timeWindow();
		const leftMost = Math.min(left, 0);
		const rightMost = Math.max(right, duration);
		const map = time => (time - leftMost) / (rightMost - leftMost) * Sunniesnow.Config.timelineWidth;
		const leftEndX = this.leftEnd.x = map(0);
		const rightEndX = this.rightEnd.x = map(duration);
		this.background.x = leftEndX;
		this.background.scale.x = (rightEndX - leftEndX) / Sunniesnow.Config.timelineWidth;
		const leftHandleX = this.leftHandle.x = map(left);
		const rightHandleX = this.rightHandle.x = map(right);
		this.range.x = leftHandleX;
		this.range.scale.x = (rightHandleX - leftHandleX) / Sunniesnow.Config.timelineWidth;
		this.cursor.x = map(Sunniesnow.workspace.offset);
	}
};
