(function() {
  var confirm, confirm_control, email, email_control, institution, password, password_control, register, submit, verify;

  email = $('#email');

  password = $('#password');

  confirm = $('#confirm_password');

  institution = $('#institution');

  submit = $('#submit');

  email_control = $('#email-control');

  password_control = $('#password-control');

  confirm_control = $('#confirm-control');

  verify = function(email, password, confirm) {
    var failed;
    failed = false;
    if (email.indexOf('@') === -1) {
      email_control.addClass('has-error');
      failed = true;
    } else {
      email_control.removeClass('has-error');
    }
    if (password === "") {
      password_control.addClass('has-error');
      failed = true;
    } else {
      password_control.removeClass('has-error');
    }
    if (confirm === "" || confirm !== password) {
      confirm_control.addClass('has-error');
      failed = true;
    } else {
      confirm_control.removeClass('has-error');
    }
    return !failed;
  };

  register = function() {
    var shaObj;
    if (verify(email.val(), password.val(), confirm.val())) {
      submit.prop('disabled', true);
      shaObj = new jsSHA(password.val(), 'TEXT');
      return $.ajax({
        url: '/register',
        method: 'POST',
        data: {
          email: email.val(),
          password: shaObj.getHash('SHA-512', 'HEX'),
          institution: institution.val()
        },
        dataType: 'json',
        success: function(data) {
          if (data.success) {
            return location.href = '/register_team.html';
          } else {
            submit.prop('disabled', false);
            email.val("");
            return email_control.addClass('has-error');
          }
        }
      });
    }
  };

  submit.click(register);

  password.keypress(function(e) {
    if (e && e.keyCode === 13) {
      return register();
    }
  });

  institution.keypress(function(e) {
    if (e && e.keyCode === 13) {
      return register();
    }
  });

}).call(this);
