/**
 *
 Created by zhangzhao on 2017/3/28.
 Email: zhangzhao@gomeplus.com
 */
(function($) {

    $.fn.autoTextarea = function(settings) {

        var options = $.extend({
            padding: 0
        }, settings);

        return this.each(function() {

            var self = this;

            function resize() {
                self.style.height = 'auto';
                self.style.height = (self.scrollHeight + options.padding) + 'px';
            }

            function delayedResize() {
                window.setTimeout(resize, 0);
            }

            $(this).bind('change', resize);
            $(this).bind('cut paste drop keydown', delayedResize);

            resize();
        });
    }
})(jQuery);