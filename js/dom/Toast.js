Sunniesnow.Toast = {
	DURATION: 3,
	show(message) {
		const toast = document.createElement('div');
		toast.classList.add('toast');
		toast.innerHTML = message;
		document.body.appendChild(toast);
		setTimeout(() => document.body.removeChild(toast), this.DURATION * 1000);
	}
};
