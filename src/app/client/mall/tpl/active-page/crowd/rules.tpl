<div class="snap-top snap-color">本期幸运号码：<%= data.wincode %></div>
<div class="snap-bottom">
  <div class="snap-bottom-son">
    <p class="snap-head">计算公式</p>
    <p class="snap-color">(数值A/数值B)取余数+10000001</p>
  </div>
  <div class="snap-bottom-son">
    <h5 class="snap-head">数值A</h5>
    <p>=截止该奖品最后购买时间点前，本期最后<%= data.anumber %>条支付完成的订单时间</p>
    <p>=<span class="snap-color"><%= data.avalue %></span></p>
    <table class="snap-table" width="100%" >
      <thead>
        <tr>
          <td>秒杀时间</td>
          <td>参与账号</td>
        </tr>
      </thead>
      <tbody>
        <% _.each(data.timelist, function(item) { %>
        <tr>
          <td><%= item.time %> <span class="snap-color">→ <%= item.tvalue %></span></td>
          <td><%= item.account %></td>
        </tr>
        <% }); %>
      </tbody>
    </table>
  </div>
  <div class="snap-bottom-son">
    <h5 class="snap-head">数值B</h5>
    <p>=奖品所需人次</p>
    <p>=<span class="snap-color"><%= data.bvalue %></span></p>
  </div>
</div>
