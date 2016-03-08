<% _.each(dataList, function (item, index) { %>
  <li>
    <a 
    data-log-click="<%= appName %>-top_<%= item.productid %>_<%= item.title %>@click@index"
    data-productid="<%= item.productid %>"
    data-title="<%= item.title %>"
    data-classify="<%= item.classify || '' %>"
    class="<%= tplUtil.getJsClass(item) %> block"
    href="<%= tplUtil.getBlockUrl(item) %>"
    >
      <div style="background-image: url(<%= item.img %>)"></div>
      <p><%= item.title %></p>
    </a>
  </li>
<% }); %>