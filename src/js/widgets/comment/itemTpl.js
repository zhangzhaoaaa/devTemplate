/**
 * Created by zhangmike on 2017/2/22.
 */
export let items = `
  <% for(var i = 0, list = listData.list, len = list.length; i < len; i++) {%>
      <div class="cmt-item clearfix">
        <div class="cmt-user-icon">
            <% if(list[i].user.avatar !== '' && list[i].user.avatar != null){ %>
                <img src="<%=list[i].user.avatar%>">
            <%}%>
        </div>
        <div class="cmt-body">
          <div class="cmt-action">
            <span class="cmt-username"><%=list[i].user.nickname%></span>
            <div class="cmt-action-btn">
              <div class="cmt-time" data-count="<%=$helpers.dateFormat(list[i].create_time)%>"></div>
            </div>
          </div>
          <div class="cmt-content"><%=list[i].content%>
          </div>
        </div>
      </div>
  <%}%>
`;

