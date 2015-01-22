teams_list = $ '#teams_list'
individuals_list = $ '#individuals_list'

reload = (sortfun) ->
    $.ajax
        url: '/list_scores'
        dataType: 'json'
        success: (data) ->
            number = 0
            for id, team of data
                team_tr = $ """
                  <tr>
                    <td>#{team.name}</td>
                    <td>#{team.id}</td>
                    <td>#{formatScore(team.team_scores)}</td>
                    <td>#{team.guts_scores}</td>
                  </tr>
                """

                teams_list.append team_tr

                for individual in team.members
                    individual_tr = $ """
                      <tr>
                        <td>#{individual.name}</td>
                        <td>#{individual.id}</td>
                        <td>#{formatScore(individual.speed_scores)}</td>
                        <td>#{formatScore(individual.accuracy_scores)}</td>
                      </tr>
                    """

                    individuals_list.append individual_tr
formatScore = (arr) ->
    if arr?
        correct = []
        incorrect = []
        correct.push(i + 1) for el, i in arr when el
        incorrect.push(i + 1) for el, i in arr when not el
        if correct.length < incorrect.length
            return "#{correct.length} (#{correct.join(', ')})"
        else
            return "#{correct.length} (missed #{incorrect.join(', ')})"
    else
        return "n/a"

do reload
