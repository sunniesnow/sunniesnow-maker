Sunniesnow.TipPointable = class TipPointable {
	setPosition(xExp, yExp) {
		this.hasPosition = true;
		this.xExp = xExp;
		this.yExp = yExp;
	}

	setTipPoint(data) {
		this.tipPoint = new Sunniesnow.TipPoint(this, data);
	}

	evaluateXAndY() {
		this.x = math.evaluate(this.xExp);
		this.y = math.evaluate(this.yExp);
	}

	evaluateAttributes() {
		Sunniesnow.Utils.super(this, Sunniesnow.TipPointable, 'evaluateAttributes')();
		this.evaluateXAndY();
	}
};
