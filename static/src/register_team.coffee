individualInputs = []
teamInputs = []

addIndividual = $ '#add_individual'
addTeam = $ '#add_team'

teamsDiv = $ '#teams_list'
individualsDiv = $ '#individuals_list'
userInput = $ '#user'

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
    $.ajax
        url: '/create_team'
        dataType: 'json'
        success: (data) ->
            memberInputs = []

            for i in [1..4]
                memberInputs.push createLabelledInput(i.toString(),
                  "John Smith")

            nameInput = createLabelledInput 'Team Name', 'Hogwarts A'

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

    individualInputs.push input.input

    individualsDiv.append input.group

submit = $ '#submit'

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
