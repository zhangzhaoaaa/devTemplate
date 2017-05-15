/**
 * [分享]
 * @Author: Fu Xiaochun
 * @Email:  fuzhengchun@gomeplus.com
 * how to use:
 * var shareObj = new Share();
 * var shareObj = new Share(opts);
 * 参数说明：
 * opts 可选，为空返回实例，页面无效果，可调用实例的方法shareTo_xx单个分享到各平台。
 * opts = {
 * 		id: 'sharebox', // 页面分享容器id
 * 		targets:{  // 分享到社交平台的配置，不给则为默认值
 * 			qq:{
 * 				title:'分享的标题,默认为页面title',
				url: '分享的地址，默认为页面地址',
				site: '来源：meta标签name=site的内容，个别平台有可能用',
				desc: '分享附带的描述，默认页面的description',
				summary: '页面meta描述',
				pics: '图片地址，有些平台支持多张，用|隔开'
 * 			},
 * 			...
 * 		},
 * 		copyUrl:{  // 如果没有copyUrl此项或此项值为null，则不显示更多按钮及相应的浮层。
 * 			'Flash':'内容'   //  input框：内容。    button按钮：复制Flash代码
 * 			'通用':'通用内容'   //  input框：通用内容。    button按钮：复制通用代码
 * 		}
 * }
 */
import 'css/components/share.scss';

class Share{
	constructor(opts){
		var info = {};
		var def = {
			id: '',
			titleHtml:'<div class="share-title">分享到：</div>',
			targets:{qq: info, wx: info, wb: info, qz: info},
			copyUrl:null
		};
		var $description = document.querySelector('meta[name=description]');
		var pageDescription = $description ? $description.content : '';

		this.page = {
			title:document.title,
			description:pageDescription,
			url:window.location.href
		};
		this.config = {
			qq:{name:'QQ',icon:'icon-39',action:'shareTo_qq'},
			wx:{name:'微信',icon:'icon-38',action:'shareTo_wx'},
			wb:{name:'新浪微博',icon:'icon-40',action:'shareTo_wb'},
			qz:{name:'QQ空间',icon:'icon-41',action:'shareTo_qz'}
		};

		if (typeof opts === 'undefined') {
			return;
		}

		var dom = document.getElementById(opts.id);
		if (!dom) {
			return;
		}

		for(var k in opts){
			def[k] = opts[k];
		}

		this.titleHtml = def.titleHtml;
		this.$dom = dom;
		this.targets = {};

		for (var key in def.targets) {
			if (typeof this.config[key] !== 'undefined') {
				this.targets[key] = def.targets[key];
			}
		}
		this.copyUrl = def.copyUrl;
		this._default();
		
	}

	_default(){

		var template = this.titleHtml;
		for(var k in this.targets){
			template += `<a href="javascript:;" title="${this.config[k].name}" class="${k}"><em class="${this.config[k].icon}"></em></a>`;
		}
		if (this.copyUrl !== null) {
			template += this._getShowMoreHTML(this.copyUrl);
		}
		var oldClassName = this.$dom.className;
		this.$dom.className = oldClassName + ' Pub-Share';
		this.$dom.innerHTML = template;
		this._bindEvent();
	}

	_bindEvent(){
		var _this = this;
		this.$dom.addEventListener('click',function(e){
			var el = e.target.parentNode;
			var elClassName = el.className.trim();
			if (el.tagName.toUpperCase() === 'A') {
				_this['shareTo_'+elClassName](_this.targets[elClassName]);
			}
		});
		this.$dom.addEventListener('click',function(e){
			var el = e.target;
			var tips = e.currentTarget.querySelector('.shareCopyTips');
			var urlInput = el.parentNode.querySelector('input');

			function toast(msg){
				clearTimeout(tips.timer);
				tips.innerHTML = msg;
				tips.style.cssText = 'display:block;top:'+(el.offsetTop-4)+'px';
				tips.timer = setTimeout(function(){
					tips.style.cssText = 'display:none';
					tips.timer = null;
				},1500);
			}
			if (el.tagName.toUpperCase() === 'BUTTON') {

				urlInput.focus();
				urlInput.setSelectionRange(0, urlInput.value.length);
				
				// 复制操作
				if (document.execCommand('copy', true)) {
					urlInput.blur();
					toast('复制成功');
				}else{
					toast('右键或Ctrl/Command+C复制');
				}

			}
		});
	}

