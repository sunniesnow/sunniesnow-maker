Sunniesnow.Music = {

	EPSILON: 1e-3,

	async load() {
		const a = () => this.audio;
		const w = () => Sunniesnow.workspace;
		Sunniesnow.Menu.set('play-pause', a, () => this.playPause());

		Sunniesnow.Menu.set('seek-to-start', a, () => this.seekToStart());
		Sunniesnow.Menu.set('seek-forward', a, () => this.seekNextSubbeat());
		Sunniesnow.Menu.set('seek-backward', a, () => this.seekPreviousSubbeat());
		Sunniesnow.Menu.set('seek-forward-10', a, () => this.seekDelta(10));
		Sunniesnow.Menu.set('seek-backward-10', a, () => this.seekDelta(-10));

		Sunniesnow.Menu.set('time-lattice-1', w, () => this.setSubdivision(1));
		Sunniesnow.Menu.set('time-lattice-2', w, () => this.setSubdivision(2));
		Sunniesnow.Menu.set('time-lattice-3', w, () => this.setSubdivision(3));
		Sunniesnow.Menu.set('time-lattice-4', w, () => this.setSubdivision(4));
		Sunniesnow.Menu.set('time-lattice-6', w, () => this.setSubdivision(6));
		Sunniesnow.Menu.set('time-lattice-8', w, () => this.setSubdivision(8));

		Sunniesnow.Menu.set('speed-minus-0-1', a, () => this.setPlaybackRateDelta(-0.1));
		Sunniesnow.Menu.set('speed-plus-0-1', a, () => this.setPlaybackRateDelta(0.1));
		Sunniesnow.Menu.set('speed-0-25', a, () => this.setPlaybackRate(0.25));
		Sunniesnow.Menu.set('speed-0-5', a, () => this.setPlaybackRate(0.5));
		Sunniesnow.Menu.set('speed-1', a, () => this.setPlaybackRate(1));

		Sunniesnow.Menu.set('zoom-in', w, () => Sunniesnow.workspace.zoomBy(1.1));
		Sunniesnow.Menu.set('zoom-out', w, () => Sunniesnow.workspace.zoomBy(0.9));

		Sunniesnow.MainApp.canvas.addEventListener('wheel', event => this.onWheel(event));
		Sunniesnow.TimelineApp.canvas.addEventListener('wheel', event => this.onWheel(event));
	},
	
	playPause() {
		if (!this.audio) {
			return;
		}
		if (this.seeking) {
			this.temporaryPause = !this.temporaryPause;
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
	},

	beginSeeking() {
		if (!this.audio) {
			return;
		}
		this.seeking = true;
		if (this.audio.playing) {
			this.audio.pause();
			this.temporaryPause = true;
		}
	},

	endSeeking() {
		if (!this.audio) {
			return;
		}
		this.seeking = false;
		if (this.temporaryPause) {
			this.audio.play();
			this.temporaryPause = false;
		}
	},

	playing() {
		return !!this.audio?.playing || this.temporaryPause;
	}

};
