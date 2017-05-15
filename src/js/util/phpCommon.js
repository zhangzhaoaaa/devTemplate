/**
 *
 Created by zhangzhao on 2017/2/28.
 Email: zhangzhao@gomeplus.com
 */
/***
 * php页面中存在的数据
 *
 * loginFlag true:登录，false:未登录
 *
 * user: {
 *      userId: 0, //为0代表没有登录
 *      nickName: "", //昵称
 *      avatar: ""  // 头像
 * }
 *
 * page: {
 *  topicId: "19", // 话题ID
 *  link: "",
 *  imageUrl: "",
 *  title: "直播标题",
 *  shareDesc: "副标题"
 * }
 */
var page = window.$CONFIG || {};
var loginFlag = page.userId ? true : false;
var param = function(obj){
    var ret = [];
    for(var i in obj){
        if(obj.hasOwnProperty(i)){
            ret.push(i + '=' + obj[i]);
        }
    }
    return ret.join('&');
};


var apiParams = {
    inParams: param({ // 登录公参
        platform: 'pc',
        user_id: page.userId,
        device_id: 'pc',
        auth: '95PCQUKMWLR',
        token: page.SCN // 要求CMS将此数据放到页面
    }),
    outParams: $.param({ // 未登录公参
        platform: 'pc',
        device_id: 'pc',
        auth: '95PCQUKMWLR'
    })
};

var env = window.location.host.indexOf('pre') != -1 ?
    'pre' : (window.location.host.indexOf('dev') != -1 ? 'dev' : 'dist');

export {loginFlag, page, apiParams, env};
