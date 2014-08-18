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

            if team.guts_scores?
                team_div.append $ """
                  <div>
                    <table class='table'>
                      <tr><td>Guts</td>#{("<td class='#{
                          if k then 'score-correct' else 'score-incorrect'
                        }'></td>" for k in team.guts_scores).join('')}</tr>
                    </table>
                    </div>
                """

            if team.team_scores?
                team_div.append $ """
                  <div>
                    <table class='table'>
                      <tr><td>Team</td>#{("<td class='#{
                          if k then 'score-correct' else 'score-incorrect'
                        }'></td>" for k in team.team_scores).join('')}</tr>
                    </table>
                  </div>
                """

            team_div.append $ """
              <div>
                Speed
                <table class='table'>
                  #{
                    (format_scores(member.name,
                        member.speed_scores) for member in team.members).join ''
                  }
                </table>
                </div>
            """

            team_div.append $ """
              <div>
                Speed
                <table class='table'>
                  #{
                    (format_scores(member.name,
                        member.accuracy_scores) for member in team.members).join ''
                  }
                </table>
                </div>
            """

            teams_list.append team_div
