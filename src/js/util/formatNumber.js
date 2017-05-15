/**
 *
 Created by zhangzhao on 2017/4/21.
 Email: zhangzhao@gomeplus.com
 */
export default function formatNumber(number) {
    var num = parseInt(number),
        million = '万',
        billion = '亿';

    if (num < 10000) {
        return num;
    } else if (num >= 10000 && num < 100000000 ) {
        return parseFloat((num / 10000).toFixed(1)) + million;
    } else if (num >= 100000000 && num < Number.MAX_VALUE) {
        return parseFloat((num / 100000000).toFixed(1)) + billion;
    } else {
        return '无限';
    }
}
