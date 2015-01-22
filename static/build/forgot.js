(function() {
  var alert, email, email_control, notification, submit;

  email = $('#email');

  email_control = $('#email-control');

  submit = $('#submit');

  alert = $('#info');

  notification = 'A link to reset your password has been sent to your email.';

  submit.click(function() {
    return $.ajax({
      url: '/forgot',
      method: 'POST',
      data: {
        email: email.val()
      },
      dataType: 'json',
      success: function(data) {
        if (data.success) {
          alert.addClass('alert alert-success');
          return alert.text(notification);
        } else {
          submit.prop('disabled', false);
          return email_control.addClass('has-error');
        }
      }
    });
  });

}).call(this);
