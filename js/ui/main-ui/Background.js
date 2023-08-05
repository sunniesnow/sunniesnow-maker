Sunniesnow.Background = class Background extends PIXI.Container {

	static async load() {
		const tempTexture = await PIXI.Assets.load(
			atob('aHR0cHM6Ly9zdW5uaWVzbm93LWNvbW11bml0eS43NTczNjgwOC54eXovYmFja2dyb3VuZC9kZWZhdWx0LnN2Zw==')
		);
		const tempSprite = new PIXI.Sprite(tempTexture);
		tempSprite.anchor.set(0.5);
		const width = Sunniesnow.Config.width;
		const height = Sunniesnow.Config.height;
		tempSprite.scale.set(Math.max(width / tempTexture.width, height / tempTexture.height));
		tempSprite.filters = [new PIXI.BlurFilter(100, 10)];
		tempSprite.tint = 0x7f7f7f;
		const wrapper = new PIXI.Container();
		wrapper.addChild(tempSprite);
		this.texture = Sunniesnow.MainApp.app.renderer.generateTexture(
			wrapper,
			{ region: new PIXI.Rectangle(-width / 2, -height / 2, width, height) }
		);
	}

	constructor() {
		super();
		this.sprite = new PIXI.Sprite(this.constructor.texture);
		this.addChild(this.sprite);
	}
};
