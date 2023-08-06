Sunniesnow.PointerManager = {

	DRAG_THRESHOLD_SQUARED: 5,

	priorities: {main: [], timeline: []},
	interactiveTargets: {main: {}, timeline: {}},
	operating: {},

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
			event.preventDefault();
			const operating = this.operating[event.pointerId] = {initialTargetPosition: new PIXI.Point()};
			operating.scope = scope;
			operating.target = finalTarget;
			finalTarget.emit('pointerdown', {
				position,
				localPosition: finalTarget.toLocal(position, null, tempPoint)
			});
			operating.initialPosition = position;
			operating.localPosition = tempPoint;
			finalTarget.getGlobalPosition(operating.initialTargetPosition);
		}
	},

	onPointerMove(event) {
		const operating = this.operating[event.pointerId];
		if (!operating) {
			return;
		}
		event.preventDefault();
		const position = new PIXI.Point();
		this.apps[operating.scope].renderer.events.mapPositionToPoint(position, event.clientX, event.clientY);
		const totalDelta = position.subtract(operating.initialPosition);
		const target = operating.target;
		const draggedTo = target.parent?.toLocal(operating.initialTargetPosition.add(totalDelta));
		const data = {position, totalDelta, draggedTo, localPosition: target.toLocal(position)};
		target.emit('pointermove', data);
		if (totalDelta.magnitudeSquared() < this.DRAG_THRESHOLD_SQUARED) {
			return;
		}
		operating.dragging = true;
		target.emit('pointerdrag', data);
	},

	onPointerUp(event) {
		const operating = this.operating[event.pointerId];
		if (!operating) {
			return;
		}
		event.preventDefault();
		const target = operating.target;
		target.emit('pointerup');
		if (!operating.dragging) {
			target.emit('pointerclick');
		}
		delete this.operating[event.pointerId];
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
		window.addEventListener('blur', event => this.onBlur());
	},

	onMouseDown(event, scope) {
		this.mouseId(event);
		this.onPointerDown(event, scope);
	},

	onMouseMove(event) {
		this.mouseId(event);
		this.onPointerMove(event);
	},

	onMouseUp(event) {
		this.mouseId(event);
		this.onPointerUp(event);
	},

	onTouchStart(event, scope) {
		for (const touch of event.changedTouches) {
			this.touchId(touch);
			this.onPointerDown(touch, scope);
		}
	},

	onTouchMove(event) {
		for (const touch of event.changedTouches) {
			this.touchId(touch);
			this.onPointerMove(touch);
		}
	},

	onTouchEnd(event) {
		for (const touch of event.changedTouches) {
			this.touchId(touch);
			this.onPointerUp(touch);
		}
	},

	onBlur() {
		for (const pointerId in this.operating) {
			const operating = this.operating[pointerId];
			const target = operating.target;
			target.emit('pointerup');
			delete this.operating[pointerId];
		}
	},

	mouseId(event) {
		event.pointerId = `mouse${event.button}`;
	},
	
	touchId(touch) {
		touch.pointerId = `touch${touch.identifier}`;
	}

};
