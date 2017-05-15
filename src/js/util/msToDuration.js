/*
 * 时长计算 单位 ms
 */
import leftPad from './leftpad.js';
export default function msToDuration(ms) {
    var sec = 0,
        min = 0,
        hour = 0,
        day = 0,
        dur = {};
    if (ms > 0) {
        //秒
        sec = Math.floor(ms / 1000);
        //分
        if (sec >= 60) {
            min = Math.floor(sec / 60);
            sec = (sec % 60).toFixed(0);
        }
        //时
        if (min >= 60) {
            hour = Math.floor(min / 60);
            min = min % 60;
        }
        //天
        if (hour >= 24) {
            day = Math.floor(hour / 24);
            hour = hour % 24;
        }
    }
    dur.day = leftPad(day, '00');
    dur.hour = leftPad(hour, '00');
    dur.min = leftPad(min, '00');
    dur.sec = leftPad(sec, '00');
    return dur;
};
