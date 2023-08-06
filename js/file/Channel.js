Sunniesnow.Channel = class Channel {
	constructor(project, data) {
		this.project = project;
		this.events = data.events;
	}

	static userNew(project) {
		return new this(project, {events: []});
	}

	async toObject() {
		const events = [];
		for (const event of this.events) {
			events.push(await event.toObject());
		}
		return {
			events
		};
	}

	static async fromObject(project, object) {
		const events = [];
		for (const eventData of object.events ?? []) {
			events.push(await Sunniesnow.Event.fromObject(eventData));
		}
		return new this(project, {events});
	}
};
