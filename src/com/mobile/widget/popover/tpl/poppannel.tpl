<div class="common-shadow" style="display: none;">
  <div class="ui-confirm">
    <div class="ui-confirm-tip">
      <p><%= data.title %></p>
      <p><%= data.message %></p>
    </div>
    <% if(data.type === "confirm") { %>
    <b class="confirm-close"></b>
    <div class="confirm-btn-box">
      <a><%= data.btnText %></a><a><%= data.cancleText %></a>
    </div>
    <% } %>
    <% if(data.type === "alert") { %>
      <a class="confirm-sure-btn"><%= data.btnText %></a>
    <% } %>
  </div>
</div>