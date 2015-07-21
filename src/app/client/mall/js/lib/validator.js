module.exports = {
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
