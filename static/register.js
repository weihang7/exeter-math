(function() {
  window.addEventListener('load', function() {
    var email, institution, password, submit;
    email = $('#email');
    password = $('#password');
    institution = $('#institution');
    submit = $('#submit');
    return submit.click(function() {
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
          }
        }
      });
    });
  });

}).call(this);

//# sourceMappingURL=register.js.map
