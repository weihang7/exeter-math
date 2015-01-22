(function() {
  var individuals_list, teams_list;

  teams_list = $('#teams_list');

  individuals_list = $('#individuals_list');

  $.ajax({
    url: '/all_scores',
    dataType: 'json',
    success: function(data) {
      var id, member, team, team_tr, _ref, _results;
      _ref = data.teams;
      _results = [];
      for (id in _ref) {
        team = _ref[id];
        team_tr = $("<tr><td><a href=\"mailto:" + data.users[team.user] + "\">" + data.users[team.user] + "</a></td><td>" + team.name + "</td>" + (((function() {
          var _i, _len, _ref1, _results1;
          _ref1 = team.members;
          _results1 = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            member = _ref1[_i];
            _results1.push("<td>" + member + "</td>");
          }
          return _results1;
        })()).join('')) + "<td>" + team.paid + "</td></tr>");
        _results.push(teams_list.append(team_tr));
      }
      return _results;
    }
  });

}).call(this);
