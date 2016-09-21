<div class="giving-order-detail">
  <div class="giving-order-banner">
    <img src="http://cdn.rsscc.cn/guanggao/img/test/test-11.jpg" alt="">
  </div>
  <!-- 地址，物流信息 -->
  <% if( data.msgtpl === 3) { %>
  <div class="giving-order-info">
    <% if(data.express) { %>
    <a class="courier-info js-express">
      <div class="courier-info-son flex-row">
        <div class="icon"><b></b></div>
        <div class="detail">
          <p><span>物流公司:</span><span><%= data.express.company %></span></p>
          <p><span>物流单号:</span><span><%= data.express.tracking %></span></p>
        </div>
      </div>
      <div class="enter-icon"></div>
    </a>
    <% } %>
    <div class="user-info flex-row">
      <div class="icon-fa"><b class="icon"></b></div>
      <div class="detail">
        <p class="clearfix"><span class="fl">收货人:</span><span class="fl"><%= data.address.name %></span><span class="fr"><%= data.address.pphone %></span></p>
        <p><span>收货地址:</span><span><%= data.address.province %> <%= data.address.city %> <%= data.address.area %> <%= data.address.address %></span></p>
      </div>
    </div>
  </div>
  <% } %>
  <!-- 兑换码 有效期信息 -->
  <% if( data.msgtpl === 1 ) {%>
  <div class="giving-cdkey">
    <div class="js-copy giving-cdkey-son show-select-all">
      <%= data.msg %>
      <p class="cdkey-time">有效期至<%= data.expdate %></p>
    </div>
    <!-- <button class="giving-copy">复制</button> -->
  </div>
  <% } %>
  <!-- 商品信息 -->
  <div class="giving-goods-show flex-row">
    <div class="goods-pic">
      <img src="<%= data.img %>" alt="">
      <div class="mask"></div>
    </div>
    <div class="goods-desc">
      <p class="goods-desc-son"><%= data.title %></p>
      <p class="goods-desc-son clearfix">
        <% if(data.spec) {%>
        <span><%= data.spec %></span>
        <% } %>
        <span>数量 x <%= data.num %></span>
      </p>
    </div>
  </div>
  <!-- 微信提示 -->
  <div class="use-method-block">
    <div class="use-method">
      <h5 class="use-method-tit">温馨提示</h5>
      <div class="use-method-text">
        <p class="common-text">为了方便您随时查看订单，记得点击右上角按钮并收藏该页面哦！</p>
      </div>
    </div>
  </div>
  <!-- 使用说明 -->
  <div class="use-method-block">
    <div class="use-method">
      <h5 class="use-method-tit">使用说明</h5>
      <div class="use-method-text">
        <%= data.note %>
      </div>
    </div>
  </div>
</div>