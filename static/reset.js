(function() {
  window.addEventListener('load', function() {
    var confirm, confirm_control, password, submit, token;
    confirm_control = $('#confirm-control');
    password = $('#password');
    confirm = $('#confirm_password');
    token = $('#token');
    submit = $('#submit');
    return submit.click(function() {
      if (confirm.val() === password.val()) {
        return $.ajax({
          url: '/reset',
          method: 'POST',
          data: {
            password: password.val(),
            token: token.val()
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
  });

}).call(this);

//# sourceMappingURL=reset.js.map
