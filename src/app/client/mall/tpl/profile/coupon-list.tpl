<div class="my-coupons-bar">
  <% _.each(couponList, function(item, index) { %>
  <a class="js-item my-coupons-area" data-index="<%= index %>" <%= item.used === 0 ? '' : "disabled" %> >
    <div class="my-coupons-info">
      <p><%= item.name %></p>
      <p class="num-font"><%= item.shortdesc %></p>
      <p class="num-font">有效期至：<%= item.etime %></p>
    </div>
    <div class="my-coupons-price num-font">
      <span>￥</span><span><%= item.amount %></span>
    </div>
  </a>
  <% }) %>
</div>
