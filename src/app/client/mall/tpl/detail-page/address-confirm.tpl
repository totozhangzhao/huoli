<div class="address-exist-fatherbar confirm-order"> 
  <ul id="address-entry" class="address-exist-bar">
    <li class="address-exist-area border">
      <div class="address-exist-info clearfix">
        <p class="address-exist-username fl">
          <b class="address-exist-nameicon"></b><span><%= addressInfo.name || "" %></span>
        </p>
        <p class="address-exist-usertel fl">
          <b class="address-exist-telicon"></b><span class="num-font"><%= addressInfo.pphone || "" %></span>
        </p>
      </div>
      <p class="address-exist-text num-font"><%= addressInfo.province.name + " " + addressInfo.city.name + " " + addressInfo.area.name + " " + addressInfo.address || "" %></p>
    </li>
  </ul>
  <div class="order-goods-bar pay-order-box clearfix">
    <img src="<%= productInfo.smallimg || "" %>" class="chit-pic fl" />
    <div class="order-text-bar fl">
      <p class="order-goods-text pic-detail"><%= productInfo.title || "" %></p>
      <p class="order-goods-text pic-detail-tip"><%= productInfo.shortdesc || "" %></p>
      <p class="order-goods-text actually-pay orange-color"><%= productInfo.showprice || "" %></p>
    </div>
  </div>
</div>
<div class="time-bar">
  <div class="time-area">
    <div class="scoring-bar fl"><%= productInfo.pprice || "" %></div>
    <a id="confirm-order" class="operate-btn allow-color fr"><%= productInfo.confirm || "确认" %></a>
  </div> 
</div>