Sunniesnow.Channel = class Channel {
	constructor(data) {
		this.events = data.events.map(eventData => Sunniesnow.Event.from(eventData));
	}

	static userNew() {
		return new this({events: []});
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

	static async fromObject(object) {
		return new this(object);
	}
};
