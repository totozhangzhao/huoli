<% _.each(list, function(item) { %>
  <option value="<%= item.id %>" <%= item.selected ? "selected" : "" %> ><%= item.name %></option>
<% }) %>
