teams_list = $ '#teams_list'
individuals_list = $ '#individuals_list'

$.ajax
    url: '/admin_list'
    dataType: 'json'
    success: (data) ->
        for id, team of data.teams
            team_tr = $ """
              <tr><td><a href="mailto:#{data.users[team.user]}">#{data.users[team.user]}</a></td><td>#{team.name}</td>#{
                ("<td>#{member}</td>" for member in team.members).join ''
              }<td>#{team.paid}</td></tr>
            """

            teams_list.append team_tr
