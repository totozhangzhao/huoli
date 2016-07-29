<% _.each(dataList, function (item, index) { %>
  <% 
    if(item.tpl === 1) {
  %>
    <div class="home-panel-area flex-row top">
    <% _.each(item.list, function (item1, index1){%>
      <% if(index1 > 1) {return;}%>
      <div class="home-panel-area-pic <%= index1 ===0 ? 'wide': 'narrow'%>">
        <a
          data-log-mall-click="index-promotion_<%= item1.title %>-<%= item1.productid %>"
          data-productid="<%= item1.productid %>"
          data-group-id="<%= item1.groupId %>"
          data-title="<%= item1.title %>"
          data-info="index-promotion-<%= index1 %>"
          class="<%= tplUtil.getJsClass(item1) %> block"
          href="<%= tplUtil.getBlockUrl(item1) %>"
        >
          <img src="<%= item1.img%>" alt="">
        </a>
      </div>
    <% }); %>
    </div>
  <%
    }else if(item.tpl === 2) {
  %>
    <div class="home-panel-area flex-row top">
    <% _.each(item.list, function (item2, index2){%>
      <% if(index2 > 1) {return;}%>
      <div class="home-panel-area-pic <%= index2 === 1 ? 'wide': 'narrow'%>">
        <a
          data-log-mall-click="index-promotion_<%= item2.title %>-<%= item2.productid %>"
          data-productid="<%= item2.productid %>"
          data-group-id="<%= item2.groupId %>"
          data-title="<%= item2.title %>"
          data-info="index-promotion-<%= index2 %>"
          class="<%= tplUtil.getJsClass(item2) %> block"
          href="<%= tplUtil.getBlockUrl(item2) %>"
        >
          <img src="<%= item2.img%>" alt="">
        </a>
      </div>
    <% }); %>
    </div>
  <%
    }else if(item.tpl === 3) {
  %>
    <div class="home-panel-area flex-row center">
      <% _.each(item.list, function (item3, index3){%>
        <% if(index3 > 2) {return;}%>
      <div class="home-panel-area-pic">
        <a
          data-log-mall-click="index-promotion_<%= item3.title %>-<%= item3.productid %>"
          data-productid="<%= item3.productid %>"
          data-group-id="<%= item3.groupId %>"
          data-title="<%= item3.title %>"
          data-info="index-promotion-<%= index3 %>"
          class="<%= tplUtil.getJsClass(item3) %> block"
          href="<%= tplUtil.getBlockUrl(item3) %>"
        >
          <img src="<%= item3.img%>" alt="">
        </a>
      </div>
      <% }); %>
    </div>
  <%
    }else if(item.tpl === 3) {
  %>
    <div class="home-panel-area flex-row bottom">
      <% _.each(item.list, function (item4, index4){%>
        <% if(index4 > 0) {return;}%>
      <div class="home-panel-area-pic">
        <a
          data-log-mall-click="index-promotion_<%= item4.title %>-<%= item4.productid %>"
          data-productid="<%= item4.productid %>"
          data-group-id="<%= item4.groupId %>"
          data-title="<%= item4.title %>"
          data-info="index-promotion-<%= index4 %>"
          class="<%= tplUtil.getJsClass(item4) %> block"
          href="<%= tplUtil.getBlockUrl(item4) %>"
        >
          <img src="<%= item4.img %>" alt="">
        </a>
      </div>
      <% }); %>
    </div>
  <%
    }
  %>
<% }); %>