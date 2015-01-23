uassword = $ '#password'
round = $ '#round'
id = $ '#id'
guts_round = $ '#guts-round'
submit = $ '#submit'
password_control  = $ '#password-control'
id_control = $ '#id-control'
guts_round_control = $ '#guts-round-control'
checkboxes = $ '#checkboxes'
cur_scores = []
map = {
    'speed': 20
    'accuracy': 10
    'team': 15
}

verify = (password, id) ->
    failed = false
    if password is ""
        password_control.addClass 'has-error'
        failed = true
    else
        password_control.removeClass 'has-error'
    if id is ""
        id_control.addClass 'has-error'
        failed = true
    else
        id_control.removeClass 'has-error'
    return !failed

serialize = ->
    ret = []
    ($ "input[type=checkbox]").map( (i, el) ->
        ret.push el.checked
    )
    return ret

validate = (scores) ->
    cur = serialize()
    ($ '#diff').text 'Conflicts: '
    for i in [0...cur_scores.length]
        if cur_scores[i] isnt cur[i]
            ($ '#diff').append (i + 1) + ', '

grade = ->
    if verify(password.val(), id.val())
        $.ajax
            url: '/grade'
            method: 'POST'
            data: {
                password: password.val()
                round: round.val()
                id: id.val()
                guts_round: guts_round.val()
                score: JSON.stringify(serialize())
            }
            dataType: 'json'
            success: (data) ->
                if data.success
                    ($ "input[type=checkbox]").prop('checked', false)
                    id.val('')
                else
                    if data.problem is 'password'
                        password.val('')
                        password_control.addClass 'has-error'
                    else if data.problem is 'id'
                        id.val('')
                        id_control.addClass 'has-error'

submit.click grade

refresh = ->
    checkboxes.empty()
    if round.val() isnt 'guts'
        for i in [1..map[round.val()]]
            checkboxes.append($ "<div class='checkbox'>
            <label>#{i}<input type='checkbox'></label>
            </div>")
        guts_round_control.addClass 'hidden'
    else
        guts_round_control.removeClass 'hidden'
        refresh_guts()
    ($ '#graded').text ''
    cur_scores = []

refresh_guts = ->
    checkboxes.empty()
    for i in [parseInt(guts_round.val())*3-2..parseInt(guts_round.val())*3]
        checkboxes.append($ "<div class='checkbox'>
        <label>#{i}<input type='checkbox'></label>
        </div>")

check = ->
    $.ajax
        url: '/check'
        method: 'GET'
        data: {
            round: round.val()
            id: id.val()
            guts_round: guts_round.val()
        }
        success: (data) ->
            scores = JSON.parse(data.scores)
            if scores and scores.length > 0
                ($ '#graded').text data.name
                cur_scores = scores
                validate()

refresh()
round.change refresh
guts_round.change refresh_guts
id.keyup check
checkboxes.change validate
