export const debounce = function(func, wait, immediate) {
	let timeout;
	return function() {
		const _this = this;
		const args = arguments;

		function later() {
			timeout = null;
			if (!immediate) func.apply(_this, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(_this, args);
	}
};

export const throttle = function(func, delay) {
	let timeout, elapsed;
	let lastExecTime = 0;
	return function() {
		elapsed = Date.now() - lastExecTime;
		if (timeout) clearTimeout(timeout);
		const _this = this;
		const args = arguments;

		function later() {
			lastExecTime = Date.now();
			timeout = null;
			func.apply(_this, args);
		};
		if (elapsed > delay) {
			later();
		} else {
			timeout = setTimeout(later, delay - elapsed);
		}
	};
};
