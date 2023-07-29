Sunniesnow.Chart = class Chart {
	constructor(data) {
		this.title = data.title;
		this.artist = data.artist;
		this.charter = data.charter;
		this.difficultyName = data.difficultyName;
		this.difficultyColor = data.difficultyColor;
		this.difficulty = data.difficulty;
		this.channels = data.channels.map(channelData => new Sunniesnow.Channel(channelData));
	}

	static userNew(data) {
		return new this({...data, channels: []});
	}
};
