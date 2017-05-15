/**
 *
 Created by zhangzhao on 2017/5/15.
 Email: zhangzhao@gomeplus.com
 */
export default function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return (decodeURIComponent(r[2])); return null;
}