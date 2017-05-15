/**
 * Created by zhangmike on 2017/2/25.
 */
import GMP from 'GMP';
import fromNow from './fromNow';
import formatNumber from './formatNumber';
import msToDuration from './msToDuration';

function formatMsToDuration(obj) {
    let result = '';
    if (obj.day !== '00') {
        return `${obj.day}:${obj.hour}:${obj.min}:${obj.sec}`;
    } else if (obj.hour !== '00') {
        return `${obj.hour}:${obj.min}:${obj.sec}`;
    } else {
        return `${obj.min}:${obj.sec}`;
    }
}

GMP.template.helper('dateFormat', (date)=> {
    return fromNow(date);
});

GMP.template.helper('numberFormat', (number)=> {
    return formatNumber(number);
});

GMP.template.helper('formatMsToDuration', (ms)=> {
    return formatMsToDuration(msToDuration(ms));
});