/**
 *
 Created by zhangzhao on 2017/4/27.
 Email: zhangzhao@gomeplus.com
 */
/* css */
import GMP from 'GMP';
import { debounce } from 'util/common.js';

function preInit(options = {}, config = {}) {
    let d = {
        'click .unslider-nav li': 'clickNavEvent'
    };

    if (!options.events) {
        options.events = d;
    } else {
        GMP.Util.defaults(options.events, d);
    }
    if (!options.data) {
        options.data = config;
    } else {
        GMP.Util.defaults(options.data, config);
    }
}

export default class Slide extends GMP.BaseClass{
    constructor(options = {}) {
        preInit(options, {
            cls: 'unslider',
            autoplay: false,
            delay: 5000,
            speed: 750,
            easing: 'swing', // [.42, 0, .58, 1],
            nav: false,

            arrows: {
                prev: '<a class="' + 'unslider-arrow prev"></a>',
                next: '<a class="' + 'unslider-arrow next"></a>'
            },
            animation: 'horizontal',
            selectors: {
                outwrap: '.unslider',
                container: 'ul:first',
                slides: 'li'
            },
            animateHeight: false,
            activeClass: 'unslider-active'
        })
        super(options)
        this.trigger('_on_after', options);
    }
    clickNavEvent(e) {
        var $me = $(e.target).addClass(this.data.activeClass);

        $me.siblings().removeClass(this.data.activeClass);

        this.animate($me.attr('data-slide'));
    }
    _create() {
        this._start();
        $(window).resize(debounce(this.calculateSlides.bind(this), 200));
    }
    _start() {
        var self = this;
        self.$context = this.$el;
        self.options = this.data;
        self.$wrapper = null;
        self.$Elcontainer = null;
        self.$Ulcontainer = null;
        self.$slides = null;
        self.$nav = null;
        self.$arrows = [];

        self.total = 0;
        self.current = 0;

        self.prefix = this.data.cls + '-';
        self.eventSuffix = '.' + self.prefix + ~~(Math.random() * 2e3);

        self.interval = [];

        self.init = function() {
            self.$context.find('.default-unslider').wrap('<div class="unslider" />');
            self.$wrapper = self.$context.find('.unslider');
            self.$Elcontainer = self.$wrapper.find('.default-unslider');
            self.$Ulcontainer = self.$Elcontainer.find('.unslider-ulcontainer').addClass(self.prefix + 'wrap');
            self.$slides = self.$Ulcontainer.children(self.options.selectors.slides);

            self.setup();

            $.each(['nav', 'arrows'], function(index, module) {
                self.options[module] && self['init' + self._ucfirst(module)]();
            });

            self.options.autoplay && self.start();

            self.calculateSlides();

            return self.animate(self.options.index || self.current, 'init');
        };

        self.setup = function() {
            self.$Elcontainer.addClass(self.prefix + self.options.animation);
            var position = self.$Elcontainer.css('position');

            if(position === 'static') {
                self.$Elcontainer.css('position', 'relative');
            }

            self.$Elcontainer.css('overflow', 'hidden');
        };

        self.calculateSlides = function() {
            self.$slides = self.$Ulcontainer.children(self.options.selectors.slides);

            self.total = self.$slides.length;

            if(self.options.animation !== 'fade') {
                var prop = 'width';

                if(self.options.animation === 'vertical') {
                    prop = 'height';
                }


                //self.$Ulcontainer.css(prop, (self.total * 100) + '%').addClass(self.prefix + 'carousel');
                //self.$slides.css(prop, (100 / self.total) + '%');
                self.$Ulcontainer.css(prop, (self.total * self.$el.width()) + 'px').addClass(self.prefix + 'carousel');
                self.$slides.css(prop, self.$el.width() + 'px');
            }
        };

        self.start = function() {
            self.interval.push(setTimeout(function() {
                self.next();
            }, self.options.delay));

            return self;
        };

        self.stop = function() {
            var timeout;
            while(timeout = self.interval.pop()) {
                clearTimeout(timeout);
            }

            return self;
        };


        self.initNav = function() {
            var $nav = $('<nav class="' + self.prefix + 'nav"><ol /></nav>');

            if (self.$nav) {
                return;
            }

            self.$slides.each(function(key) {
                var label = this.getAttribute('data-nav') || key + 1;

                if($.isFunction(self.options.nav)) {
                    label = self.options.nav.call(self.$slides.eq(key), key, label);
                }

                $nav.children('ol').append('<li data-slide="' + key + '">' + label + '</li>');
            });

            self.$nav = $nav.insertAfter(self.$Elcontainer);
        };

        self.initArrows = function() {
            if (self.$prev || self.$next) {
                return;
            }

            if(self.options.arrows === true) {
                self.options.arrows = self.defaults.arrows;
            }

            $.each(self.options.arrows, function(key, val) {
                let aobj = $(val).insertAfter(self.$Elcontainer).on('click' + self.eventSuffix, self[key]);
                self.$arrows.push(aobj);
                self['$' + key] = aobj;
            });

        };


        self.setIndex = function(to) {
            if(to < 0) {
                to = self.total - 1;
            }

            self.current = Math.min(Math.max(0, to), self.total - 1);

            if(self.options.nav) {
                self._active(self.$nav.find('[data-slide="' + self.current + '"]'), self.options.activeClass);
            }

            self._active(self.$slides.eq(self.current), self.options.activeClass);

            return self;
        };

        self.animate = function(to, dir) {
            if(to === 'first') to = 0;
            if(to === 'last') to = self.total;

            if(isNaN(to)) {
                return self;
            }

            if(self.options.autoplay) {
                self.stop().start();
            }

            self.setIndex(to);

            var fn = 'animate' + self._ucfirst(self.options.animation);

            if($.isFunction(self[fn])) {
                self[fn](self.current, dir);
            }

            return self;
        };


        self.next = function() {
            var target = self.current + 1;

            if(target >= self.total) {
                target = 0;
            }

            return self.animate(target, 'next');
        };

        self.prev = function() {
            return self.animate(self.current - 1, 'prev');
        };

        self.animateHorizontal = function(to) {
            var prop = 'left';

            if(self.$context.attr('dir') === 'rtl') {
                prop = 'right';
            }

            if(self.options.infinite) {
                self.$container.css('margin-' + prop, '-100%');
            }

            return self.slide(prop, to);
        };

        self.slide = function(prop, to) {
            if(self.options.infinite) {
                var dummy;

                if(to === self.total - 1) {
                    dummy = self.total - 3;
                    to = -1;
                }

                if(to === self.total - 2) {
                    dummy = 0;
                    to = self.total - 2;
                }

                if(typeof dummy === 'number') {
                    self.setIndex(dummy);

                    self.$context.on(self._ + '.moved', function() {
                        if(self.current === dummy) {
                            self.$container.css(prop, -(100 * dummy) + '%').off(self._ + '.moved');
                        }
                    });
                }
            }

            var obj = {};

            obj[prop] = -(100 * to) + '%';

            return self._move(self.$Ulcontainer, obj);
        };

        self._move = function($el, obj, callback, speed) {
            if(callback !== false) {
                callback = function() {
                    self.$context.trigger(self._ + '.moved');
                };
            }

            return self._moveAnimate($el, obj, speed || self.options.speed, self.options.easing, callback);
        };

        return self.init();
    }

    _active(el, className) {
        return el.addClass(className).siblings().removeClass(className);
    }

    _ucfirst(str) {
        return (str + '').toLowerCase().replace(/^./, function(match) {
            return match.toUpperCase();
        });
    }
    _moveAnimate() {
        arguments[0].stop(true, true);
        return $.fn[$.fn.velocity ? 'velocity' : 'animate'].apply(arguments[0], [].slice.call(arguments, 1));
    }
};