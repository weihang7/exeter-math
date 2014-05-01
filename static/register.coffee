window.addEventListener 'load', ->
    email = $ '#email'
    password = $ '#password'
    institution = $ '#institution'
    submit = $ '#submit'

    submit.click ->
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
