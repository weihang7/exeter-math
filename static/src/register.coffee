window.addEventListener 'load', ->
    email = $ '#email'
    password = $ '#password'
    institution = $ '#institution'
    submit = $ '#submit'
    email_control = $ '#email-control'
    password_control  = $ '#password-control'

    register = ->
        console.log 'clicked'
        if email.val() is ""
            email_control.addClass 'has-error'
        else
            email_control.removeClass 'has-error'
        if password.val() is ""
            password_control.addClass 'has-error'
        else
            password_control.removeClass 'has-error'
        if email.val() is not "" and password.val() is not ""
            submit.prop('disabled', true)
            $.ajax
                url: '/register'
                method: 'POST'
                data: {
                    email: email.val()
                    password: password.val()
                    institution: institution.val()
                }
                dataType: 'json'
                success: (data) ->
                    if data.success
                        location.href = '/'
                    else
                        submit.prop('disabled', false)
                        email.val("")
                        email_control.addClass 'has-error'

    submit.click register
