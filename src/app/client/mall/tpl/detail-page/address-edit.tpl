<%=
  require("app/client/mall/tpl/common/address/edit.tpl")({
    addressInfo: addressInfo,
    addressMessage: addressMessage
  })
%>
<div class="address-foot-box">
  <a id="save-address" class="address-foot-btn"><%= addressInfo.addressid ? "保存修改" : "保存" %></a>
</div>
