<%
var type = -1;
if(price > 0 && points > 0){
  type = 0;
}else if(price > 0) {
  type = 1;
}else if (points > 0){
  type = 2;
}
  if(type === 0){ 
%>
  <span><%= number * points %></span> <%= pointsUnit %> + <span><%= number * price %></span> <%= currency %>
<% } %>

<% if(type === 1){ %>
  <span><%= number * price %></span> <%= currency %>
<% } %>

<% if(type === 2){ %>
  <span><%= number * points %></span> <%= pointsUnit %>
<% } %>

<% if(type === -1){ %>
  <span><%= number * price %></span> <%= currency %>
<% } %>
