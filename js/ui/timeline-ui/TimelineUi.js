Sunniesnow.TimelineUi = class TimelineUi extends PIXI.Container {

	updatePosition() {
		if (!Sunniesnow.Editor.music) {
			return;
		}
		const anchorX = Sunniesnow.workspace.offset / Sunniesnow.Config.secondsPerRow * Sunniesnow.workspace.zoom * Sunniesnow.TimelineApp.width;
		this.x = Sunniesnow.TimelineApp.width * Sunniesnow.workspace.cursorPosition - anchorX;
	}

	XAt(time) {
		return time / Sunniesnow.Config.secondsPerRow * Sunniesnow.workspace.zoom * Sunniesnow.TimelineApp.width;
	}

	timeAt(x) {
		return x * Sunniesnow.Config.secondsPerRow / Sunniesnow.workspace.zoom / Sunniesnow.TimelineApp.width;
	}
};
