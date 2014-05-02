window.addEventListener 'load', ->
    email = $ '#email'
    email_control = $ '#email-control'
    submit = $ '#submit'
    alert = $ '#info'

    submit.click ->
        submit.prop('disabled', true)
        $.ajax
            url: '/forgot'
            method: 'POST'
            data: {
                email: email.val()
            }
            dataType: 'json'
            success: (data) ->
                if data.success
                    alert.addClass('alert alert-success').text('A link to reset your password has been sent to your email.')
                else
                    submit.prop('disabled', false)
                    email_control.addClass 'has-error'
