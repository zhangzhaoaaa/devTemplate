/**
 *  使用方法:
 * 
 * 
    $(window).infiniteScroll({
        onLoad: function(){
            var d = $.Deferred();
            setTimeout(function(){
                d.resolve(100);
            }, 1500)
            return d;
        }
    });
 * 
 */

$.fn.infiniteScroll = function(options) {
    var defaults = {
        indicator: '<div>加载中...</div>',
        offset: 20,
        onLoad: function() {
            return $.Deferred();
        }
    };

    var $ele = this;

    var opts = $.extend({}, defaults, options);
    var loading = false;
    var indicator = $(opts.indicator);

    var doc = window.document;
    var body = doc.body;
    var docEle = doc.documentElement;

    var $body = $(body);

    var handleInfiniteScroll = function() {
        var scrollTop = body.scrollTop;
        var height = docEle.clientHeight;
        var scrollHeight = Math.max(body.scrollHeight, docEle.scrollHeight);
        if (scrollTop + height >= scrollHeight - opts.offset && !loading) {
            $ele.trigger('infinite');
        }
    };

    this.on('scroll', handleInfiniteScroll);
    this.on('infinite', function() {
        loading = true;
        $body.append(indicator);
        opts.onLoad().done(function(n) {
            loading = false;
            // indicator.remove();
        });
    });
};
