(function() {
  window.addEventListener('load', function() {
    var email, email_control, institution, password, password_control, submit;
    email = $('#email');
    password = $('#password');
    institution = $('#institution');
    submit = $('#submit');
    email_control = $('#email-control');
    password_control = $('#password-control');
    return submit.click(function() {
      if (email.val() === "") {
        email_control.addClass('has-error');
      }
      if (password.val() === "") {
        return password_control.addClass('has-error');
      } else {
        submit.prop('disabled', true);
        return $.ajax({
          url: '/register',
          method: 'POST',
          data: {
            email: email.val(),
            password: password.val(),
            institution: institution.val()
          },
          dataType: 'json',
          success: function(data) {
            if (data.success) {
              return location.href = '/';
            } else {
              submit.prop('disabled', false);
              email.val("");
              return email_control.addClass('has-error');
            }
          }
        });
      }
    });
  });

}).call(this);

//# sourceMappingURL=register.js.map
