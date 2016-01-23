teams_list = $ '#teams_list'
individuals_list = $ '#individuals_list'

$.ajax
    url: '/admin_list'
    dataType: 'json'
    success: (data) ->
        number = 0
        for id, team of data.teams then do (id, team) ->
            indiv_inputs = []
            current_value = ''
            team_tr = $ "<tr></tr>"
            team_tr.append $ "<td>#{data.users[team.user]}</td>"
            team_tr.append $ "<td>#{team.name}</td>"
            team_tr.append $("<td></td>").append($("<input class='form-control'/>").val(team.assigned_id)
            .on('change', ->
                $.ajax
                    url: '/assign_id'
                    data: {
                        'primary_id': id
                        'assigned_id': @value
                    }
            ).on 'input', ->
                for input in indiv_inputs
                    input.val (@value + input.val()[current_value.length...])
                current_value = @value
            )
            for member in team.members then do (member) ->
                team_tr.append $("<td></td>").append input = $("<input class='form-control' placeholder='#{
                  member.name}' title='#{member.name}'/>").tooltipster().val(member.assigned_id).on 'change', ->
                    $.ajax
                        url: '/assign_individual_id'
                        data: {
                            'primary_id': member.id
                            'assigned_id': @value
                        }
                  indiv_inputs.push input
            teams_list.append team_tr
