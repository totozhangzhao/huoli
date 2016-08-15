<ul id="address-entry" class="confirm-order-bar">
  <li>
    <a>
      <div class="confirm-order-info">
        <span><%- addressInfo.name || "" %></span><span class="num-font"><%- addressInfo.pphone || "" %></span>
      </div>
      <div class="confirm-order-address num-font"><%- addressInfo.province.name + " " + addressInfo.city.name + " " + addressInfo.area.name + " " + addressInfo.address || "" %></div>
      <b class="confirm-order-icon"></b>
    </a>
  </li>
</ul>
<div class="confirm-goods-detail clearfix">
  <img src="<%= avatar || "" %>" class="goods-show-pic fl">
  <p class="goods-name"><%= title || "" %></p>
  <div class="goods-charge-info-fa">
    <p class="goods-charge-info num-font"><span><%= unitPriceText %></span></p>
    <div class="common-buy-num">
      <div class="common-buy-choice">
        <!-- 数量小于1时，添加 one class,大于1时去掉 -->
        <i class="" data-operator="subtract"><span></span></i><i><input class="address-num-input" type="text" value="<%= number %>" /></i><i data-operator="add"><span></span></i>
      </div>
    </div>
  </div>
</div>

<div class="goods-charge-bar">
  <p class="goods-charge-info num-font"><span class="js-total-price"><%= totalPriceText %></span></p>
  <button id="confirm-order" type="button" class="js-goods-pay charge-btn"><%= buttonText || "去支付" %></button>
</div>
