Sunniesnow.Status = {

	async load() {
		this.setUpTitleDom();
		this.setUpTimeDom();
		this.setUpBeatDom();
		this.setUpBpmDom();
		this.setUpPlaybackRateDom();
		this.setUpPlayingDom();
	},

	setUpTitleDom() {
		this.titleDom = document.getElementById('status-title');
	},

	setUpTimeDom() {
		this.timeDom = document.getElementById('status-time');
		this.timeDom.addEventListener('click', () => {
			if (Sunniesnow.workspace) {
				Sunniesnow.workspace.formatTime = !Sunniesnow.workspace.formatTime
			}
		});
	},

	setUpBeatDom() {
		this.beatDom = document.getElementById('status-beat');
	},

	setUpBpmDom() {
		this.bpmDom = document.getElementById('status-bpm');
	},

	setUpPlaybackRateDom() {
		this.playbackRateDom = document.getElementById('status-playback-rate');
	},

	setUpPlayingDom() {
		this.playingDom = document.getElementById('status-playing');
	},

	update(delta) {
		this.updateTitle();
		this.updateTime();
		this.updateBeat();
		this.updateBpm();
		this.updatePlaybackRate();
		this.updatePlaying();
	},

	updateTitle() {
		if (Sunniesnow.Editor.project) {
			this.titleDom.textContent = Sunniesnow.Editor.project.title;
		} else {
			this.titleDom.textContent = '';
		}
	},

	updateTime() {
		if (Sunniesnow.workspace) {
			const time = Sunniesnow.workspace.offset;
			this.timeDom.textContent = Sunniesnow.workspace.formatTime ? Sunniesnow.Utils.formatTime(time) : time.toFixed(3);
		} else {
			this.timeDom.textContent = '';
		}
	},

	updateBeat() {
		if (Sunniesnow.workspace) {
			this.beatDom.textContent = Sunniesnow.Editor.project.beatAt(Sunniesnow.workspace.offset).toFixed(3);
		} else {
			this.beatDom.textContent = '';
		}
	},

	updateBpm() {
		if (Sunniesnow.workspace) {
			this.bpmDom.textContent = (Sunniesnow.Editor.project.bpsAt(Sunniesnow.workspace.offset) * 60).toFixed(3);
		} else {
			this.bpmDom.textContent = '';
		}
	},

	updatePlaybackRate() {
		if (Sunniesnow.Editor.music) {
			this.playbackRateDom.textContent = Sunniesnow.Editor.music.playbackRate.toFixed(2);
		} else {
			this.playbackRateDom.textContent = '';
		}
	},

	updatePlaying() {
		if (Sunniesnow.Editor.music) {
			this.playingDom.textContent = Sunniesnow.Editor.music.playing || Sunniesnow.TimelineApp.waveform.temporaryPause ? 'playing' : 'pausing';
		} else {
			this.playingDom.textContent = '';
		}
	}
}
