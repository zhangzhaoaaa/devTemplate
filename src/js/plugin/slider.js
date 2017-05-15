/**
 * [slider]
 * @Author: Fu Xiaochun
 * @Email:  fuzhengchun@gomeplus.com
 */
class Slider{
	constructor(opts) {

		let dfs = {
			prev: '',
			next: '',
			showNav: true,
			showCtrl: true,
			autoPlay: true,
			init:function(){}
		};

		Object.assign(dfs,opts);
		
		this.$slider = $(dfs.selector);
		this.$prev = $(dfs.prev);
		this.$next = $(dfs.next);
		this.showNav = dfs.showNav,
		this.showCtrl = dfs.showCtrl,
		this.autoPlay = dfs.autoPlay,
		this.init = dfs.init;
		this.$wrap = null;
		this.$item = null;
		this.$nav = null;
		this.itemWidth = 0;
		this.initItemLen = 0;
		this.itemLen = 0;
		this.index = 1;
		this.curIndex = 0;
		this.timer = null;
		this.speed = 800;
		this.duration = 4000;
		this.clicked = false;

		this._init();
	}
	_init(){
		this._initDom();
		this._bindEvent();
		this._timeOut();
		this.init();
	}

	_initDom(){
		let $wrap = this.$slider.children('ul');
		let $item = $wrap.children('li');
		let itemWidth = $item.width();
		let $itemFirst = $item.first();
		let $itemLast = $item.last();
		this.$wrap = $wrap;
		this.$item = $item;
		this.itemWidth = itemWidth;

		$wrap
		.prepend($itemLast.clone())
		.append($itemFirst.clone())
		.css({
			width: itemWidth * ($item.length+2) + 'px',
			left:'-'+itemWidth+'px'
		});

		this.initItemLen = $item.length;
		this.itemLen = $item.length+2;

		this._initCtrl();
		this._initNav();
	}

	_initCtrl(){
		if (this.showCtrl) {
			this.$slider.append(this.$prev).append(this.$next);
		}
	}

	_initNav(){
		let $nav = null;
		let navTpl = '';
		if (this.showNav) {
			$nav = $('<div/>').addClass('sliderNav');
			for(let i=0;i<this.itemLen-2;i++){
				let activeCls = !i ? 'class="active"' : '';
				navTpl += '<span '+activeCls+'></span>';
			}
			$nav.html(navTpl);
			this.$nav = $nav;
			this.$slider.append($nav);
		}
	}

	_bindEvent(){
		let _this = this;
		function toChange(step){
			if (_this.clicked) {
				return false;
			}
			_this.clicked = true;
			_this.index = _this.index + step;
			_this.transition();
			_this.navChange();
		}
		this.$slider.on({
			'mouseenter': function(){
				clearInterval(_this.timer);
			},
			'mouseleave': function(){
				_this._timeOut();
			}
		});

		if (this.showCtrl) {
			this.$prev.on('click',function(){
				toChange(-1);
			});
			this.$next.on('click',function(){
				toChange(1);
			});
		}

		if (this.showNav) {
			this.$nav.on('mouseenter','span', function(){
				let $this = $(this);
				$this.addClass('active').siblings('span').removeClass('active');
				_this.index = $this.index()+1;
				_this.$wrap.stop(true,false);
				_this.transition();
			});
		}
	}

	_timeOut(){
		if (!this.autoPlay) {
			return false;
		}
		let _this = this;
		clearInterval(this.timer);
		this.timer = setInterval(() => {
			this.animation();
		},this.duration);
	}

	transition(){
		let _this = this;
		var left = '-'+this.index*this.itemWidth+'px';
		
		this.$wrap.animate({
			left:left
		},this.speed, () => {
			this.transitionEnd();
		});
	}

	transitionEnd(){
		let index = this.index;
		let itemLen = this.itemLen;
		if (index <=0) {
			index = itemLen-2;
		}else if(index >= itemLen-1){
			index = 1;
		}
		this.$wrap.css({
			left: '-'+this.itemWidth*index+'px'
		});
		this.index = index;
		this.clicked = false;
	}

	navChange(){
		if (!this.showNav) {
			return false;
		}
		let index = this.index;
		let itemLen = this.itemLen;
		let curIndex = this.index-1;
		if(index >= itemLen-1){
			curIndex = 0;
		}else if(index < 1){
			curIndex = itemLen - 3;
		}
		this.$nav.find('span').eq(curIndex).addClass('active').siblings('span').removeClass('active');
	}

	animation(){
		this.index++;
		this.transition();
		this.navChange();
	}
}

export default Slider;