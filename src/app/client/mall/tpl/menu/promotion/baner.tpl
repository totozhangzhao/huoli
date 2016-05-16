<% 
  _.each(data.bannerimg, function (banner, index){
    if(index === 0 ){
%>
      <img src="<%= banner.img %>" />
<%
    }
  });
%>