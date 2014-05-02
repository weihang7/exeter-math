(function() {
  window.addEventListener('load', function() {
    var email, email_control, password, password_control, submit;
    email = $('#email');
    password = $('#password');
    email_control = $('#email-control');
    password_control = $('#password-control');
    submit = $('#submit');
    return submit.click(function() {
      submit.prop('disabled', true);
      return $.ajax({
        url: '/login',
        method: 'POST',
        data: {
          email: email.val(),
          password: password.val()
        },
        dataType: 'json',
        success: function(data) {
          if (data.success) {
            return location.href = '/';
          } else if (data.problem.indexOf('Password') > -1) {
            submit.prop('disabled', false);
            email_control.removeClass('has-error');
            return password_control.addClass('has-error');
          } else {
            submit.prop('disabled', false);
            email_control.addClass('has-error');
            return password_control.addClass('has-error');
          }
        }
      });
    });
  });

}).call(this);

//# sourceMappingURL=login.js.map
