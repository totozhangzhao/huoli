<h2 class="step-title common-padding">输入页面参数</h2>
<% _.each(list, function(param, index) { %>
<label for="args-<%= param %>-<%= index %>" class="args-label common-margin"><%= param %></label>
<input type="text" id="args-<%= param %>-<%= index %>" name="<%= param %>" class="mall-input common-margin" placeholder="<%= param %>">
<% }); %>
<label for="args-hlfrom" class="args-label common-margin">hlfrom</label>
<input type="text" id="args-hlfrom" name="hlfrom" class="mall-input common-margin" placeholder="hlfrom（可不填）">