	_getShowMoreHTML(data){
		var tpl = `
			<div class="smore">
				<span><em class="icon-12"></em></span>
				<div class="smorebox">
					<em class="uparrow">▲</em>
					<ul class="copyurl">`;
		var emptyData = true;
		for(var k in data){
			emptyData = false;
			tpl += `<li>
						<input readonly="true" class="input" type="text" value="${data[k]}">
						<button class="copybtn">复制${k}地址</button>
					</li>`;
		}
		if (emptyData) {
			tpl += '<li class="label">&nbsp;没有数据!</li>';
		}

		tpl += `	</ul>
					<div class="shareCopyTips">复制成功</div>
				</div>
			</div>
		`;
		return tpl;
	}

	_getConfig(conf){
		var defaults = {
			title: this.page.title,
			url: this.page.url,
			site: '',
			desc: this.page.description,
			summary: this.page.description,
			pics: ''
		};
		for(var k in conf){
			defaults[k] = conf[k];
		}
		return defaults;
	}

	_getUrlEncodeStrByType(ruleArr,conf){
		var str = '';
		var len = ruleArr.length;
		var res = {};
		var key;
		for(var i=0;i<len;i++){
			key = ruleArr[i];
			if (key === 'pic') {
				res[key] = conf.pics;
			}else{
				res[key] = typeof conf[key] === 'undefined'? '' : conf[key];
			}
		}
		for(var k in res){
			if (k === 'title' || k === 'desc' || k === 'summary') {
				str += '&'+k+'='+encodeURIComponent(res[k]);
			}else{
				str += '&' + k + '=' + res[k];
			}
		}

		return str.substr(1);
	}

	shareTo_qq(arg){
		var conf = this._getConfig(arg);
		var params = ['title','url','site','desc','summary','pics'];
		var paramsStr = this._getUrlEncodeStrByType(params,conf);

		var api = 'http://connect.qq.com/widget/shareqq/index.html?'+paramsStr;
		window.open(api);
	}

	shareTo_wx(arg){
		var conf = this._getConfig(arg);
		// var api = $CONFIG['domain-user'] + '/v1/qrcode/index?url=' + $CONFIG['mshare'] + '/' + $CONFIG['topicId'] + '.html';
		var api = $CONFIG['domain-user'] + '/v1/qrcode/index?url=' + conf.url;

		function weixinPop(){
			var $wxpop = document.createElement('div');
			var tpl = '<div class="wx-main"><div class="wx-code"><img src="'+api+'" alt="分享到微信" /></div><p>打开微信扫一扫，即可分享</p><a href="javascript:;" title="点击关闭" class="wx-close icon-13"></a></div>';
			$wxpop.className = 'shareWeixinPop';
			$wxpop.innerHTML = tpl;
			document.body.appendChild($wxpop);
			$wxpop.onclick = function(e){
				if (e.target.tagName.toUpperCase() === 'A') {
					document.body.removeChild($wxpop);
					$wxpop.onclick = null;
					$wxpop = null;
				}
			};
		}
		weixinPop();
	}

	shareTo_wb(arg){
		var conf = this._getConfig(arg);
		var params = ['title','url','site','desc','summary','pic'];
		var paramsStr = this._getUrlEncodeStrByType(params,conf);

		var api = 'http://service.weibo.com/share/share.php?'+paramsStr;
		window.open(api);
	}

	shareTo_qz(arg){
		var conf = this._getConfig(arg);
		var params = ['title','url','site','desc','summary','pics'];
		var paramsStr = this._getUrlEncodeStrByType(params,conf);

		var api = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'+paramsStr;
		window.open(api);
	}
}

export default Share;