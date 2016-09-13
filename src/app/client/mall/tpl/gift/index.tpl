<div class="giving-goods-show">
  <img src="<%= data.detail.img %>" alt="" class="giving-goods-pic">
  <p class="giving-goods-name"><%= data.detail.title %></p>
</div>
<% if(data.status === 1) { %>
<!-- 未领取 -->
<div class="giving-msg">
  <p class="giving-msg-son coffe-color">
    <span class="quote-fa">
      <span class="quote"><%= data.detail.remark %>\(^o^)/~</span>
    </span>
  </p>
</div>
<a class="giving-btn red-color" data-target-view="receive">开心领取</a>
<% } else if(data.status === 2) { %>
<!-- 已领取 -->
<div class="giving-msg">
  <p class="giving-msg-son coffe-color">
    <span class="quote-fa">
      <span class="quote">您已成功领取好友的礼物，更多礼物信息，请查看礼物详情！</span>
    </span>
  </p>
</div>
<a class="giving-btn cafe-color" data-target-view="info">礼物详情</a>
<% } else if (data.status === 3) { %>
<!-- 已被领取 -->
<div class="giving-msg">
  <p class="giving-msg-son grey-color">
    <span class="quote-fa">
      <span class="quote">下手慢了，礼物已经被领走了！</span>
    </span>
  </p>
</div>
<a class="giving-btn cafe-color" data-to-view="home">我也要送</a>
<% } else if (data.status === 4) { %>  
<!-- 已失效 -->
<div class="giving-msg">
  <p class="giving-msg-son grey-color">
    <span class="quote-fa">
      <span class="quote">等到花儿都谢了，太久没人认领，礼物已被退回！</span>
    </span>
  </p>
</div>
<a class="giving-btn cafe-color" data-to-view="home">我也要送</a>
<% } %>
<div class="giving-footer"></div>