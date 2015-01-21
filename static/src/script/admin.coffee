teams_list = $ '#teams_list'
individuals_list = $ '#individuals_list'

$.ajax
    url: '/admin_list'
    dataType: 'json'
    success: (data) ->
        number = 0
        for id, team of data.teams
            team_tr = $ """
              <tr><td><a href="mailto:#{data.users[team.user]}">#{data.users[team.user]}</a></td><td>#{team.name}</td>#{
                ("<td>#{member.name}</td>" for member in team.members).join ''
              }<td>#{team.paid}</td></tr>
            """

            teams_list.append team_tr
        for individual in data.individuals
            tr = $ """
              <tr><td><a href="mailto:#{data.users[individual.user]}">#{data.users[individual.user]}</a></td>
              <td>#{individual.name}</td><td>#{individual.paid}</td></tr>
            """

            individuals_list.append tr
