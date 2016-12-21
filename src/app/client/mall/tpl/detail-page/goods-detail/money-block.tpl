<%
  var data = model.toJSON();
  data.originalPriceText = model.getOriginalPriceText();
  data.unitPriceText = model.getPPriceText(1);
%>
<% if (data.payType === 3) { %>
<div class="money-points-contain">
  <% if (data.originalPriceText) { %>
  <p class="js-original-price relevance-price"><%= data.originalPriceText %></p>
  <% } %>
  <p class="js-unit-price goods-price"><%= data.unitPriceText %></p>
</div>
<% } else if (data.payType !== 0) { %>
<div class="money-contain">
  <% if (data.originalPriceText) { %>
  <p><span class="js-unit-price goods-price"><%= data.unitPriceText %></span><span class="js-original-price relevance-price"><%= data.originalPriceText %></span></p>
  <% } else { %>
  <p><span class="js-unit-price goods-price"><%= data.unitPriceText %></span></p>
  <% } %>
</div>
<% } %>