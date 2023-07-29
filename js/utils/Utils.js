Sunniesnow.Utils = {

	classInclude(targetClass, sourceClass) {
		const prototype = Object.create(Object.getPrototypeOf(targetClass.prototype));
		for (const key of Object.getOwnPropertyNames(sourceClass.prototype)) {
			Object.defineProperty(prototype, key, Object.getOwnPropertyDescriptor(sourceClass.prototype, key));
		}
		Object.setPrototypeOf(targetClass.prototype, prototype);
	},

	super(self, constructor, property) {
		let superThis = self;
		while (superThis.constructor !== constructor) {
			superThis = Object.getPrototypeOf(superThis);
			if (superThis === null) {
				throw new TypeError(`Constructor ${constructor.name} not found in prototype chain of ${self.constructor.name}`);
			}
		}
		superThis = Object.getPrototypeOf(superThis);
		while (!Object.hasOwn(superThis, property)) {
			superThis = Object.getPrototypeOf(superThis);
			if (superThis === null) {
				throw new TypeError(`Property ${property} not found in prototype chain of ${constructor.name}`);
			}
		}
		const result = superThis[property];
		return typeof result === 'function' ? result.bind(self) : result;
	},

	slugToCamel(string) {
		return string.replace(/-([a-z\d])/g, (_, c) => c.toUpperCase());
	},

	camelToSlug(string) {
		return string.replace(/[A-Z\d]/g, c => '-' + c.toLowerCase());
	}

};
