Sunniesnow.PointerManager = {

	DRAG_THRESHOLD_SQUARED: 5,

	priorities: {main: [], timeline: []},
	interactiveTargets: {main: {}, timeline: {}},
	operating: {
		target: null,
		scope: null,
		initialPosition: null,
		localPosition: null,
		initialTargetPosition: new PIXI.Point(),
		dragging: false
	},

	async load() {
		this.apps = {main: Sunniesnow.MainApp.app, timeline: Sunniesnow.TimelineApp.app};
		this.addDomEventListeners();
	},

	addPriority(priority, scope) {
		const priorities = this.priorities[scope] ??= [];
		const index = Sunniesnow.Utils.bisectLeft(priorities, e => priority - e);
		if (priorities[index] !== priority) {
			priorities.splice(index, 0, priority);
			this.interactiveTargets[scope][priority] = [];
		}
	},

	register(scope, target, priority = 0) {
		this.addPriority(priority, scope);
		this.interactiveTargets[scope][priority].unshift(target);
	},

	onPointerDown(event, scope) {
		const position = new PIXI.Point();
		const tempPoint = new PIXI.Point();
		this.apps[scope].renderer.events.mapPositionToPoint(position, event.clientX, event.clientY);
		const matchedTargets = [];
		for (const priority of this.priorities[scope]) {
			for (const target of this.interactiveTargets[scope][priority]) {
				target.worldTransform.applyInverse(position, tempPoint);
				if (target.hitArea.contains(tempPoint.x, tempPoint.y)) {
					matchedTargets.push(target);
				}
			}
			if (matchedTargets.length > 0) {
				break;
			}
		}
		let finalTarget = null;
		let minDistance = Infinity;
		for (const target of matchedTargets) {
			const distance = position.subtract(target.position, tempPoint).magnitudeSquared();
			if (distance < minDistance) {
				minDistance = distance;
				finalTarget = target;
			}
		}
		if (finalTarget) {
			this.operating.scope = scope;
			this.operating.target = finalTarget;
			finalTarget.emit('pointerdown', {
				position,
				localPosition: finalTarget.worldTransform.applyInverse(position, tempPoint)
			});
			this.operating.initialPosition = position;
			this.operating.localPosition = tempPoint;
			this.operating.initialTargetPosition.copyFrom(finalTarget.position);
		}
	},

	onPointerMove(event) {
		if (!this.operating.target) {
			return;
		}
		const position = new PIXI.Point();
		this.apps[this.operating.scope].renderer.events.mapPositionToPoint(position, event.clientX, event.clientY);
		const totalDelta = position.subtract(this.operating.initialPosition);
		if (totalDelta.magnitudeSquared() < this.DRAG_THRESHOLD_SQUARED) {
			return;
		}
		this.operating.dragging = true;
		const target = this.operating.target;
		target.emit('pointerdrag', {
			position,
			totalDelta,
			draggedTo: this.operating.initialTargetPosition.add(totalDelta),
		});
	},

	onPointerUp(event) {
		if (!this.operating.target) {
			return;
		}
		const target = this.operating.target;
		target.emit('pointerup');
		if (!this.operating.dragging) {
			this.operating.target.emit('pointerclick');
		}
		this.operating.target = null;
		this.operating.dragging = false;
		this.operating.initialPosition = null;
		this.operating.localPosition = null;
		this.operating.scope = null;
	},

	addDomEventListeners() {
		Sunniesnow.TimelineApp.canvas.addEventListener('mousedown', event => this.onMouseDown(event, 'timeline'));
		Sunniesnow.MainApp.canvas.addEventListener('mousedown', event => this.onMouseDown(event, 'main'));
		document.addEventListener('mousemove', event => this.onMouseMove(event));
		document.addEventListener('mouseup', event => this.onMouseUp(event));
		Sunniesnow.TimelineApp.canvas.addEventListener('touchstart', event => this.onTouchStart(event, 'timeline'));
		Sunniesnow.MainApp.canvas.addEventListener('touchstart', event => this.onTouchStart(event, 'main'));
		document.addEventListener('touchmove', event => this.onTouchMove(event));
		document.addEventListener('touchend', event => this.onTouchEnd(event));
	},

	onMouseDown(event, scope) {
		this.onPointerDown(event, scope);
	},

	onMouseMove(event) {
		this.onPointerMove(event);
	},

	onMouseUp(event) {
		this.onPointerUp(event);
	},

	onTouchStart(event, scope) {
		for (const touch of event.changedTouches) {
			this.onPointerDown(touch, scope);
		}
	},

	onTouchMove(event) {
		for (const touch of event.changedTouches) {
			this.onPointerMove(touch);
		}
	},

	onTouchEnd(event) {
		for (const touch of event.changedTouches) {
			this.onPointerUp(touch);
		}
	}

};
