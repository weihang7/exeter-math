teams_list = $ '#teams_list'
individuals_list = $ '#individuals_list'

$.ajax
    url: '/admin_list'
    dataType: 'json'
    success: (data) ->
        for id, team of data.teams
            team_tr = $ """
              <tr><td>#{data.users[team.user]}</td><td>#{team.name}</td>#{
                ("<td>#{member}</td>" for member in team.members).join ''
              }</tr>
            """

            teams_list.append team_tr
