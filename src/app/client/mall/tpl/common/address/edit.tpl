<div class="address-content-box">
  <div class="address-username-bar">
    <label>
      <input name="name" type="text" placeholder="收货人" class="address-username-insert"
        data-check-method="checkStr"
        data-error-message="<%= addressMessage.name %>"
        value="<%- addressInfo.name || '' %>"
      >
    </label>
  </div>
  <div class="address-usertel-bar">
    <label>
      <input name="pphone" type="text" placeholder="联系电话" class="address-usertel-insert"
        data-check-method="checkPhoneNum"
        data-error-message="<%= addressMessage.phone %>"
        value="<%- addressInfo.pphone || '' %>"
      >
    </label>
  </div>
  <div id="select-widget" class="address-option-bar">
    <div class="address-option-area">
      <label for="sw-province" class="address-se-la">
        <select id="sw-province" name="province" data-default-text="请选择：省" class="js-select address-option-se"
          data-check-method="checkStr"
          data-error-message="<%= addressMessage.province %>"
        >
          <!-- // -->
        </select>
      </label>
    </div>
    <div class="address-option-area">
      <label for="sw-city" class="address-se-la">
        <select id="sw-city" name="city" data-for="province" data-default-text="市" class="js-select address-option-se"
          data-check-method="checkStr"
          data-error-message="<%= addressMessage.city %>"
        >
          <!-- // -->
        </select>
      </label>
    </div>
    <div class="address-option-area">
      <label for="sw-warea" class="address-se-la">
        <select id="sw-area" name="area" data-for="city" data-default-text="区/县" class="js-select address-option-se"
          data-check-method="checkStr"
          data-error-message="<%= addressMessage.area %>"
        >
          <!-- // -->
        </select>
      </label>
    </div>
  </div>
  <div class="address-detail-bar">
    <label>
      <textarea name="address" class="address-detail-insert" placeholder="详细地址"
        data-check-method="checkStr"
        data-error-message="<%= addressMessage.area %>"
      ><%- addressInfo.address || "" %></textarea>
    </label>
  </div>
</div>