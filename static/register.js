(function() {
  window.addEventListener('load', function() {
    var email, email_control, institution, password, submit;
    email = $('#email');
    password = $('#password');
    institution = $('#institution');
    submit = $('#submit');
    email_control = $('#email-control');
    return submit.click(function() {
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
    });
  });

}).call(this);

//# sourceMappingURL=register.js.map
