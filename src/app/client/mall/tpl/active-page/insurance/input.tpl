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
