<%
var type = -1;
if(price > 0 && points > 0){
  type = 0;
}else if(price > 0) {
  type = 1;
}else if (points > 0){
  type = 2;
}

var tPoints = number * points;
var tPrice  = number * price;
  if(type === 0){ 
%>
  <span><%= tPoints %></span> <%= pointsUnit %> + <span><%= Number( tPrice ).toFixed(2) %></span> <%= currency %>
<% } %>

<% if(type === 1){ %>
  <span><%= Number( tPrice ).toFixed(2) %></span> <%= currency %>
<% } %>

<% if(type === 2){ %>
  <span><%= tPoints %></span> <%= pointsUnit %>
<% } %>

<% if(type === -1){ %>
  <span><%= Number( tPrice ).toFixed(2) %></span> <%= currency %>
<% } %>
