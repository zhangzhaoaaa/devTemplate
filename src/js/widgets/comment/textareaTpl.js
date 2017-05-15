/**
 * Created by zhangmike on 2017/2/22.
 */
export var textarea = `
        <div class="cmt-form">
        <div class="cmt-textarea clearfix" data-id="inputComment">
            <textarea data-id="txtComment" id="txtComment" placeholder="我来说两句..."></textarea>
            <div data-id="wordNumberArea" class="cmt-wordnumber">
            </div>
            <div class="cmt-error hide" data-id="errorInfo"><span data-id="errorTips"></span>
                <div class="cmt-a1"></div>
                <div class="cmt-a2"></div>
            </div>
        </div>
       
        <div data-id="headIcon" class="clearfix cmt-user">
            <div class="cmt-login-icon fl" style="<%=loginFlag ? '' : 'visibility: hidden;' %>">
                <%if (user.avatar!=null) {%>
                    <img src="<%=user.avatar%>">
                <%}%>
                <span><%=user.nickName%></span>
            </div>
        	<div class="cmt-btn" data-id="sendButton"></div>
        </div>
    </div>
`;
