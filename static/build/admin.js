(function() {
  var individuals_list, teams_list;

  teams_list = $('#teams_list');

  individuals_list = $('#individuals_list');

  $.ajax({
    url: '/admin_list',
    dataType: 'json',
    success: function(data) {
      var id, individual, member, number, team, team_tr, tr, _i, _len, _ref, _ref1, _results;
      number = 0;
      _ref = data.teams;
      for (id in _ref) {
        team = _ref[id];
        team_tr = $("<tr><td><a href=\"mailto:" + data.users[team.user] + "\">" + data.users[team.user] + "</a></td><td>" + team.name + "</td>" + (((function() {
          var _i, _len, _ref1, _results;
          _ref1 = team.members;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            member = _ref1[_i];
            _results.push("<td>" + member + "</td>");
          }
          return _results;
        })()).join('')) + "<td>" + team.paid + "</td></tr>");
        teams_list.append(team_tr);
      }
      _ref1 = data.individuals;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        individual = _ref1[_i];
        tr = $("<tr><td><a href=\"mailto:" + data.users[individual.user] + "\">" + data.users[individual.user] + "</a></td>\n<td>" + individual.name + "</td><td>" + individual.paid + "</td></tr>");
        _results.push(individuals_list.append(tr));
      }
      return _results;
    }
  });

}).call(this);
