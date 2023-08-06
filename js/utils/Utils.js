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
	},

	escapeHtml(string) {
		return string.replace('"', '&quot;').replace('&', '&amp;').replace("'", '&#39;').replace('<', '&lt;').replace('>', '&gt;');
	},

	setLoadListener(element, listener) {
		const img = document.createElement('img');
		img.src = '';
		img.addEventListener('error', event => {
			element.removeChild(img);
			listener();
		});
		element.appendChild(img);
	},

	async blobToBase64(blob) {
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		return new Promise((resolve, reject) => reader.addEventListener(
			'loadend',
			e => resolve(reader.result)
		));
	},

	async base64ToBlob(base64) {
		return await (await fetch(base64)).blob();
	},

	async audioDecode(arrayBuffer, context) {
		const audioBuffer = await audioDecode(arrayBuffer);
		const result = context.createBuffer(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
		for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
			result.copyToChannel(audioBuffer.getChannelData(i), i);
		}
		return result;
	},

	// If there no match, return the next index.
	// Less than all: return 0. Greater than all: return array.length.
	// Empty: return 0.
	bisectLeft(array, compareFn, low = 0, high = array.length) {
		if (typeof compareFn !== 'function') {
			const value = compareFn;
			compareFn = e => e < value ? -1 : e > value ? 1 : 0;
		}
		while (low < high) {
			const mid = low + high >>> 1;
			const compare = compareFn(array[mid]);
			if (compare === 0) {
				return mid;
			} else if (compare < 0) {
				low = mid + 1;
			} else {
				high = mid;
			}
		}
		return low;
	},

	// If there no match, return the previous index.
	// Less than all: return -1. Greater than all: return array.length - 1.
	// Empty: return -1.
	bisectRight(array, compareFn, low = 0, high = array.length) {
		if (typeof compareFn !== 'function') {
			const value = compareFn;
			compareFn = e => e < value ? -1 : e > value ? 1 : 0;
		}
		while (low < high) {
			const mid = low + high >>> 1;
			const compare = compareFn(array[mid]);
			if (compare === 0) {
				return mid;
			} else if (compare < 0) {
				low = mid + 1;
			} else {
				high = mid;
			}
		}
		return high - 1;
	},

	formatTime(seconds) {
		if (seconds < 0) {
			return '-' + this.formatTime(-seconds);
		}
		const minutes = Math.floor(seconds / 60);
		const milliseconds = String(Math.floor(seconds % 1 * 1000)).padStart(3, '0');
		seconds = String(Math.floor(seconds % 60)).padStart(2, '0');
		return `${minutes}:${seconds}.${milliseconds}`;
	},

	objectId: (() => {
		const map = new WeakMap();
		let id = 0;
		return object => {
			if (map.has(object)) {
				return map.get(object);
			}
			id++;
			map.set(object, id);
			return id;
		};
	})()

};
