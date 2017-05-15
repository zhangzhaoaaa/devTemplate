/**
 *  使用方法:
 * import backTop from 'plugin/backTop.js';
 * 
 	new backTop({
		minHeight: 667  // 显示按钮的最小高度，默认屏幕高度一半
 	});
 * 
 */

import { throttle } from 'util/common.js';
class backTop {
	constructor(options) {
		this.options = options || {};
		this.minHeight = this.options.minHeight || window.screen.height / 2; // 不设定则卷去一半显示
		const gotoTop_html = '<div class="back-top" title="返回顶部" style="display: block;opacity: 0;" id="back-top"><em class="icon-19"></em></div>';
		$('body').append(gotoTop_html);
		$('#back-top').on('click', () => {
			this.scrollToTop(500);
		});
		setTimeout(() => {
			// 让 font 文件提前加载好
			$('#back-top').css({
				opacity: 1
			});
		}, 0);
		let throttleFunc = throttle(this.controlButton.bind(this), 100);
		$(window).on('scroll', throttleFunc);
		$(window).on('load', throttleFunc);
	}
	controlButton() {
		const s = $(window).scrollTop();
		if (s > this.minHeight) {
			$('#back-top').show();
		} else {
			$('#back-top').hide();
		}
	}
	scrollToTop(scrollDuration) {
		// scrollDuration 达到顶部的 ms 值
		const scrollHeight = window.pageYOffset;
		const scrollStep = Math.PI / Math.floor(scrollDuration / 15);
		const cosParameter = scrollHeight / 2;
		let scrollCount = 0;
		let scrollMargin;
		let scrollInterval = setInterval(() => {
			if (window.pageYOffset != 0) {
				scrollCount = scrollCount + 1;
				// ease 动画
				scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
				window.scrollTo(0, (scrollHeight - scrollMargin));
			} else {
				clearInterval(scrollInterval);
			}
		}, 15);
	}
}

export default backTop;
