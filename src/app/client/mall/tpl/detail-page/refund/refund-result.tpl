<!-- 退款成功状态 -->
<% if(data.status === 4) {%>
<div class="refund-status-bar">
  <div class="refund-status-succ"></div>
  <p class="refund-status-mark refund-status-yes">退款成功</p>
</div> 
<div class="refund-status-content">
  <p class="refund-status-item"><span>退款原因：</span><span><%= data.reason %></span></p>
  <p class="refund-status-item"><span>退款去向：</span><span><%= data.note %></span></p>
  <p class="refund-status-item"><span>操作时间：</span><span><%= data.refounddate %></span></p>
</div>
<div class="refund-status-desc">
  <h5 class="refund-status-tit">退款说明</h5>
  <p class="refund-status-text"><%= data.content %></p>
</div>
<% }else if(data.status === 6 || data.status === 12) { %>
<!-- 退款失败状态 -->
<%
  var failMsg = "退款失败";
  if(data.status === 12) {
    failMsg = "退款审核失败";
  }
%>
<div class="refund-status-bar">
  <div class="refund-status-fail"></div>
  <p class="refund-status-mark refund-status-no"><%= failMsg %></p>
</div>
<div class="refund-status-content">
  <p class="refund-status-item"><span>退款原因：</span><span><%= data.reason %></span></p>
  <p class="refund-status-item"><span>失败原因：</span><span class="text-red"><%= data.note %></span></p>
  <p class="refund-status-item"><span>操作时间：</span><span><%= data.refounddate %></span></p>
</div>
<div class="refund-status-desc">
  <h5 class="refund-status-tit">退款说明</h5>
  <p class="refund-status-text"><%= data.content %></p>
</div>
<% }else { %>
<% 
  var statusMsg = "退款审核中";
  if(data.status === 11) {
  }else if(data.status === 13) {
    statusMsg = "(审核通过）待退款";
  }else if(data.status === 5) {
    statusMsg = "退款中";
  }
%>
  <!-- 审核中 -->
  <div class="refund-status-bar">
    <div class="refund-status-audit"></div>
    <p class="refund-status-mark refund-status-ing"><%= statusMsg %></p>
  </div> 
  <div class="refund-status-content">
    <p class="refund-status-item"><span>退款原因：</span><span><%= data.reason %></span></p>
    <p class="refund-status-item"><span>操作说明</span><span><%= data.note || '申请已提交，我们会尽快审核' %></span></p>
    <p class="refund-status-item"><span>操作时间：</span><span><%= data.refounddate %></span></p>
  </div>
  <div class="refund-status-desc">
    <h5 class="refund-status-tit">退款说明</h5>
    <p class="refund-status-text"><%= data.content %></p>
  </div>
<% } %>