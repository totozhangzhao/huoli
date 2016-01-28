<div class="address-username-bar border-b">
  <label>收货人：</label>
  <input name="name" type="text" placeholder="请输入中文姓名" class="address-username-insert" 
    value="<%- addressInfo.name || "" %>"
  >
</div>
<div class="address-usertel-bar border-b">
  <label>联系电话：</label>
  <input name="pphone" type="text" placeholder="请输入收货人手机号码" class="address-usertel-insert"
    data-check-method="checkPhoneNum"
    data-error-message="请输入正确的手机号"
    value="<%- addressInfo.pphone || "" %>"
  >
</div>
<div id="select-widget" class="address-option-bar border-b">
  <div class="address-option-area border-b">
    <label for="province" class="address-se-la">
      <select id="province" name="province" data-default-text="请选择：省" class="js-select address-option-se">
        <!-- // -->
      </select>
    </label>
  </div>
  <div class="address-option-area border-b">
    <label class="address-se-la border-l">
      <select name="city" data-for="province" data-default-text="请选择：市" class="js-select address-option-se">
        <!-- // -->
      </select>
    </label>
  </div>
  <div class="address-option-area">
    <label class="address-se-la border-l">
      <select name="area" data-for="city" data-default-text="请选择：区/县" class="js-select address-option-se">
        <!-- // -->
      </select>
    </label>
  </div>
</div>
<div class="address-detail-bar border-b">
  <label>详细地址：</label>
  <textarea name="address" class="address-detail-insert"><%- addressInfo.address || "" %></textarea>
</div>
<div class="address-foot-box">
  <a id="save-address" class="address-foot-btn allow-color"><%= addressInfo.addressid ? "设为默认收货地址" : "保存" %></a>
</div>
