<div class="common-shadow" style="display: none;">
  <div class="ui-confirm">
    <div class="ui-confirm-tip">
      <p><%= data.title %></p>
      <p><%= data.message %></p>
    </div>
    <% if(data.type === "confirm") { %>
    <b class="confirm-close"></b>
    <div class="confirm-btn-box">
      <a><%= data.cancelText %>
      <a><%= data.agreeText %>
    </div>
    <% } %>
    <% if(data.type === "alert") { %>
      <a class="confirm-sure-btn"><%= data.agreeText %></a>
    <% } %>
  </div>
</div>