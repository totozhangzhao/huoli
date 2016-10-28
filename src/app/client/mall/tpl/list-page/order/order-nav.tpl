<% 
  var type = "crowd";
  if(params.orderType === 1) {
    type = "mall";
  }
%>
<ul>
  <li data-filter="all">
    <span>全部</span><i></i>
  </li>
  <li data-filter="pending">
    <span>待付款</span><i></i>
  </li>
  <li data-filter="express">
    <span>待收货</span><i></i>
  </li>
  <li data-filter="success">
    <span>已完成</span>
  </li>
</ul>