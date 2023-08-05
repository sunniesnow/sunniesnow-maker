Sunniesnow.Music = {

	EPSILON: 1e-4,

	async load() {
		Sunniesnow.Menu.setOnTrigger('play-pause', () => this.playPause());

		Sunniesnow.Menu.setOnTrigger('seek-to-start', () => this.seekToStart());
		Sunniesnow.Menu.setOnTrigger('seek-forward', () => this.seekNextSubbeat());
		Sunniesnow.Menu.setOnTrigger('seek-backward', () => this.seekPreviousSubbeat());
		Sunniesnow.Menu.setOnTrigger('seek-forward-10', () => this.seekDelta(10));
		Sunniesnow.Menu.setOnTrigger('seek-backward-10', () => this.seekDelta(-10));

		Sunniesnow.Menu.setOnTrigger('time-lattice-1', () => this.setSubdivision(1));
		Sunniesnow.Menu.setOnTrigger('time-lattice-2', () => this.setSubdivision(2));
		Sunniesnow.Menu.setOnTrigger('time-lattice-3', () => this.setSubdivision(3));
		Sunniesnow.Menu.setOnTrigger('time-lattice-4', () => this.setSubdivision(4));
		Sunniesnow.Menu.setOnTrigger('time-lattice-6', () => this.setSubdivision(6));
		Sunniesnow.Menu.setOnTrigger('time-lattice-8', () => this.setSubdivision(8));

		Sunniesnow.Menu.setOnTrigger('speed-minus-0-1', () => this.setPlaybackRateDelta(-0.1));
		Sunniesnow.Menu.setOnTrigger('speed-plus-0-1', () => this.setPlaybackRateDelta(0.1));
		Sunniesnow.Menu.setOnTrigger('speed-0-25', () => this.setPlaybackRate(0.25));
		Sunniesnow.Menu.setOnTrigger('speed-0-5', () => this.setPlaybackRate(0.5));
		Sunniesnow.Menu.setOnTrigger('speed-1', () => this.setPlaybackRate(1));

		Sunniesnow.Menu.setOnTrigger('zoom-in', () => Sunniesnow.workspace?.zoomBy(1.1));
		Sunniesnow.Menu.setOnTrigger('zoom-out', () => Sunniesnow.workspace?.zoomBy(0.9));

		Sunniesnow.MainApp.canvas.addEventListener('wheel', event => this.onWheel(event));
		Sunniesnow.TimelineApp.canvas.addEventListener('wheel', event => this.onWheel(event));
	},
	
	playPause() {
		if (!this.audio) {
			return;
		}
		if (this.audio.playing) {
			this.audio.pause();
		} else {
			this.audio.play();
		}
	},

	seekNextSubbeat() {
		if (!this.audio) {
			return;
		}
		const project = Sunniesnow.Editor.project;
		const subdivision = Sunniesnow.workspace.subdivision;
		const subbeat = project.beatAt(this.audio.currentTime()) * subdivision;
		const round = Math.round(subbeat);
		if (Math.abs(subbeat - round) < this.EPSILON) {
			this.audio.seekTo(project.timeAt((round + 1) / subdivision));
		} else {
			this.audio.seekTo(project.timeAt(Math.ceil(subbeat) / subdivision));
		}
	},

	seekPreviousSubbeat() {
		if (!this.audio) {
			return;
		}
		const project = Sunniesnow.Editor.project;
		const subdivision = Sunniesnow.workspace.subdivision;
		const subbeat = project.beatAt(this.audio.currentTime()) * subdivision;
		const round = Math.round(subbeat);
		if (Math.abs(subbeat - round) < this.EPSILON) {
			this.audio.seekTo(project.timeAt((round - 1) / subdivision));
		} else {
			this.audio.seekTo(project.timeAt(Math.floor(subbeat) / subdivision));
		}
	},

	seekNextBeat() {
		if (!this.audio) {
			return;
		}
		const project = Sunniesnow.Editor.project;
		const beat = project.beatAt(this.audio.currentTime());
		const round = Math.round(beat);
		if (Math.abs(beat - round) < this.EPSILON) {
			this.audio.seekTo(project.timeAt(round + 1));
		} else {
			this.audio.seekTo(project.timeAt(Math.ceil(beat)));
		}
	},

	seekPreviousBeat() {
		if (!this.audio) {
			return;
		}
		const project = Sunniesnow.Editor.project;
		const beat = project.beatAt(this.audio.currentTime());
		const round = Math.round(beat);
		if (Math.abs(beat - round) < this.EPSILON) {
			this.audio.seekTo(project.timeAt(round - 1));
		} else {
			this.audio.seekTo(project.timeAt(Math.floor(beat)));
		}
	},

	seekDelta(delta) {
		if (!this.audio) {
			return;
		}
		this.audio.seekTo(this.audio.currentTime() + delta);
	},

	seekToStart() {
		if (!this.audio) {
			return;
		}
		this.audio.seekTo(0);
	},

	setSubdivision(subdivision) {
		if (Sunniesnow.workspace) {
			Sunniesnow.workspace.subdivision = subdivision;
		}
	},

	setPlaybackRateDelta(delta) {
		if (!this.audio) {
			return;
		}
		this.audio.setPlaybackRate(this.audio.playbackRate + delta);
	},

	setPlaybackRate(playbackRate) {
		if (!this.audio) {
			return;
		}
		this.audio.setPlaybackRate(playbackRate);
	},

	onWheel(event) {
		event.preventDefault();
		if (event.ctrlKey) {
			Sunniesnow.workspace?.zoomBy(event.deltaY + event.deltaX > 0 ? 1.1 : 0.9);
		} else {
			if (event.deltaY + event.deltaX > 0) {
				this.seekNextSubbeat();
			} else {
				this.seekPreviousSubbeat();
			}
		}
	}

};
