<div class="tip-box">
  <img src="http://cdn.rsscc.cn/guanggao/img/scratch/gt-10000231-tipbg.png" class="tip-box-bg">
  <!-- 弹窗显示获奖商品图片 开始 -->
  <img src="<%= alertImage %>" class="tip-gift-pic">  
  <!-- 弹窗显示获奖商品图片 结束 -->

  <!-- 弹窗显示获奖商品文字 开始 -->
  <div class="gift-box">
    <p class="prize-desc"><%= hint %></p>
  </div>
  <!-- 弹窗显示获奖商品文字 结束 -->
  <a class="js-go go-award"><%= buttonText || "确定" %></a>
  <a class="js-again go-back">再玩一次</a>
  <b class="js-close close-btn"></b>
</div>
