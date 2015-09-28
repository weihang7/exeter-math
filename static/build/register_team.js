(function() {
  var addIndividual, addTeam, createLabelledInput, individualInputs, individualsDiv, invalidate, newIndividual, submit, teamInputs, teamsDiv, userInput;

  if (localStorage.isAdmin === 'true') {
    $('#register-buttons').show();
  }

  individualInputs = [];

  teamInputs = [];

  addIndividual = $('#add_individual');

  addTeam = $('#add_team');

  teamsDiv = $('#teams_list');

  individualsDiv = $('#individuals_list');

  userInput = $('#user');

  submit = $('#submit');

  invalidate = function() {
    submit.text('Save');
    return submit.removeAttr('disabled');
  };

  createLabelledInput = function(label, placeholder) {
    var group, input, span;
    input = ($("<input class='form-control' placeholder='" + placeholder + "'>")).change(invalidate);
    span = $("<span class='input-group-addon'>" + label + "</span>");
    group = $("<div class='input-group'>");
    group.append(span).append(input);
    return {
      group: group,
      input: input
    };
  };

  addTeam.click(function() {
    invalidate();
    return $.ajax({
      url: '/create_team',
      dataType: 'json',
      success: function(data) {
        var deleteButton, i, input, j, k, l, len, len1, memberInputs, nameInput, newTeamDiv;
        memberInputs = [];
        for (i = j = 1; j <= 4; i = ++j) {
          memberInputs.push(createLabelledInput(i.toString(), "John Smith"));
        }
        nameInput = createLabelledInput('Team Name', 'Hogwarts A');
        nameInput.input.on('input', invalidate);
        deleteButton = $("<button class='btn btn-danger' data-id='" + data.id + "'>Delete</button>");
        deleteButton.click(function(event) {
          var id, k, ref;
          id = ($(event.target)).data('id');
          for (i = k = 0, ref = teamInputs.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
            if (id === teamInputs[i].id) {
              teamInputs.splice(i, 1);
              break;
            }
          }
          ($(event.target)).parent().remove();
          return invalidate();
        });
        teamInputs.push({
          name: nameInput.input,
          members: memberInputs.map(function(x) {
            return x.input;
          }),
          id: data.id
        });
        newTeamDiv = $('<div class="form-group">');
        for (k = 0, len = memberInputs.length; k < len; k++) {
          input = memberInputs[k];
          input.group.css('margin-left', '30px');
        }
        newTeamDiv.append(nameInput.group);
        for (l = 0, len1 = memberInputs.length; l < len1; l++) {
          input = memberInputs[l];
          newTeamDiv.append(input.group);
        }
        newTeamDiv.append(deleteButton);
        return teamsDiv.append(newTeamDiv);
      }
    });
  });

  newIndividual = function(name) {
    var deleteButton, input;
    input = createLabelledInput('Individual', 'John Smith');
    input.input.on('input', invalidate);
    input.input.val(name);
    individualInputs.push(input.input);
    deleteButton = $("<span class='input-group-addon btn btn-danger'> <span class='glyphicon glyphicon-remove'></span> </span>");
    deleteButton.click(function(event) {
      var id;
      id = ($(event.target)).attr('id');
      individualInputs.splice(id, 1);
      ($(event.target)).parent().parent().remove();
      return invalidate();
    });
    input.group.attr('id', individualInputs.length);
    input.group.prepend(deleteButton);
    return individualsDiv.append(input.group);
  };

  addIndividual.click(function() {
    return newIndividual();
  });

  submit.click(function() {
    var individualInput, j, k, l, len, len1, len2, memberInput, members, ref, teamInput, teamName, teams;
    members = [];
    teams = [];
    for (j = 0, len = teamInputs.length; j < len; j++) {
      teamInput = teamInputs[j];
      teamName = teamInput.name.val();
      ref = teamInput.members;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        memberInput = ref[k];
        members.push({
          name: memberInput.val(),
          team: teamInput.id
        });
      }
      teams.push({
        name: teamName,
        id: teamInput.id
      });
    }
    for (l = 0, len2 = individualInputs.length; l < len2; l++) {
      individualInput = individualInputs[l];
      members.push({
        name: individualInput.val(),
        team: -1
      });
    }
    return $.ajax({
      url: '/edit_info',
      data: {
        'user': userInput.val(),
        'teams': JSON.stringify(teams),
        'individuals': JSON.stringify(members)
      },
      success: function() {
        submit.text('Saved');
        return submit.attr('disabled', '');
      },
      error: function() {
        return location.href = 'login.html';
      }
    });
  });

  $.ajax({
    url: '/list',
    dataType: 'json',
    success: function(data) {
      var deleteButton, i, individual, input, j, k, l, len, len1, len2, len3, m, member, memberInputs, nameInput, newTeamDiv, ref, ref1, ref2, results, team, team_id;
      ref = data.teams;
      for (team_id in ref) {
        team = ref[team_id];
        team.members.length = Math.max(team.members.length, 4);
        team.members.sort().reverse();
        memberInputs = [];
        ref1 = team.members;
        for (i = j = 0, len = ref1.length; j < len; i = ++j) {
          member = ref1[i];
          memberInputs.push(input = createLabelledInput((i + 1).toString(), 'John Smith'));
          if (member != null) {
            input.input.val(member.name);
          }
          input.input.on('input', invalidate);
        }
        nameInput = createLabelledInput('Team Name', 'Hogwarts A');
        nameInput.input.val(team.name);
        nameInput.input.on('input', invalidate);
        deleteButton = $("<button class='btn btn-danger' data-id='" + (Number(team_id)) + "'>Delete</button>");
        deleteButton.click(function(event) {
          var id, k, ref2;
          id = ($(event.target)).data('id');
          for (i = k = 0, ref2 = teamInputs.length; 0 <= ref2 ? k < ref2 : k > ref2; i = 0 <= ref2 ? ++k : --k) {
            if (id === teamInputs[i].id) {
              teamInputs.splice(i, 1);
              break;
            }
          }
          ($(event.target)).parent().remove();
          return invalidate();
        });
        teamInputs.push({
          name: nameInput.input,
          members: memberInputs.map(function(x) {
            return x.input;
          }),
          id: Number(team_id)
        });
        newTeamDiv = $('<div class="form-group">');
        for (k = 0, len1 = memberInputs.length; k < len1; k++) {
          input = memberInputs[k];
          input.group.css('margin-left', '30px');
        }
        newTeamDiv.append(nameInput.group);
        for (l = 0, len2 = memberInputs.length; l < len2; l++) {
          input = memberInputs[l];
          newTeamDiv.append(input.group);
        }
        newTeamDiv.append(deleteButton);
        teamsDiv.append(newTeamDiv);
      }
      ref2 = data.individuals;
      results = [];
      for (m = 0, len3 = ref2.length; m < len3; m++) {
        individual = ref2[m];
        results.push(newIndividual(individual.name));
      }
      return results;
    },
    error: function() {
      return location.href = 'login.html';
    }
  });

}).call(this);
