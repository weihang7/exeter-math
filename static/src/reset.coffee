confirm_control = $ '#confirm-control'
password = $ '#password'
confirm = $ '#confirm_password'
token = $ '#token'
submit = $ '#submit'

submit.click ->
    if confirm.val() is password.val()
        shaObj = new jsSHA(password.val(), 'TEXT')
        info = location.pathname.substr(7).split('-')
        token = info[1]
        id = parseInt(info[0])
        $.ajax
            url: '/reset'
            method: 'POST'
            data: {
                password: shaObj.getHash('SHA-512', 'HEX')
                token: token
                id: id
            }
            dataType: 'json'
            success: (data) ->
                if data.success
                    location.href = '/login.html'
    else
        confirm_control.addClass('has-error')
