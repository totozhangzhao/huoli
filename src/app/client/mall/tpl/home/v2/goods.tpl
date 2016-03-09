<div class="home-goods-shadow"></div>
<ul class="home-goods-bar clearfix no-select">
  <% _.each(dataList,function (item, index) { %>
    <li>
        <a
          data-log-click="<%= appName %>-block_<%= item.productid %>_<%= item.title %>@click@index"
          data-productid="<%= item.productid %>"
          data-title="<%= item.title %>"
          data-classify="<%= item.classify || '' %>"
          class="<%= tplUtil.getJsClass(item) %> block"
          href="<%= tplUtil.getBlockUrl(item) %>"
        >
          <div class="home-info-bar">
            <div class="home-pic-area">
              <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="op0" >
            </div>
            <div class="home-info-show">
              <p class="hmoe-goods-name"><%= item.title %></p>
            </div>
            <p class="home-goods-price">
              <% if(item.points) {%>
                <em class="home-point-icon"></em>
              <% } %>
              <%
                var p = [];
                if(item.points){
                  p.push(item.points);
                }
                if(item.money){
                  p.push(item.money);
                }
                var price = p.join("+"); 
              %>
              <span><%= price %></span>
              <%= !!item.money ? '元' : ''%>
            </p>
          </div>
        </a>
      </li>
  <% }); %>

</ul>