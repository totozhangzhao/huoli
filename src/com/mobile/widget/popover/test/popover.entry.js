var Popover = require("com/mobile/widget/popover/popover.js");

/* 
  更新model 只支持修改文案和方法
  暂不支持修改弹窗的类型
*/
var popover = new Popover({
  el: "#popover-box",
  options: {
    type: "confirm", // 暂时有 confirm, alert 两种类型 
    title: "标题",
    message: "消息",
    btnText: "确定",  
    cancleText: "取消", // alert类型 此参数无效
    clickBtn: function (){ window.alert("clickBtn")},
    clickCancel: function () { window.alert("clickCancel")} // alert类型 此方法无效
  }
});
popover.show();

popover.model.set({title: "更新标题"});

/*
gitlab: Thank you for installing GitLab!
gitlab: To configure and start GitLab, RUN THE FOLLOWING COMMAND:

sudo gitlab-ctl reconfigure

gitlab: GitLab should be reachable at http://iZ25ymkhyehZ
gitlab: Otherwise configure GitLab for your system by editing /etc/gitlab/gitlab.rb file
gitlab: And running reconfigure again.
gitlab: 
gitlab: For a comprehensive list of configuration options please see the Omnibus GitLab readme
gitlab: https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/README.md
gitlab: 
It looks like GitLab has not been configured yet; skipping the upgrade script.
  Verifying  : gitlab-ce-8.4.4-ce.0.el6.x86_64                              1/1 

已安装:
  gitlab-ce.x86_64 0:8.4.4-ce.0.el6                                             

完毕！

*/