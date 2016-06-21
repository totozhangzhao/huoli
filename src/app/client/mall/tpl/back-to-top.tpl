<% var showToHome = !isApp && !isHome; %>
<div class="js-webview home-fixed-box" style="<%= showToHome ? 'bottom: 2rem;' : '' %>">
<% if(showToHome){ %>
  <a class="to-home" href="/fe/app/client/mall/index.html"></a>
<% } %>
<% if(isHome) {%>
  <a class="to-top js-top"></a>
  <a class="to-contact" href="https://dl.rsscc.cn/guanggao/active/contact-us.html"></a>
<% } %>
</div>
