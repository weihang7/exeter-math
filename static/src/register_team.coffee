individualInputs = []
teamInputs = []

addIndividual = $ '#add_individual'
addTeam = $ '#add_team'

teamsDiv = $ '#teams_list'
individualsDiv = $ '#individuals_list'
userInput = $ '#user'

submit = $ '#submit'

invalidate = ->
    submit.text 'Save'
    submit.removeAttr 'disabled'

createLabelledInput = (label, placeholder) ->
    input = $ "<input class='form-control' placeholder='#{placeholder}'>"
    span = $ "<span class='input-group-addon'>#{label}</span>"
    group = $ "<div class='input-group'>"

    group.append(span).append input

    return {
        group: group,
        input: input
    }

addTeam.click ->
    invalidate()
    $.ajax
        url: '/create_team'
        dataType: 'json'
        success: (data) ->
            memberInputs = []

            for i in [1..4]
                memberInputs.push createLabelledInput(i.toString(),
                  "John Smith")

            nameInput = createLabelledInput 'Team Name', 'Hogwarts A'
            nameInput.input.on 'input', invalidate

            teamInputs.push {
                name: nameInput.input
                members: memberInputs.map (x) -> x.input
                id: data.id
            }

            newTeamDiv = $ '<div class="form-group">'

            input.group.css('margin-left', '30px') for input in memberInputs
            
            newTeamDiv.append nameInput.group
            newTeamDiv.append input.group for input in memberInputs
            
            teamsDiv.append newTeamDiv

addIndividual.click ->
    input = createLabelledInput 'Individual', 'John Smith'
    input.input.on 'input', invalidate

    individualInputs.push input.input

    individualsDiv.append input.group

submit.click ->
    members = []
    teams = []
    for teamInput in teamInputs
        teamName = teamInput.name.val()
      
        for memberInput in teamInput.members
            members.push {
                name: memberInput.val()
                team: teamInput.id
            }

        teams.push {
            name: teamName
            id: teamInput.id
        }

    for individualInput in individualInputs
        members.push {
            name: individualInput.val()
            team: -1
        }

    $.ajax
        url: '/edit_info'
        data: {
            'user': userInput.val()
            'teams': JSON.stringify teams
            'individuals': JSON.stringify members
        }
        success: ->
            submit.text 'Saved'
            submit.attr 'disabled', ''

$.ajax
    url: '/list'
    dataType: 'json'
    success: (data) ->
        for team_id, team of data.teams
            team.members.length = Math.max team.members.length, 4
            team.members.sort().reverse()

            memberInputs = []

            for memberName, i in team.members
                memberInputs.push input = createLabelledInput((i + 1).toString(),
                    'John Smith')
                if memberName?
                    input.input.val memberName

                input.input.on 'input', invalidate

            nameInput = createLabelledInput 'Team Name', 'Hogwarts A'
            nameInput.input.val team.name
            nameInput.input.on 'input', invalidate

            teamInputs.push {
                name: nameInput.input
                members: memberInputs.map (x) -> x.input
                id: Number team_id
            }

            newTeamDiv = $ '<div class="form-group">'

            input.group.css('margin-left', '30px') for input in memberInputs

            newTeamDiv.append nameInput.group
            newTeamDiv.append input.group for input in memberInputs

            teamsDiv.append newTeamDiv

        for individualName in data.individuals
            input = createLabelledInput 'Individual', 'John Smith'
            input.input.val individualName
            input.input.on 'input', invalidate

            individualInputs.push input.input

            individualsDiv.append input.group
