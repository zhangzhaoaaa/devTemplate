/**
 * [toast]
 * @Author: Fu Xiaochun
 * @Email:  fuzhengchun@gomeplus.com
 * how to use:
 * 参数说明：
 * info: 必选，配置对象或提示文案的字符串
 * delay: 可选，提示多少毫秒后消失，默认是2000
 * cb: 可选，提示消失后的回调方法。
 * 
 * e.g.
 * toast('提示内容');
 * toast('提示内容',5000,function(){alert('提示消失后的回调方法')});
 * toast({
 *     msg:'提示文案',  // 必填
 *     x:100,  // 位置坐标X轴
 *     y:100,  // 位置坐标Y轴，x,y两个值要同时给出，则为自定义位置，否则默认屏幕视口居中显示
 *     delay:1000,
 *     cb:function(){
 *         alert('提示消失的回调函数');
 *     }
 * });
 */
import 'css/components/toast.scss';

var $dom = null;
function toast(info,delay,cb) {
    var timer = null;
    var foo = function(){};
    var isCenter = true;
    var conf = {
        msg: '',
        x:null,
        y:null,
        delay: 2000,
        cb:foo
    };

    if (typeof info === 'string') {
        conf.msg = info;
        conf.delay = typeof delay === 'number' ? delay?delay:2000:2000;
        conf.cb = typeof cb === 'function' ? cb : foo;
    }else{
        $.extend(conf, info);
    }

    if (conf.x !== null && conf.y !== null) {
        isCenter = false;
    }

    if (conf.msg.trim() === '') {
        return false;
    }

    if (!$dom) {
        $dom = $('<div/>').html(conf.msg).addClass('pub-toast');
        $('body').append($dom);
    }else{
        if (timer) {
            clearTimeout(timer);
            timer = null;
            $dom.hide();
        }
        $dom.html(conf.msg).show();
    }

    var w = $dom.outerWidth(true);
    var h = $dom.outerHeight(true);
    var autoPositionCss = {
        position:'absolute',
        left:conf.x,
        top:conf.y
    };
    var centerPositionCss = {
        position:'fixed',
        left:'50%',
        top:'50%',
        marginLeft: -w / 2,
        marginTop: -h / 2
    };
    var positionCss = isCenter ? centerPositionCss : autoPositionCss;
    $dom.css(positionCss);
    clearTimeout(timer);
    timer = setTimeout(function() {
        $dom.hide().html('');
        conf.cb();
        timer = null;
    }, conf.delay);
}

export default toast;