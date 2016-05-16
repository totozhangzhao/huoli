<% 
  _.each(data.rules, function (rule, index){
    if(index === 0 ){
%>
      <img src="<%= rule.img %>" />
<%
    }
  });
%>