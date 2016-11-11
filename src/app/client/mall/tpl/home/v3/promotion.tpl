<% _.each(dataList, function (item, index) { %>
  <% 
    if (item.list.length <= 0) {
      return;
    }

    if(item.tpl === 1) {
  %>
    <!-- 推荐位：左、右两个 -->
    <div class="home-panel-bar">
      <div class="home-panel-area flex-row top">
      <% _.each(item.list, function(item1, index1) { %>
        <% if(index1 > 1) {return;}%>
        <div class="home-panel-area-pic wide">
          <a
            data-log-mall-click="index-promotion_<%= item1.title %>-<%= item1.productid %>"
            data-productid="<%= item1.productid %>"
            data-group-id="<%= item1.groupId %>"
            data-title="<%= item1.title %>"
            class="<%= tplUtil.getJsClass(item1) %> block"
            href="<%= tplUtil.getBlockUrl(item1) %>"
          >
            <div class="common-position">
              <div class="posi"></div>
            </div>
            <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item1.img %>" class="op0 goods-img" alt="">
          </a>
        </div>
      <% }); %>
      </div>
    </div>
  <%
    }else if(item.tpl === 2) {
  %>
    <!-- 推荐位：上、下排列（中图） -->
    <div class="home-choice-bar">
      <div class="home-choice-area">
        <h5 class="home-title"><span>HUOLI 为你优选</span></h5>
        <% _.each(item.list, function(item1, index1) { %>
        <div class="home-choice-area-pic">
          <a
            data-log-mall-click="index-promotion_<%= item1.title %>-<%= item1.productid %>"
            data-productid="<%= item1.productid %>"
            data-group-id="<%= item1.groupId %>"
            data-title="<%= item1.title %>"
            class="<%= tplUtil.getJsClass(item1) %> block"
            href="<%= tplUtil.getBlockUrl(item1) %>"
          >
            <div class="common-position">
              <div class="posi"></div>
            </div>
            <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item1.img %>" class="op0 goods-img" alt="">
          </a>
        </div>
        <% }); %>
      </div>
    </div>
  <%
    }else if(item.tpl === 3) {
  %>
    <!-- 推荐位：上、下排列（大图） -->
    <div class="home-select-bar">
      <div class="home-select-area">
        <h5 class="home-title"><a class="block"><span class="icon">TOP.01 | 专题精选</span></a></h5>
        <% _.each(item.list, function(item1, index1) { %>
        <div class="home-select-area-pic">
          <a
            data-log-mall-click="index-promotion_<%= item1.title %>-<%= item1.productid %>"
            data-productid="<%= item1.productid %>"
            data-group-id="<%= item1.groupId %>"
            data-title="<%= item1.title %>"
            class="<%= tplUtil.getJsClass(item1) %> block"
            href="<%= tplUtil.getBlockUrl(item1) %>"
          >
            <div class="select-pic">
              <div class="common-position">
                <div class="posi"></div>
              </div>
              <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item1.img %>" class="op0 goods-img" alt="">
            </div>
            <div class="select-text-contain">
              <p class="main"><%= item1.topicTitle %></p>
              <p class="next"><%= item1.topicDesc %></p>
            </div>
          </a>
        </div>
        <% }); %>
      </div>
    </div>
  <%
    }
  %>
<% }); %>
