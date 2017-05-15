/**
 *  接收参数为毫秒
 *  
 *  格式化 00:03:20:14 0填3小时20分钟14秒
 *
 *  格式化之后的结果为: 03:20:14
 */
import msToDuration from 'util/msToDuration.js';

export default function(ms) {
	var obj = msToDuration(ms);
    if (obj.day !== '00') {
        return `${obj.day}:${obj.hour}:${obj.min}:${obj.sec}`;
    } else if (obj.hour !== '00') {
        return `${obj.hour}:${obj.min}:${obj.sec}`;
    } else {
        return `${obj.min}:${obj.sec}`;
    }
}