(function() {
  var confirm, confirm_control, password, submit, token;

  confirm_control = $('#confirm-control');

  password = $('#password');

  confirm = $('#confirm_password');

  token = $('#token');

  submit = $('#submit');

  submit.click(function() {
    var id, info, shaObj;
    if (confirm.val() === password.val()) {
      shaObj = new jsSHA(password.val(), 'TEXT');
      info = location.pathname.substr(7).split('-');
      token = info[1];
      id = parseInt(info[0]);
      return $.ajax({
        url: '/reset',
        method: 'POST',
        data: {
          password: shaObj.getHash('SHA-512', 'HEX'),
          token: token,
          id: id
        },
        dataType: 'json',
        success: function(data) {
          if (data.success) {
            return location.href = '/login.html';
          }
        }
      });
    } else {
      return confirm_control.addClass('has-error');
    }
  });

}).call(this);
