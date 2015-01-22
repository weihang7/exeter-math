(function() {
  var email, email_control, login, password_control, password_el, submit;

  email = $('#email');

  password_el = $('#password');

  email_control = $('#email-control');

  password_control = $('#password-control');

  submit = $('#submit');

  login = function(email, password) {
    var shaObj;
    shaObj = new jsSHA(password, 'TEXT');
    return $.ajax({
      url: '/login',
      method: 'POST',
      data: {
        email: email,
        password: shaObj.getHash('SHA-512', 'HEX')
      },
      dataType: 'json',
      success: function(data) {
        if (data.success) {
          localStorage.isAdmin = (email === 'admin@exeter-math.appspot.com').toString();
          return location.href = '/register_team.html';
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
  };

  submit.click(function() {
    return login(email.val(), password_el.val());
  });

  password_el.keypress(function(e) {
    if (e && e.keyCode === 13) {
      return submit.click();
    }
  });

}).call(this);
