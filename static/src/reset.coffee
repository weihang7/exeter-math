window.addEventListener 'load', ->
    confirm_control = $ '#confirm-control'
    password = $ '#password'
    confirm = $ '#confirm_password'
    token = $ '#token'
    submit = $ '#submit'

    submit.click ->
        if confirm.val() is password.val()
            $.ajax
                url: '/reset'
                method: 'POST'
                data: {
                    password: password.val()
                    token: token.val()
                    id: parseInt(location.pathname.substr(7).split('-')[0])
                }
                dataType: 'json'
                success: (data) ->
                    if data.success
                        location.href = '/login.html'
        else
            confirm_control.addClass('has-error')
