Sunniesnow.Audio = class Audio {

	static async load() {
		this.context = new AudioContext();
	}

	static async fromBlob(blob) {
		const arrayBuffer = await blob.arrayBuffer();
		const audioBuffer = await Sunniesnow.Utils.audioDecode(arrayBuffer, this.context);
		return new this(audioBuffer);
	}

	constructor(audioBuffer) {
		this.playbackRate = 1;
		this.volume = 1;
		this.buffer = audioBuffer;
		this.duration = audioBuffer.duration;
		this.playing = false;
		this.lastOffset = 0;
		this.lastTime = 0;
		this.playListeners = [];
		this.pauseListeners = [];
		this.createGainNode();
	}

	createSourceNode() {
		if (this.sourceNode) {
			this.sourceNode.stop();
			this.sourceNode.disconnect();
		}
		const context = this.constructor.context;
		this.sourceNode = context.createBufferSource();
		this.sourceNode.buffer = this.buffer;
		this.sourceNode.playbackRate.setValueAtTime(this.playbackRate, context.currentTime);
		this.sourceNode.connect(this.gainNode);
	}

	createGainNode() {
		const context = this.constructor.context;
		this.gainNode = context.createGain();
		this.gainNode.gain.setValueAtTime(this.volume, context.currentTime);
		this.gainNode.connect(context.destination);
	}

	setVolume(volume) {
		this.volume = volume;
		this.gainNode.gain.setValueAtTime(volume, context.currentTime);
	}

	createNodes() {
		const context = this.constructor.context;
		const sourceNode = context.createBufferSource();
		sourceNode.buffer = this.buffer;
		sourceNode.playbackRate.setValueAtTime(this.playbackRate, context.currentTime);
		const gainNode = context.createGain();
		gainNode.gain.setValueAtTime(this.volume, context.currentTime);
		sourceNode.connect(gainNode);
		gainNode.connect(context.destination);
		return [sourceNode, gainNode]
	}

	seekTo(offset) {
		this.lastOffset = offset;
		if (this.playing) {
			this.play();
		}
	}

	play() {
		if (this.playing || this.onPlay()) {
			return;
		}
		this.createSourceNode();
		this.lastTime = this.constructor.context.currentTime;
		if (this.lastOffset >= 0) {
			this.sourceNode.start(this.lastTime, this.lastOffset);
		} else {
			this.sourceNode.start(this.lastTime - this.lastOffset / this.playbackRate);
		}
		this.playing = true;
	}

	currentTime() {
		if (this.playing) {
			return (this.constructor.context.currentTime - this.lastTime) * this.playbackRate + this.lastOffset;
		} else {
			return this.lastOffset;
		}
	}

	pause() {
		if (!this.playing || this.onPause()) {
			return;
		}
		this.lastOffset = this.currentTime();
		this.sourceNode.stop();
		this.playing = false;
	}

	setPlaybackRate(playbackRate) {
		if (playbackRate <= 0) {
			return;
		}
		if (this.playing) {
			this.lastOffset = this.currentTime();
			this.lastTime = this.constructor.context.currentTime;
		}
		this.playbackRate = playbackRate;
		this.sourceNode?.playbackRate.setValueAtTime(this.playbackRate, this.constructor.context.currentTime);
	}

	createWaveform() {
		const graphics = new PIXI.Graphics();
		graphics.beginFill(0xffffff);
		const n = this.buffer.numberOfChannels;
		for (let i = 0; i < this.buffer.length; i++) {
			let energy = 0;
			for (let j = 0; j < n; j++) {
				energy += this.buffer.getChannelData(j)[i] ** 2;
			}
			graphics.lineTo(i, Math.sqrt(energy/n) * Sunniesnow.Config.waveformHeight);
		}
		graphics.closePath();
		graphics.endFill();
		return graphics.geometry;
	}

	addPlayListener(listener) {
		this.playListeners.push(listener);
	}

	addPauseListener(listener) {
		this.pauseListeners.push(listener);
	}

	removePlayListener(listener) {
		this.playListeners.splice(this.playListeners.indexOf(listener), 1);
	}

	removePauseListener(listener) {
		this.pauseListeners.splice(this.pauseListeners.indexOf(listener), 1);
	}

	onPlay() {
		for (const listener of this.playListeners) {
			if (listener()) {
				return true;
			}
		}
		return false;
	}

	onPause() {
		for (const listener of this.pauseListeners) {
			if (listener()) {
				return true;
			}
		}
		return false;
	}

};
