<div class="common-shadow no-select" style="display:block;">
<div class="home-active-block">
  <a 
    data-productid="<%= data.action.productid %>"
    data-group-id="<%= data.action.groupId %>"
    data-title="<%= data.action.title %>"
    class="<%= tplUtil.getJsClass(data.action) %>"
    href="<%= tplUtil.getBlockUrl(data.action) %>"
  >
    <img src="<%= data.img %>" alt="">
  </a>
  <span class="home-active-close"></span>
</div>