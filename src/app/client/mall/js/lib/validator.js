module.exports = {
  checkEmail: function(email) {
    return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(email);
  },
  checkPhoneNum: function(phoneNum) {
    return /^1[34578]\d{9}$/.test(phoneNum);
  },
  checkPassword: function(passwd) {
    return /^.{6,20}$/.test(passwd);
  },
  checkCaptche: function(captche) {
    return /^.{1,}$/.test(captche);
  }
};
