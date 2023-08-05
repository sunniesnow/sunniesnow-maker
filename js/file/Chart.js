Sunniesnow.Chart = class Chart {
	constructor(project, data) {
		this.project = project;
		this.charter = data.charter;
		this.difficultyName = data.difficultyName;
		this.difficultyColor = data.difficultyColor;
		this.difficulty = data.difficulty;
		this.channels = [];
	}

	static userNew(project, data) {
		const chart = new this(project, data);
		chart.channels[0] = Sunniesnow.Channel.userNew(chart);
		return chart;
	}

	async toObject() {
		const channels = [];
		for (const channel of this.channels) {
			channels.push(await channel.toObject());
		}
		return {
			charter: this.charter,
			difficultyName: this.difficultyName,
			difficultyColor: this.difficultyColor,
			difficulty: this.difficulty,
			channels
		};
	}

	static async fromObject(project, object) {
		const chart = new this(project, object);
		chart.channels = object.channels.map(channelData => {
			return Sunniesnow.Channel.fromObject(channelData);
		});
		return chart;
	}
};
