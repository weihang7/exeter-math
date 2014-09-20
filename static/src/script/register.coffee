email = $ '#email'
password = $ '#password'
confirm = $ '#confirm_password'
institution = $ '#institution'
submit = $ '#submit'
email_control = $ '#email-control'
password_control  = $ '#password-control'
confirm_control = $ '#confirm-control'

verify = (email, password, confirm) ->
    failed = false
    if email.indexOf('@') is -1
        email_control.addClass 'has-error'
        failed = true
    else
        email_control.removeClass 'has-error'
    if password is ""
        password_control.addClass 'has-error'
        failed = true
    else
        password_control.removeClass 'has-error'
    if confirm is "" or confirm isnt password
        confirm_control.addClass 'has-error'
        failed = true
    else
        confirm_control.removeClass 'has-error'
    return not failed

register = ->
    if verify(email.val(), password.val(), confirm.val())
        submit.prop('disabled', true)
        shaObj = new jsSHA(password.val(), 'TEXT')
        $.ajax
            url: '/register'
            method: 'POST'
            data: {
                email: email.val()
                password: shaObj.getHash('SHA-512', 'HEX')
                institution: institution.val()
            }
            dataType: 'json'
            success: (data) ->
                if data.success
                    location.href = '/register_team.html'
                else
                    submit.prop('disabled', false)
                    email.val("")
                    email_control.addClass 'has-error'

submit.click register
password.keypress (e) ->
    if e and e.keyCode is 13
        register()
institution.keypress (e) ->
    if e and e.keyCode is 13
        register()
