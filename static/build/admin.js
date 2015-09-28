(function() {
  var individuals_list, teams_list;

  teams_list = $('#teams_list');

  individuals_list = $('#individuals_list');

  $('#individual-team').click(function() {
    var ids;
    ids = [];
    $('input.individual-textbox:checked').each(function() {
      return ids.push(Number($(this).attr('x-indiv-id')));
    });
    return $.ajax({
      url: '/individual_team',
      data: {
        'ids': JSON.stringify(ids)
      },
      success: function() {
        return location.reload();
      }
    });
  });

  $.ajax({
    url: '/admin_list',
    dataType: 'json',
    success: function(data) {
      var fn, i, id, individual, len, number, ref, ref1, results, team, tr;
      number = 0;
      ref = data.teams;
      fn = function(id, team) {
        var fn1, i, len, member, ref1, team_tr;
        team_tr = $('<tr></tr>');
        if (team.user > -1) {
          team_tr.append($("<td><a href='mailto:" + data.users[team.user] + "'>" + data.users[team.user] + "</a></td>"));
        } else {
          team_tr.append($("<td>(admin)</td>"));
        }
        team_tr.append($("<td></td>").append($("<input class='form-control'>").val(team.name).on('change', function() {
          return $.ajax({
            url: '/admin_edit_name',
            data: {
              'id': id,
              'name': this.value
            }
          });
        })));
        ref1 = team.members;
        fn1 = function(member) {
          return team_tr.append($("<td></td>").append($("<input class='form-control'>").val(member.name).on('change', function() {
            return $.ajax({
              url: '/admin_edit',
              data: {
                'id': member.id,
                'name': this.value
              }
            });
          })));
        };
        for (i = 0, len = ref1.length; i < len; i++) {
          member = ref1[i];
          fn1(member);
        }
        team_tr.append($("<td>" + team.paid + "</td>"));
        return teams_list.append(team_tr);
      };
      for (id in ref) {
        team = ref[id];
        fn(id, team);
      }
      ref1 = data.individuals;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        individual = ref1[i];
        tr = $("<tr><td><a href=\"mailto:" + data.users[individual.user] + "\">" + data.users[individual.user] + "</a></td>\n<td>" + individual.name + "</td><td>" + individual.paid + "</td>\n<td><input class='individual-textbox' type='checkbox' x-indiv-id='" + individual.id + "'/></td></tr>");
        results.push(individuals_list.append(tr));
      }
      return results;
    }
  });

}).call(this);
