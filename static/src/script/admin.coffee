teams_list = $ '#teams_list'
individuals_list = $ '#individuals_list'

$('#individual-team').click ->
    ids = []
    $('input.individual-textbox:checked').each ->
        ids.push Number $(@).attr 'x-indiv-id'
    $.ajax
        url: '/individual_team'
        data: {
            'ids': JSON.stringify ids
        }
        success: ->
            location.reload()

$.ajax
    url: '/admin_list'
    dataType: 'json'
    success: (data) ->
        number = 0
        for id, team of data.teams
            team_tr = $ '<tr></tr>'
            if team.user > -1
                team_tr.append $ "<td><a href='mailto:#{data.users[team.user]}'>#{data.users[team.user]}</a></td>"
            else
                team_tr.append $ "<td>(admin)</td>"
            team_tr.append $ "<td>#{team.name}</td>"
            for member in team.members then do (member) ->
                team_tr.append $("<td></td>").append $("<input class='form-control'>").val(member.name).on 'change', ->
                    $.ajax
                        url: '/admin_edit'
                        data: {
                            'id': member.id
                            'name': @value
                        }

            team_tr.append $ "<td>#{team.paid}</td>"

            teams_list.append team_tr
        for individual in data.individuals
            tr = $ """
              <tr><td><a href="mailto:#{data.users[individual.user]}">#{data.users[individual.user]}</a></td>
              <td>#{individual.name}</td><td>#{individual.paid}</td>
              <td><input class='individual-textbox' type='checkbox' x-indiv-id='#{individual.id}'/></td></tr>
            """

            individuals_list.append tr
