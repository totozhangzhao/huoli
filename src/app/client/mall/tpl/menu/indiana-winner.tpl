<div>轮播</div>
<a 
  data-log-click="<%= appName %>-block_<%= item.productid %>_<%= item.title %>@click@index"
  data-productid="<%= item.productid %>"
  data-title="<%= item.title %>"
  data-classify="<%= item.classify || '' %>"
  class="<%= tplUtil.getJsClass(item) %> block"
  href="<%= tplUtil.getBlockUrl(item) %>"
  >往期》</a>