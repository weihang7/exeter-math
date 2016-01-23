email = $ '#email'
email_control = $ '#email-control'
submit = $ '#submit'
alert = $ '#info'
notification = 'A link to reset your password has been sent to your email.'


submit.click ->
    $.ajax
        url: '/forgot'
        method: 'POST'
        data: {
            email: email.val()
        }
        dataType: 'json'
        success: (data) ->
            if data.success
                alert.addClass('alert alert-success')
                alert.text notification
            else
                submit.prop('disabled', false)
                email_control.addClass 'has-error'
