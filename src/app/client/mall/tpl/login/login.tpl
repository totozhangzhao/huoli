<div class="wechat-login-bar">
  <div class="wechat-login-icon">
    <div></div>
  </div>
  <div class="wechat-login-area">
    <label for="">
      <span class="label-son-flex">手机号</span>
      <div class="label-son-flex wechat-login-insert">
        <input name="phone" type="text" placeholder="请输入手机号" class="js-input js-phone-num" data-check-method="checkPhoneNum">
      </div>
      <button class="js-captcha-button label-son-flex wechat-login-getcode" data-timeout="90" disabled>获取验证码</button>
    </label>
    <label for="">
      <span class="label-son-flex">验证码</span>
      <div class="label-son-flex wechat-login-insert">
        <input name="code" type="text" placeholder="请输入验证码" class="js-input js-captcha" data-check-method="checkCaptche">
      </div>
    </label>
  </div>
  <div class="wechat-login-button">
    <button type="button" class="js-login">登录</button>
  </div>
</div>
