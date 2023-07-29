Sunniesnow.Project = class Project {
	constructor(path, musicBlob) {
		this.pathDig = path.split('/');
		this.name = this.pathDig[this.pathDig.length - 1];
		this.musicBlob = musicBlob;
	}

	static userNew(path, musicBlob, firstChartData) {
		const project = new this(path, musicBlob);
		project.chartList = [Sunniesnow.Chart.userNew(firstChartData)];
		return project;
	}
};
