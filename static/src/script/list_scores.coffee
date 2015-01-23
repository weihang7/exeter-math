teams_list = $ '#teams_list'
individuals_list = $ '#individuals_list'

# TODO get real weights
SPEED = 2
ACCURACY = 10
TEAM = 13
GUTS = 15

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
                    <td>#{formatGuts(team.guts_scores)}</td>
                    <td>#{getSweepstakes(team)}</td>
                  </tr>
                """

                teams_list.append team_tr

                for individual in team.members
                    individual_tr = $ """
                      <tr>
                        <td>#{team.name}</td>
                        <td>#{individual.name}</td>
                        <td>#{individual.id}</td>
                        <td>#{formatScore(individual.speed_scores)}</td>
                        <td>#{formatScore(individual.accuracy_scores)}</td>
                        <td>#{getScore(individual.speed_scores) * SPEED +
                        getScore(individual.accuracy_scores) * ACCURACY}</td>
                      </tr>
                    """

                    individuals_list.append individual_tr
            teams_list.tablesorter
                sorter: 'digit'
            individuals_list.tablesorter
                sorter: 'digit'
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

formatGuts = (arr) ->

getScore = (arr) ->
    count = 0
    if arr?
        count++ for el, i in arr when el
    return count

getSweepstakes = (team) ->
    total = getScore(team.team_scores) * TEAM + (team.guts ? 0)
    for individual in team.members
        total += getScore(individual.speed_scores) * SPEED + getScore(individual.accuracy_scores) * ACCURACY
    return total

do reload

