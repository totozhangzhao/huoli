<% _.each(dataList, function(item) { %>
<%
  var classHash = {
    0: "crowd-go-on",
    1: "crowd-end",
    2: "crowd-win"
  };
  var typeKey = item.sort + "-" + ( item.winner );
  var typeHash = {
    "5-0": "live",
    "5-1": "live",
    "4-0": "end",
    "4-1": "win"
  };
  var type = typeHash[typeKey];
%>

<% if(type === "live") {%>
<!-- 继续参与 -->
<li class="crowd-join-area crowd-go-on">
  <a
    data-log-mall-click="block_<%= item.title %>"
    data-productid="<%= item.productid %>"
    data-title="<%= item.title %>"
    class="<%= tplUtil.getJsClass(item) %> clearfix"
    href="<%= tplUtil.getBlockUrl(item) %>">
    <div class="crowd-join-pic">
      <img class="cp0 touch-img" data-echo="<%= item.img%>" src="/fe/com/mobile/image/grey.gif" />
    </div>
    <div class="crowd-join-desc">
      <p class="crowd-history-title"><%= item.title %></p>
      <p>我已参与:<span class="crowd-join-time"><%= item.winnerbuynum %></span>人次</p>
      <div class="crowd-goods-process-fa">
        <p class="crowd-goods-process">开奖进度:<span><%= item.progress %>%</span></p>
        <div class="snap-status-show">
          <div style="width:<%= item.progress > 4 ? item.progress : 4 %>%"></div>
        </div>
        <button>继续参与</button>
      </div>
    </div>
  </a>
</li>
<% 
   } 
   if(type === "end"){
%>
<!-- 未中奖 -->
<li class="crowd-join-area crowd-end">
  <a
    data-log-mall-click="block_<%= item.title %>"
    data-productid="<%= item.productid %>"
    data-title="<%= item.title %>"
    class="<%= tplUtil.getJsClass(item) %> clearfix"
    href="<%= tplUtil.getBlockUrl(item) %>">
    <div class="crowd-history-pic">
      <img class="cp0 touch-img" data-echo="<%= item.img%>" src="/fe/com/mobile/image/grey.gif" />
    </div>
    <div class="crowd-join-desc">
      <p class="crowd-history-title"><%= item.title %></p>
      <p>我已参与:<span class="crowd-join-time"><%= item.buynum %></span>人次</p>
      <p>幸运号码:<span class="crowd-join-num"><%= item.wincode %></span></p>
      <p>揭晓时间:<span><%= item.time %></span></p>
    </div>
  </a>
  <div class="crowd-winner-info">
    <div>
      获奖者:<span class="crowd-join-tel"><%= item.phone %></span><span class="crowd-join-time"><%= item.winnerbuynum %></span>人次
    </div>
  </div>
</li>
<%
   }
   if(type === "win"){
%>
<!-- 中奖 -->
<li class="crowd-join-area crowd-win">
  <a
    data-log-mall-click="block_<%= item.title %>"
    data-productid="<%= item.productid %>"
    data-title="<%= item.title %>"
    class="<%= tplUtil.getJsClass(item) %> clearfix"
    href="<%= tplUtil.getBlockUrl(item) %>">
    <div class="crowd-history-pic">
      <img class="cp0 touch-img" data-echo="<%= item.img%>" src="/fe/com/mobile/image/grey.gif" />
    </div>
    <div class="crowd-join-desc">
      <p class="crowd-history-title"><%= item.title %></p>
      <p>本期参与:<span class="crowd-join-time"><%= item.winnerbuynum %></span>人次</p>
      <p>幸运号码:<span class="crowd-join-num"><%= item.wincode %></span></p>
      <p>揭晓时间:<span><%= item.time %></span></p>
    </div>
  </a>
  <div class="crowd-winner-info">
    <div>
      获奖者:<span class="crowd-join-tel"><%= item.phone %></span><span class="crowd-join-time"><%= item.winnerbuynum %></span>人次
    </div>
  </div>
  <div class="crowd-win-show"></div>
</li>
<%
  }
}); 
%>