<div class="common-shadow" style="display: block;"></div>
<!-- 特权说明弹窗 begin -->
<div class="goods-privilege-content">
  <div class="goods-coupons-tit">特权</div>
  <div class="goods-coupons-block">
    <div class="goods-coupons-desc">
      <div class="goods-coupons-text">
        <h5><%= item.name %></h5>
        <% item.content = _.escape(item.content) %>
        <% var cList = item.content.split("$$$$") %>
        <% _.each(cList, function(text, index) { %>
        <p><%= text %></p>
        <% }) %>
      </div>
    </div>
  </div>
  <a class="goods-coupons-close">关闭</a>
</div>
<!-- 特权说明弹窗 end -->
