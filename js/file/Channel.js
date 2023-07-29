Sunniesnow.Channel = class Channel {
	constructor(data) {
		this.events = data.events.map(eventData => Sunniesnow.Event.from(eventData));
	}
};
