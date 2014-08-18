teams_list = $ '#teams_list'
individualss_list = $ '#individuals_list'

format_scores = (name, scores) ->
    if scores?
        "<tr><td>#{name}</td>" + ("<td class='#{
            if k then 'score-correct' else 'score-incorrect'
        }'></td>" for k in scores).join('') + "</tr>"
    else
        ""

$.ajax
    url: '/list_all'
    dataType: 'json'
    success: (data) ->
        for id, team of data.teams
            team_div = $ """
              <div>
                <h2>#{team.name}</h2>
              </div>
            """

            team_div.append $ """
              <div>
                <h3>Speed</h3>
                <table class='table table-bordered'>
                  <tr><th>#</th>#{("<th>#{i}</th>" for i in [1..team.members[0].speed_scores.length]).join('')}</tr>
                  #{
                    (format_scores(member.name,
                        member.speed_scores) for member in team.members).join ''
                  }
                </table>
                </div>
            """

            team_div.append $ """
              <div>
                <h3>Accuracy</h3>
                <table class='table table-bordered'>
                  <tr><th>#</th>#{("<th>#{i}</th>" for i in [1..team.members[0].accuracy_scores.length]).join('')}</tr>
                  #{
                    (format_scores(member.name,
                        member.accuracy_scores) for member in team.members).join ''
                  }
                </table>
                </div>
            """

            if team.team_scores?
                team_div.append $ """
                  <div>
                    <h3>Team</h3>
                    <table class='table table-bordered'>
                      <tr>#{("<th>#{i}</th>" for i in [1..team.team_scores.length]).join('')}</tr>
                      <tr>#{("<td class='#{
                          if k then 'score-correct' else 'score-incorrect'
                        }'></td>" for k in team.team_scores).join('')}</tr>
                    </table>
                  </div>
                """

            if team.guts_scores?
                team_div.append $ """
                  <div>
                    <h3>Guts</h3>
                    <table class='table table-bordered'>
                      <tr>#{("<th>#{i}</th>" for i in [1..team.guts_scores.length]).join('')}</tr>
                      <tr>#{("<td class='#{
                          if k then 'score-correct' else 'score-incorrect'
                        }'></td>" for k in team.guts_scores).join('')}</tr>
                    </table>
                    </div>
                """

            teams_list.append team_div
