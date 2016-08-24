<div class="coupons-use-bar">
  <div class="coupons-use-area">
    <div class="coupons-use-up">
      <div class="coupons-use-name">
        <p><%= item.name %></p>
        <p class="num-font">有效期至：<%= item.etime %></p>
      </div>
      <div class="coupons-use-price num-font">
        <span>￥</span><span><%= item.amount %></span>
      </div>
    </div>
    <div class="coupons-use-below">
      <% item.content = _.escape(item.content) %>
      <% var splitStr = item.content.indexOf("$$$$") === -1 ? "\n" : "$$$$" %>
      <% var cList = item.content.split(splitStr) %>
      <% _.each(cList, function(text, index) { %>
      <p><%= text %></p>
      <% }); %>
    </div>
  </div>
  <a
    data-productid="<%= item.productid %>"
    data-group-id="<%= item.groupId %>"
    data-title="<%= item.title %>"
    data-classify="<%= item.classify || '' %>"
    class="<%= tplUtil.getJsClass(item) %> js-replace-page coupons-use-btn"
    href="<%= tplUtil.getBlockUrl(item) %>"
  >立即使用</a>
</div>
