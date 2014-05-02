(function() {
  window.addEventListener('load', function() {
    var alert, email, email_control, submit;
    email = $('#email');
    email_control = $('#email-control');
    submit = $('#submit');
    alert = $('#info');
    return submit.click(function() {
      submit.prop('disabled', true);
      return $.ajax({
        url: '/forgot',
        method: 'POST',
        data: {
          email: email.val()
        },
        dataType: 'json',
        success: function(data) {
          if (data.success) {
            return alert.addClass('alert alert-success').text('A link to reset your password has been sent to your email.');
          } else {
            submit.prop('disabled', false);
            return email_control.addClass('has-error');
          }
        }
      });
    });
  });

}).call(this);

//# sourceMappingURL=forgot.js.map
