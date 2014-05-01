(function() {
  window.addEventListener('load', function() {
    var email, password, submit;
    email = $('#email');
    password = $('#password');
    submit = $('#submit');
    return submit.click(function() {
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
          } else {
            return alert(JSON.stringify(data));
          }
        }
      });
    });
  });

}).call(this);

//# sourceMappingURL=login.js.map
