email = $ '#email'
password_el = $ '#password'
email_control = $ '#email-control'
password_control = $ '#password-control'
submit = $ '#submit'

login = (email, password) ->
    shaObj = new jsSHA password, 'TEXT'
    $.ajax
        url: '/login'
        method: 'POST'
        data: {
            email: email
            password: shaObj.getHash('SHA-512', 'B64')
        }
        dataType: 'json'
        success: (data) ->
            if data.success
                location.href = '/register_team.html'
            else if data.problem.indexOf('Password') > -1
                submit.prop('disabled', false)
                email_control.removeClass 'has-error'
                password_control.addClass 'has-error'
            else
                submit.prop('disabled', false)
                email_control.addClass 'has-error'
                password_control.addClass 'has-error'

submit.click ->
    login(email.val(), password_el.val())

password_el.keypress (e) ->
    if e and e.keyCode is 13
        submit.click()
