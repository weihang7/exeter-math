(function() {
  var individuals_list, teams_list;

  teams_list = $('#teams_list');

  individuals_list = $('#individuals_list');

  $.ajax({
    url: '/admin_list',
    dataType: 'json',
    success: function(data) {
      var id, number, ref, results, team;
      number = 0;
      ref = data.teams;
      results = [];
      for (id in ref) {
        team = ref[id];
        results.push((function(id, team) {
          var current_value, fn, i, indiv_inputs, len, member, ref1, team_tr;
          indiv_inputs = [];
          current_value = '';
          team_tr = $("<tr></tr>");
          team_tr.append($("<td>" + data.users[team.user] + "</td>"));
          team_tr.append($("<td>" + team.name + "</td>"));
          team_tr.append($("<td></td>").append($("<input class='form-control'/>").val(team.assigned_id).on('change', function() {
            return $.ajax({
              url: '/assign_id',
              data: {
                'primary_id': id,
                'assigned_id': this.value
              }
            });
          }).on('input', function() {
            var i, input, len;
            for (i = 0, len = indiv_inputs.length; i < len; i++) {
              input = indiv_inputs[i];
              input.val(this.value + input.val().slice(current_value.length));
            }
            return current_value = this.value;
          })));
          ref1 = team.members;
          fn = function(member) {
            var input;
            team_tr.append($("<td></td>").append(input = $("<input class='form-control' placeholder='" + member.name + "' title='" + member.name + "'/>").tooltipster().val(member.assigned_id).on('change', function() {
              return $.ajax({
                url: '/assign_individual_id',
                data: {
                  'primary_id': member.id,
                  'assigned_id': this.value
                }
              });
            })));
            return indiv_inputs.push(input);
          };
          for (i = 0, len = ref1.length; i < len; i++) {
            member = ref1[i];
            fn(member);
          }
          return teams_list.append(team_tr);
        })(id, team));
      }
      return results;
    }
  });

}).call(this);
