(function() {
  var addIndividual, addTeam, createLabelledInput, individualInputs, individualsDiv, invalidate, submit, teamInputs, teamsDiv, userInput;

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
        var deleteButton, i, input, memberInputs, nameInput, newTeamDiv, _i, _j, _k, _len, _len1;
        memberInputs = [];
        for (i = _i = 1; _i <= 4; i = ++_i) {
          memberInputs.push(createLabelledInput(i.toString(), "John Smith"));
        }
        nameInput = createLabelledInput('Team Name', 'Hogwarts A');
        nameInput.input.on('input', invalidate);
        deleteButton = $("<button class='btn btn-danger' data-id='" + data.id + "'>Delete</button>");
        deleteButton.click(function(event) {
          var id, _j, _ref;
          id = ($(event.target)).data('id');
          for (i = _j = 0, _ref = teamInputs.length; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
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
        for (_j = 0, _len = memberInputs.length; _j < _len; _j++) {
          input = memberInputs[_j];
          input.group.css('margin-left', '30px');
        }
        newTeamDiv.append(nameInput.group);
        for (_k = 0, _len1 = memberInputs.length; _k < _len1; _k++) {
          input = memberInputs[_k];
          newTeamDiv.append(input.group);
        }
        newTeamDiv.append(deleteButton);
        return teamsDiv.append(newTeamDiv);
      }
    });
  });

  addIndividual.click(function() {
    var input;
    input = createLabelledInput('Individual', 'John Smith');
    input.input.on('input', invalidate);
    individualInputs.push(input.input);
    return individualsDiv.append(input.group);
  });

  submit.click(function() {
    var individualInput, memberInput, members, teamInput, teamName, teams, _i, _j, _k, _len, _len1, _len2, _ref;
    members = [];
    teams = [];
    for (_i = 0, _len = teamInputs.length; _i < _len; _i++) {
      teamInput = teamInputs[_i];
      teamName = teamInput.name.val();
      _ref = teamInput.members;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        memberInput = _ref[_j];
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
    for (_k = 0, _len2 = individualInputs.length; _k < _len2; _k++) {
      individualInput = individualInputs[_k];
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
      var deleteButton, i, individual, input, member, memberInputs, nameInput, newTeamDiv, team, team_id, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _results;
      _ref = data.teams;
      for (team_id in _ref) {
        team = _ref[team_id];
        team.members.length = Math.max(team.members.length, 4);
        team.members.sort().reverse();
        memberInputs = [];
        _ref1 = team.members;
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          member = _ref1[i];
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
          var id, _j, _ref2;
          id = ($(event.target)).data('id');
          for (i = _j = 0, _ref2 = teamInputs.length; 0 <= _ref2 ? _j < _ref2 : _j > _ref2; i = 0 <= _ref2 ? ++_j : --_j) {
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
        for (_j = 0, _len1 = memberInputs.length; _j < _len1; _j++) {
          input = memberInputs[_j];
          input.group.css('margin-left', '30px');
        }
        newTeamDiv.append(nameInput.group);
        for (_k = 0, _len2 = memberInputs.length; _k < _len2; _k++) {
          input = memberInputs[_k];
          newTeamDiv.append(input.group);
        }
        newTeamDiv.append(deleteButton);
        teamsDiv.append(newTeamDiv);
      }
      _ref2 = data.individuals;
      _results = [];
      for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
        individual = _ref2[_l];
        input = createLabelledInput('Individual', 'John Smith');
        input.input.val(individual.name);
        input.input.on('input', invalidate);
        individualInputs.push(input.input);
        _results.push(individualsDiv.append(input.group));
      }
      return _results;
    },
    error: function() {
      return location.href = 'login.html';
    }
  });

}).call(this);
