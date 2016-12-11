<section class="login-feedback">
  <img src="http://cdn.rsscc.cn/guanggao/img/mall/active/leiling/get-code-1.png" alt="">
  <div class="login-fail-bar">
    <div class="feedback-info">
      <img src="http://cdn.rsscc.cn/guanggao/img/mall/active/leiling/active-9-3.png" alt="">
    </div>
    <div class="prize-area">
      <% if(data.bonus === 101 || data.bonus === 102) { %>
      <div class="prize-area-son">
        <p class="first">恭喜您获得</p>
        <p class="second">雷凌双擎专车免单资格</p>
      </div>
      <% } else if(data.bonus === 104) { %>
      <div class="prize-area-son">
        <p class="done">您已经参与过了活动了</p>
        <p class="second">与我们一起迈出回家的第一步吧</p>
      </div>
      <% } %>
      <button type="button" class="prize-desc-btn js-explain"><span>奖品说明</span></button>
      <!-- 奖品说明弹窗 -->
      <div class="shade" style="display: none;">
        <div class="prize-desc-contain">
          <div class="close"></div>
          <h5>奖品说明</h5>
          <div class="rule-info">
            <p>1、；</p>
            <p>2、；</p>
            <p>3、；</p>
            <p>4、；</p>
            <p>5、；</p>
            <p>6、。</p>
          </div>
        </div>
      </div>
    </div>
    <button type="button" class="share-btn js-share">分享给好友</button>
  </div>
</section>