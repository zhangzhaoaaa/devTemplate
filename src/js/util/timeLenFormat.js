/**
 * [视频时长]
 * @Author: Fu Xiaochun
 * @Email:  fuzhengchun@gomeplus.com
 */
import msToDuration from './msToDuration';

function timeLenFormat(ms) {
	var dur = msToDuration(ms);
	var d = parseInt(dur.day);
	var h = parseInt(dur.hour);
	if (d > 0) {
		return dur.day + ':' + dur.hour + ':' + dur.min + ':' + dur.sec;
	} else if (h > 0) {
		return dur.hour + ':' + dur.min + ':' + dur.sec;
	} else {
		return dur.min + ':' + dur.sec;
	}
}

export default timeLenFormat;