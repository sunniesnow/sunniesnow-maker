Sunniesnow.Chart = class Chart {
	constructor(project, data) {
		this.project = project;
		this.name = data.name;
		this.charter = data.charter;
		this.difficultyName = data.difficultyName;
		this.difficultyColor = data.difficultyColor;
		this.difficulty = data.difficulty;
		this.channels = data.channels;
	}

	static userNew(project, data) {
		return new this(project, {
			...data,
			difficultyColor: data.difficultyColor === 'other' ? data.difficultyColorOther : data.difficultyColor,
			channels: [Sunniesnow.Channel.userNew(project)]
		});
	}

	async toObject() {
		const channels = [];
		for (const channel of this.channels) {
			channels.push(await channel.toObject());
		}
		return {
			name: this.name,
			charter: this.charter,
			difficultyName: this.difficultyName,
			difficultyColor: this.difficultyColor,
			difficulty: this.difficulty,
			channels
		};
	}

	static async fromObject(project, object) {
		const channels = [];
		for (const channelData of object.channels ?? []) {
			channels.push(await Sunniesnow.Channel.fromObject(project, channelData));
		}
		const chart = new this(project, {
			name: object.name ?? String(project.charts.length),
			charter: object.charter ?? '',
			difficultyName: object.difficultyName ?? '',
			difficultyColor: object.difficultyColor ?? '#000000',
			difficulty: object.difficulty ?? '',
			channels
		});
		return chart;
	}
};
