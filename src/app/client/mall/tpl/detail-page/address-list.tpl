<div class="address-exist-fatherbar">
  <ul class="address-exist-bar">
    <% _.each(addressList, function(addressInfo, index) { %>
    <li class="js-item address-exist-area"
      data-addressid="<%= addressInfo.addressid || "" %>"
    >
      <div class="js-address-info">
        <div class="address-exist-info clearfix">
          <p class="address-exist-username fl">
            <b class="address-exist-nameicon"></b><span><%- addressInfo.name || "" %></span>
          </p>
          <p class="address-exist-usertel fl">
            <b class="address-exist-telicon"></b><span class="num-font"><%- addressInfo.pphone || "" %></span>
          </p>
        </div>
        <p class="address-exist-text num-font border-b"><%- addressInfo.province.name + " " + addressInfo.city.name + " " + addressInfo.area.name + " " + addressInfo.address || "" %></p>
      </div>
      <div class="address-control-bar">
        <p class="address-set-area">
          <label for="address-default-<%= index %>" class="address-radio-group">
            <input id="address-default-<%= index %>" name="default-address" type="radio" class="js-default-address address-set-inp" <%= index === 0 ? "checked" : "" %> >
            <b class="address-custom-common"></b>
            <span class="address-set-default">设为默认地址</span>
          </label>
        </p>
        <p class="js-edit-address address-edit-area"><b class="address-edit-icon"></b>编辑</p>
        <p class="js-remove-address address-delete-area"><b class="address-delete-icon"></b>删除</p>
      </div>
    </li>
    <% }) %>
  </ul>
  <div class="address-foot-box">
    <a class="js-add-address address-foot-btn allow-color">＋添加新地址</a>
    <!-- <a class="address-foot-btn forbidden-color">＋添加新地址</a> -->
  </div>
</div>

<!-- 删除提示框 -->
<div class="common-shadow">
  <div class="del-tip-box">
    <p class="del-info">确认删除收货地址？</p>
    <a class="del-common-button del-no-btn forbidden-color">取消</a>
    <a class="del-common-button del-yes-btn allow-color">确认</a>
  </div>
</div>
