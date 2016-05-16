<div class="common-shadow" style="display: block;">
</div>
<!-- 优惠券展示弹窗 begin -->
<div class="goods-preferent-content">
  <div class="goods-coupons-tit">优惠券</div>
  <div class="goods-preferent-block">
    <div class="goods-preferent-show">
      <% couponList.forEach(function(item) { %>
      <a class="goods-preferent-detail">
        <h5><%= item.name %></h5>
        <% item.content = _.escape(item.content) %>
        <% var splitStr = item.content.indexOf("$$$$") === -1 ? "\n" : "$$$$" %>
        <% var cList = item.content.split(splitStr) %>
        <% _.each(cList, function(text, index) { %>
        <p><%= text %></p>
        <% }); %>        
        <button><%= item.amount %>元</button>
      </a>
      <% }); %>
    </div>
  </div>
  <a class="goods-coupons-close">关闭</a>
</div>
<!-- 优惠券展示弹窗 end -->
