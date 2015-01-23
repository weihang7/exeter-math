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
      var id, individual, number, team, tr, _fn, _i, _len, _ref, _ref1, _results;
      number = 0;
      _ref = data.teams;
      _fn = function(id, team) {
        var member, team_tr, _fn1, _i, _len, _ref1;
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
        _ref1 = team.members;
        _fn1 = function(member) {
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
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          member = _ref1[_i];
          _fn1(member);
        }
        team_tr.append($("<td>" + team.paid + "</td>"));
        return teams_list.append(team_tr);
      };
      for (id in _ref) {
        team = _ref[id];
        _fn(id, team);
      }
      _ref1 = data.individuals;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        individual = _ref1[_i];
        tr = $("<tr><td><a href=\"mailto:" + data.users[individual.user] + "\">" + data.users[individual.user] + "</a></td>\n<td>" + individual.name + "</td><td>" + individual.paid + "</td>\n<td><input class='individual-textbox' type='checkbox' x-indiv-id='" + individual.id + "'/></td></tr>");
        _results.push(individuals_list.append(tr));
      }
      return _results;
    }
  });

}).call(this);
