<% if(data.bonus === 0) { %>
  <% if(mallUtil.isAppFunc()) { %>

  <% } else { %>
    <section class="login-feedback">
      <img src="http://cdn.rsscc.cn/guanggao/img/mall/active/leiling/get-code-1.png" alt="">
      <div class="login-fail-bar">
        <div class="feedback-info">
          <p>未查询到亲管家账户中有符合活动要求的购票信息</p>
        </div>
        <div class="code-img">
          <img src="http://cdn.rsscc.cn/guanggao/img/mall/active/leiling/get-code-2.png" alt="">
          <p>长按识别图中二维码</p>
        </div>
        <div class="sweet-tip">
          <p>“航班管家、高铁管家”</p>
          <p>千万用户的春节回家选择</p>
        </div>
      </div>
    </section>
  <% } %>
<% } else { %>
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
        <p class="second">雷凌双擎伙力接送免单资格</p>
      </div>
      <% } else if(data.bonus === 103) { %>
      <div class="prize-area-son">
        <p class="first">恭喜您获得</p>
        <p class="second">雷凌双擎伙力接送折扣套券</p>
      </div>
      <% } else if(data.bonus === 104) { %>
      <div class="prize-area-son">
        <p class="done">您已经参与过了活动了</p>
        <p class="second">与我们一起迈出回家的第一步吧</p>
      </div>
      <% } %>
      <% if(data.bonus !== 104) {%>
      <button type="button" class="prize-desc-btn js-explain" data-class-name="shade-<%= data.bonus %>"><span>奖品说明</span></button>
      <% } %>
      <!-- 奖品说明弹窗 -->
      <div class="shade shade-101 shade-102" style="display: none;">
        <div class="prize-desc-contain">
          <div class="close"></div>
          <h5>奖品说明</h5>
          <div class="rule-info">
            <p>（1）“伙力接送免单”资格，仅限用于行程出发位置为北京市或广州市的伙力接送服务使用</p>
            <p>（2）每个“伙力接送免单”资格仅限使用一次</p>
            <p>（3）具体免单行程安排，伙力接送工作人员将于三个工作日内与您联系</p>
            <p>（4）活动最终解释权归深圳市活力天汇科技股份有限公司所有</p>
          </div>
        </div>
      </div>
      <div class="shade shade-103" style="display: none;">
        <div class="prize-desc-contain">
          <div class="close"></div>
          <h5>奖品说明</h5>
          <div class="rule-info">
            <p>（1）雷凌双擎专属伙力接送服务折扣券，具体权益请至“伙力接送”专区“我的优惠券”内进行查看</p>
            <p>（2）折扣券具体使用方式及权益，需要依照伙力接送服务相关规定进行</p>
            <p>（3）折扣券使用期限为2016年12月15日-2017年2月15日</p>
            <p>（4）每张伙力接送服务折扣券，仅限在开通伙力接送服务的城市使用一次</p>
            <p>（5）活动最终解释权归深圳市活力天汇科技股份有限公司所有</p>
          </div>
        </div>
      </div>
    </div>
    <button type="button" class="share-btn js-share">分享给好友</button>
  </div>
</section>
<% } %>