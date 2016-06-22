<div class="my-coupons-bar">
  <% _.each(couponList, function(item, index) { %>
  <a class="js-item my-coupons-area" data-index="<%= index %>" <%= item.used === 0 ? '' : "disabled" %> >
    <div class="my-coupons-info">
      <p><%= item.name %></p>
      <p class="num-font"><%= item.shortdesc %></p>
      <p class="num-font">有效期至：<%= item.etime %></p>
    </div>
    <div class="my-coupons-price num-font">
      <% if (item.type === 3) { %>
      <%
         if (item.amount < 1) {
          item.amount = item.amount * 10;
         }
         var discountArray = (item.amount).toFixed(1).split(".");
         if (discountArray[1] === "0") {
           discountArray[1] = "";
         } else {
           discountArray[1] = "." + discountArray[1];
         }
      %>
      <span class="my-coupons-num"><%= discountArray[0] %></span><span class="my-coupons-smallnum"><%= discountArray[1] %></span><span class="my-coupons-unit">折</span>
      <% } else { %>
      <span class="my-coupons-unit">￥</span><span class="my-coupons-num"><%= item.amount %></span>
      <% } %>
    </div>
  </a>
  <% }) %>
</div>
