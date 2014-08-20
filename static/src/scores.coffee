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
                <h2>#{team.name} (#{team.year})</h2>
              </div>
            """

            # If any member has speed round scores, display them
            speedMember = null
            accuracyMember = null
            for member, i in team.members
                if member.speed_scores? then speedMember = member
                if member.accuracy_scores? then accuracyMember = member

                if speedMember and accuracyMember? then break

            showedAnyScores = false

            if speedMember?
                showedAnyScores = true
                team_div.append $ """
                  <div>
                    <h3>Speed</h3>
                    <table class='table table-bordered'>
                      <tr><th>#</th>#{
                          ("<th>#{i}</th>" for i in [1..speedMember.speed_scores.length]).join('')
                      }</tr>
                      #{
                        (format_scores(member.name,
                            member.speed_scores) for member in team.members).join ''
                      }
                    </table>
                    </div>
                """

            if accuracyMember?
                showedAnyScores = true
                team_div.append $ """
                  <div>
                    <h3>Accuracy</h3>
                    <table class='table table-bordered'>
                      <tr><th>#</th>#{
                          ("<th>#{i}</th>" for i in [1..accuracyMember.accuracy_scores.length]).join('')
                      }</tr>
                      #{
                        (format_scores(member.name,
                            member.accuracy_scores) for member in team.members).join ''
                      }
                    </table>
                    </div>
                """

            if team.team_scores?
                showedAnyScores = true
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
                showedAnyScores = true
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

            unless showedAnyScores
                team_div.append '''
                    There are no scores for this team yet.
                '''

            teams_list.append team_div
