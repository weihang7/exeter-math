window.addEventListener 'load', ->
    email = $ '#email'
    password = $ '#password'
    email_control = $ '#email-control'
    password_control = $ '#password-control'
    submit = $ '#submit'

    login = (email, password) ->
        submit.prop('disabled', true)
        $.ajax
            url: '/login'
            method: 'POST'
            data: {
                email: email
                password: password
            }
            dataType: 'json'
            success: (data) ->
                if data.success
                    location.href = '/'
                else if data.problem.indexOf('Password') > -1
                    submit.prop('disabled', false)
                    email_control.removeClass 'has-error'
                    password_control.addClass 'has-error'
                else
                    submit.prop('disabled', false)
                    email_control.addClass 'has-error'
                    password_control.addClass 'has-error'

    submit.click ->
        login(email.val(), password.val())

    password.keypress (e) ->
        if e and e.keyCode is 13
            login(email.val(), password.val())
