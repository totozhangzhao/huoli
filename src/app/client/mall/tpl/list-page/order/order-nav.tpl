<% 
  var type = "crowd";
  if(params.orderType === 1) {
    type = "mall";
  }
%>
<ul>
  <li data-filter="all" class="<%= params.type === 0 ? 'on': ''%>">
    <span>全部</span><i></i>
  </li>
  <li data-filter="pending" class="<%= params.type === 1 ? 'on': ''%>">
    <span>待付款</span><i></i>
  </li>
  <li data-filter="express" class="<%= params.type === 2 ? 'on': ''%>">
    <span>待收货</span><i></i>
  </li>
  <li data-filter="success" class="<%= params.type === 3 ? 'on': ''%>">
    <span>已完成</span>
  </li>
</ul>