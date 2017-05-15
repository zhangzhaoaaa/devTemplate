import formatDate from './formatDate.js';
// 传入的时间格式  2016-04-27 15:12:58
var fromNow = function(timeStr, max) {
    /**
      1）一分钟内的显示，刚刚发布
      2）1个小时以内发表的消息，显示发表的分钟数，如“20分钟前”；
      3）在24小时以内，发表的信息，显示具体小时数，如“15小时前”；
      4）大于1天小于30天的，显示 **天前
      5）超过30天前，显示具体年/月/日
    **/

    var showTime = "";
    timeStr = (typeof timeStr === "string" ? parseInt(timeStr) : timeStr) * 1000;
    var time = new Date(timeStr).getTime();
    var date = new Date().getTime();
    var num = date - time;
    var maxDay = max || 30;
    var oneMin = 60000,
        oneHour = 3600000,
        oneDay = 24 * 3600000;
    var s;
    if (num < oneMin) {
        showTime = '刚刚发布';
    } else if (num >= oneMin & num < oneHour) {
        s = Math.floor(num / oneMin);
        showTime = s + "分钟前";
    } else if (num >= oneHour & num < oneDay) {
        s = Math.floor(num / oneHour);
        showTime = s + "小时前";
    } else if (num >= 1 * oneDay & num < maxDay * oneDay) {
        s = Math.floor(num / oneDay);
        showTime = s + "天前";
    } else {
        showTime = formatDate(timeStr, 'yyyy-MM-dd');
    }
    return showTime;
}

module.exports = fromNow;
