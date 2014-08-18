teams_list = $ '#teams_list'
individualss_list = $ '#individuals_list'

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
                <table class='table'>
                  <tr><td>Guts</td>#{("<td class='#{
                      if k then 'score-correct' else 'score-incorrect'
                    }'></td>" for k in team.guts_scores).join('')}</tr>
                </table>
                </div>
            """

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
                    ("<tr><td>#{member.name}</td>#{("<td class='#{
                        if k then 'score-correct' else 'score-incorrect'
                      }'></td>" for k in member.speed_scores).join('')
                    }</tr>" for member in team.members).join ''
                  }
                </table>
                </div>
            """

            team_div.append $ """
              <div>
                Accuracy
                <table class='table'>
                  #{
                    ("<tr><td>#{member.name}</td>#{("<td class='#{
                        if k then 'score-correct' else 'score-incorrect'
                      }'></td>" for k in member.accuracy_scores).join('')
                    }</tr>" for member in team.members).join ''
                  }
                </table>
              </div>
            """

            teams_list.append team_div
