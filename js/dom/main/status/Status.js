Sunniesnow.Status = {

	DATA: [
{
	id: "title",
	label: "Title:",
	hint: "The title of the project, usually the title of the music",
	condition: () => Sunniesnow.Editor.project,
	contents: () => Sunniesnow.Editor.project.title,
},
{
	id: "time",
	label: "Time:",
	hint: "The current time of the music; click to toggle format",
	condition: () => Sunniesnow.workspace,
	contents: () => {
		const time = Sunniesnow.workspace.offset;
		return Sunniesnow.workspace.formatTime ? Sunniesnow.Utils.formatTime(time) : time.toFixed(3);
	},
	onClick: () => Sunniesnow.workspace.formatTime = !Sunniesnow.workspace.formatTime
},
{
	id: "beat",
	label: "Beat:",
	hint: "The current beat of the music",
	condition: () => Sunniesnow.workspace,
	contents: () => Sunniesnow.Editor.project.beatAt(Sunniesnow.workspace.offset).toFixed(3)
},
{
	id: "bpm",
	label: "BPM:",
	hint: "The current BPM of the music",
	condition: () => Sunniesnow.workspace,
	contents: () => (Sunniesnow.Editor.project.bpsAt(Sunniesnow.workspace.offset) * 60).toFixed(3)
},
{
	id: "playback-rate",
	label: "Speed:",
	hint: "The current playback rate of the music",
	condition: () => Sunniesnow.Editor.music,
	contents: () => Sunniesnow.Editor.music.playbackRate.toFixed(3)
},
{
	id: "playing",
	label: "Music",
	hint: "Whether the music is playing",
	condition: () => Sunniesnow.Editor.music,
	contents: () => Sunniesnow.Music.playing() ? 'playing' : 'pausing'
}
	],

	async load() {
		this.populate();
	},

	populate() {
		this.dom = document.getElementById('status');
		this.items = [];
		for (const itemData of this.DATA) {
			const item = new Sunniesnow.StatusItem(itemData);
			this.items.push(item);
			this.dom.appendChild(item.dom);
		}
	},

	update(delta) {
		for (const item of this.items) {
			item.update();
		}
	},

}
