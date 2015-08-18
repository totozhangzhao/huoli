<% _.each(list, function(item, index) { %>
<div class="form-block insert-bar-son">
  <div class="common-insert-area">
    <span class="insert-icon <%= inputClass[item.type] || '' %>"></span>
    <input type="text" placeholder="<%= item.desc || '' %>" name="<%= item.code || '' %>" class="js-form-input common-insert" />
  </div>
  <p class="js-error-tip error-tip insert-tit common-text text-red">请输入正确的<%= item.name || '' %></p>
</div>
<% }) %>
<div class="to-receive-bar">
  <button class="js-submit to-receive">确 定</button>
</div>
