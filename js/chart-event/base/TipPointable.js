Sunniesnow.TipPointable = class TipPointable {
	setPosition(xExp, yExp) {
		this.hasPosition = true;
		this.xExp = xExp;
		this.yExp = yExp;
		this.evaluateXAndY();
	}

	setTipPoint(data) {
		this.tipPoint = new Sunniesnow.TipPoint(this, data);
	}

	evaluateXAndY() {
		this.x = math.evaluate(this.xExp);
		this.y = math.evaluate(this.yExp);
	}

	evaluateAttributes() {
		console.log(this);
		Sunniesnow.Utils.super(this, Sunniesnow.TipPointable, 'evaluateAttributes')();
		this.evaluateXAndY();
	}
};
