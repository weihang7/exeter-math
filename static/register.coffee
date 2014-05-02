window.addEventListener 'load', ->
    email = $ '#email'
    password = $ '#password'
    institution = $ '#institution'
    submit = $ '#submit'
    email_control = $ '#email-control'

    submit.click ->
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
