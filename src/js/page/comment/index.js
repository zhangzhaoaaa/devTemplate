/* css */
import 'css/base/_reset.scss';
import 'css/components/scroll-load.scss';
import 'css/widgets/comment/comment.scss';

/* header and footer */
import Scrollload from 'Scrollload';
import Comment from 'widgets/comment/comment';

let comment = new Comment({
    data: {
        topic_id: 1
    },
    el: '#wrap'
});

let scrollload = new Scrollload(document.querySelector('#wrap'), function(sl){
    comment.fetchComments(1).done((sta)=>{
        if (!sta) {
            sl.throwException();
            return;
        } else {
            if (comment.data.noMore) {
                sl.noData();
            } else if (comment.data.error) {
                sl.throwException();
                return;
            } else {
                sl.unLock();
            }
        }
    });
}, {
    loadingHtml: '<div class="infinite-scroll"><span>加载中...</span></div>',
    noDataHtml: '<div class="infinite-scroll"><span>没有更多评论了</span></div>',
    exceptionHtml: `<div class="infinite-scroll clickHandler"><span>评论加载异常，点击重试</span></a></div>`
});

scrollload.container.addEventListener('click', function (event) {
    if ($(event.target).hasClass('clickHandler')) {
        scrollload.solveException();
    }
});