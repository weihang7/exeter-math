window.addEventListener 'load', ->
    email = $ '#email'
    password = $ '#password'
    submit = $ '#submit'

    submit.click ->
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
                    alert(JSON.stringify(data))
