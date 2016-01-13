<div class="pay-pic-bar">
  <img src="<%= productInfo.img %>" alt="">
</div>
<div class="insert-bar combination-insert-bar">
  <div class="js-inputs-container combination-insert-group">
    <% _.each(userArray, function(item, index) { %>
    <div class="js-user-item combination-insert-area">
      <div class="insert-bar-son">
        <div class="common-insert-area">
          <span class="insert-icon realname-icon"></span>
          <input name="name" value="<%= item.name || '' %>" type="text" placeholder="请输入联系人姓名" class="common-insert">
        </div>
      </div>
      <div class="insert-bar-son border">
        <div class="common-insert-area">
          <span class="insert-icon phone-icon"></span>
          <input name="phone" value="<%= item.phone || '' %>" type="text" placeholder="请输入手机号" class="common-insert">
        </div>
      </div>
      <div class="insert-bar-son">
        <div class="common-insert-area">
          <span class="insert-icon idcard-icon"></span>
          <input name="cardno" value="<%= item.cardno || '' %>" type="text" placeholder="请输入身份证号" class="common-insert">
        </div>
      </div>
      <div class="js-user-item-delete js-touch-state insert-delete-bar border-l">
        <span class="no-select dele-icon"></span>
      </div>
    </div>
    <% }); %>
  </div>
  <div class="to-add-bar">
    <button class="js-add js-touch-state to-add"><span class="to-add-icon">+&nbsp;&nbsp;</span>添加承保人</button>
  </div>
  <div class="to-check-bar">
    <label for="checkAgreement">
      <input type="checkbox" id="checkAgreement" name="checkAgreement" value="1" checked><i>我同意提交以上信息</i>
    </label>
  </div>
  <div class="to-receive-bar">
    <button class="js-submit js-touch-state to-receive">马&nbsp;上&nbsp;领&nbsp;取</button>
  </div>
  <div class="to-bottom-text-bar">
    <p>
      关于您的个人信息仅会用于此次活动<br>
      不会透露给与此次活动无关的第三方
    </p>
  </div>
</div>

<div class="insurance-box"><%= productInfo.desc %></div>