/**
 * Created by 张昭 on 2017/2/22.
 */
/****
 * 评论组件
 *
 * 使用方法：
 * var comment  = new Comment({
 *      data: {
 *          topic_id: 1 //详情页id
 *      },
 *      el: '#container', // 评论组件的容器，如一个div的id
 * });
 *
 * 获取评论：
 * comment.fetchComments(topic_id);
 */
import 'css/widgets/comment/comment.scss';
import GMP from 'GMP';
import {tpl} from './indexTpl';
import {textarea} from './textareaTpl';
import {items} from './itemTpl';
import {wordNumber} from './wordNumberTpl';
import {sendButton} from './sendButtonTpl';
import {totalNumber} from './totalNumberTpl';
import fetch from 'io/fetch';
import toast from 'components/toast';
import 'util/GMPHelper';
import {loginFlag, page, apiParams} from 'util/phpCommon';
import 'plugin/jquery.autoResize';

function preInit(options = {}, config = {}) {
	let d = {
		'click .okBtn': 'ok'
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

class Comment extends GMP.BaseClass {
    constructor(options) {
        preInit(options, {
            limitNum: 300,
            wordsNum: 0,
            comment_num: "0", // 评论总数
            btnActiveClass: 'cmt-black', // 【发送】button的默认样式
            limitNumClass: '', // 显示文字长度区域
            noMore: true, // 没有更多评论
            content: '', // 评论内容
            cursor: '',  //评论游标
            pageSize: 5, // 每页条数
            fetchUrl:'/v1/comment/list', // 请求url
            sendUrl: '/v1/comment/post', // 发送url
            listData: {}, // 评论数据
            sended: false, // 评论是否已发送，未发送:false，已发送:true
            error: false, // 请求是否出错
            loginFlag: false,
            foucsBorderColor: '#4285f4',
            errorBorderColor: '#ea362f',
            errorTips: '',
            user: {
                avatar: '',  // 用户头像
                nickName: ''
            }
        });
        super(options);
        this.trigger('_on_after', options);
        this.els = {
            textareaEle: this.$el.find('[data-id=txtComment]'),
            commentsListArea: this.$el.find('[data-id=comments]')
        }
        this.$el.find('[data-id=txtComment]').autoTextarea({padding:2});
    }
    _create() { // 创建和渲染组件
        this.data.loginFlag = loginFlag;
        this._createWrapper();
        this.uiComment.append(tpl);
        this.on('change:wordsNum', this.renderWordNumber); // 字数变化
        this.on('change:limitNumClass', this.renderWordNumber); // 字数颜色变化
        this.on('change:btnActiveClass', this.renderSendButton); // 按钮变化
        this.on('change:comment_num', this.renderTotalNumber);
        this.on('sendedEvent', this.renderCommentList); // 发送按钮
        this.renderTotalNumber();
        this.renderInputArea();
    }
    _createWrapper() {
        this.uiComment = $('<div>')
            .appendTo(this._appendTo(this.el));
    }
    renderInputArea() { // 渲染输入区域
        if (this.data.loginFlag) {
            this.data.user.avatar = page.avatar;
            this.data.user.nickName = page.nickName;
            let cmt = localStorage.getItem('gm~comment');
            this.data.content = cmt != null ? cmt : this.data.content;
        }
        this.$el.find('[data-id=inputArea]').html(GMP.template(textarea)(this.data));
        this.txtComment = $('#txtComment');
        this.txtComment.on('input', this.limitNumber.bind(this));
        this.renderWordNumber();
        this.renderSendButton();
        this.openTextarea();
    }
    renderWordNumber() { // 渲染字数区域
        this.$el.find('[data-id=wordNumberArea]').html(GMP.template(wordNumber)(this.data));
    }
    renderSendButton() { // 渲染发送按钮
        this.$el.find('[data-id=sendButton]').html(GMP.template(sendButton)(this.data));
    }
    renderCommentList() { // 渲染评论列表
        this.els.commentsListArea.empty();
        this.data.scrollload.refreshData();
        //this.$el.find('[data-id=comments]').html(GMP.template(items)(this.data));
        this.data.sended = false;
        this.$el.find('.cmt-inputtips').hide();
    }
    renderTotalNumber() { // 渲染评论总数
        this.$el.find('[data-id=totalNum]').html(GMP.template(totalNumber)(this.data));
    }
    renderTxtBorder(color) { // 渲染输入框边框
        $('#txtComment').css('border-color', color);
    }
    openTextarea() { // 登录后或者发送失败后
        this.$el.find('[data-id=txtComment]').val(this.data.content);
        this.data.wordsNum = 0;
        localStorage.removeItem('gm~comment');
        this.txtComment.trigger('input', 'reopenTxt');
    }
    ok() { // 发送操作
        let that = this;

        // 判断是否连网
        if (that.offLine()) {
            return;
        }

        // 如果未登录
        if (!this.data.loginFlag) {
            localStorage.setItem('gm~comment', this.data.content);
            login();
            return;
        }
        // 如果登录状态，清除comment
        localStorage.removeItem('gm~comment');
        this.data.cursor = '';
        // 输入框文字长度
        let txtLength = this.els.textareaEle.val().trim().length;
        if (txtLength === 0) {
            this.errorTips('输入不能为空哦');
            return;
        }
        if (txtLength > this.data.limitNum) {
            this.errorTips('最多输入300个文字哦');
            return;
        }
        //this.fetchComments(this.data.topic_id).done(()=>{
            fetch.post(that.data.sendUrl + "?" + apiParams.inParams, {
                domain: "domain-user",
                data: {
                    topic_id: that.data.topic_id,
                    content: that.data.content
                },
                success(data) {
                    if (data.code === 200001) { //会话失效
                        g.login();
                        return;
                    }
                    if (data.code === 200) {
                        that.msg('评论发送成功');
                        that.data.content = ''; //清空数据
                        that.$el.find('[data-id=txtComment]').val('');
                        // that.data.listData.list.unshift(data.data);
                        that.data.wordsNum = 0;
                        //that.data.comment_num = parseInt(that.data.listData.comment_num) + 1;
                        that.data.sended = true;
                        that.trigger('sendedEvent');
                        $('html').scrollTop(that.els.commentsListArea.offset().top);
                    } else {
                        that.openTextarea();
                        that.msg('评论发送失败');
                    }
                },
                error(e, status) {
                    if(status === 'timeout') {
                        that.requestTimeout(status);
                    } else {
                        that.openTextarea();
                        that.msg('评论发送失败');
                    }
                }
            });
       // });

        this.sendCallback && this.sendCallBack();
    }
    errorTips(text) {
        let errorInfo = this.$el.find('[data-id=errorInfo]');
        errorInfo.find('[data-id=errorTips]').html(text);
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
        }
        errorInfo.show();
        this.hideTimer = setTimeout(()=> {
            errorInfo.hide(); // 错误提示显示
        }, 2000);
    }
    limitNumber(e, flag) { // input事件
        var target = $(e.target);
        var textLength = target.val().trim().length;
        this.data.wordsNum = textLength;
        this.data.content = target.val().trim();
        var errorInfo = this.$el.find('[data-id=errorInfo]');
        if (textLength > this.data.limitNum){ // 超过字数限制
            this.data.limitNumClass = 'cmt-red'; // 限制字数颜色
            if (flag && flag === 'reopenTxt') {
                this.errorTips('最多输入300个文字哦');
            }
            return false;
        }else {
          this.data.btnActiveClass = 'show btn-primary'; // 按钮可用
          this.data.limitNumClass = 'cmt-black'; // 限制字数颜色
          errorInfo.hide(); // 错误提示不显示
        }
    }
    msg(msg) {
       toast(msg, 500);
    }
    requestTimeout(status) {
        if(status === 'timeout') {
            this.msg('网络异常，请稍后重试');
        }
    }
    offLine() {
        if (!navigator.onLine) {
            this.msg('连接已断开，请检查网络设置');
            return true;
        } else {
            false;
        }
    }
    fetchComments(topic_id = 1) { // 请求评论
        let that = this;
        if (that.offLine()) {
            let d = $.Deferred();
            return d.resolve(false);
        }
        return fetch.get(this.data.fetchUrl + "?" + apiParams.outParams, {
            domain: "domain-user",
            data: {
                topic_id : topic_id,
                page_num: this.data.pageSize,
                cursor: this.data.cursor
            },
            success(data) {
                if (data.code === 200) {
                    that.data.error = false; //未发生请求错误
                    that.data.listData = data.data;
                    if (that.data.listData.current_num === 0) { // 判断是否还有评论记录
                        that.data.noMore = true;
                        return;
                    } else {
                        that.data.noMore = false;
                    }
                    that.data.cursor = that.data.listData.cursor;
                    that.data.comment_num = that.data.listData.total;
                    let commentsHtml = GMP.template(items)(that.data);
                    that.els.commentsListArea.append(commentsHtml);
                } else {
                    that.data.error = true;
                    that.msg('获取评论失败');
                }
            },
            error(e,status)  {
                that.data.error = true;
                that.requestTimeout(status);
            }
        });
    }
}

export default Comment;