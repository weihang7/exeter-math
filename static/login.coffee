window.addEventListener 'load', ->
    email = $ '#email'
    password = $ '#password'
    email_control = $ '#email-control'
    password_control = $ '#password-control'
    submit = $ '#submit'

    submit.click ->
        submit.prop('disabled', true)
        $.ajax
            url: '/login'
            method: 'POST'
            data: {
                email: email.val()
                password: password.val()
            }
            dataType: 'json'
            success: (data) ->
                if data.success
                    location.href = '/'
                else
                    submit.prop('disabled', false)
                    email_control.addClass 'has-error'
                    password_control.addClass 'has-error'
