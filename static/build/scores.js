(function() {
  var format_scores, individualss_list, teams_list;

  teams_list = $('#teams_list');

  individualss_list = $('#individuals_list');

  format_scores = function(name, scores) {
    var k;
    if (scores != null) {
      return ("<tr><td>" + name + "</td>") + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = scores.length; _i < _len; _i++) {
          k = scores[_i];
          _results.push("<td class='" + (k ? 'score-correct' : 'score-incorrect') + "'></td>");
        }
        return _results;
      })()).join('') + "</tr>";
    } else {
      return "";
    }
  };

  $.ajax({
    url: '/list_all',
    dataType: 'json',
    success: function(data) {
      var accuracyMember, i, id, k, member, showedAnyScores, speedMember, team, team_div, _i, _len, _ref, _ref1, _results;
      _ref = data.teams;
      _results = [];
      for (id in _ref) {
        team = _ref[id];
        team_div = $("<div>\n  <h2>" + team.name + " (" + team.year + ")</h2>\n</div>");
        speedMember = null;
        accuracyMember = null;
        _ref1 = team.members;
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          member = _ref1[i];
          if (member.speed_scores != null) {
            speedMember = member;
          }
          if (member.accuracy_scores != null) {
            accuracyMember = member;
          }
          if (speedMember && (accuracyMember != null)) {
            break;
          }
        }
        showedAnyScores = false;
        if (speedMember != null) {
          showedAnyScores = true;
          team_div.append($("<div>\n  <h3>Speed</h3>\n  <table class='table table-bordered'>\n    <tr><th>#</th>" + (((function() {
            var _j, _ref2, _results1;
            _results1 = [];
            for (i = _j = 1, _ref2 = speedMember.speed_scores.length; 1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = 1 <= _ref2 ? ++_j : --_j) {
              _results1.push("<th>" + i + "</th>");
            }
            return _results1;
          })()).join('')) + "</tr>\n    " + (((function() {
            var _j, _len1, _ref2, _results1;
            _ref2 = team.members;
            _results1 = [];
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              member = _ref2[_j];
              _results1.push(format_scores(member.name, member.speed_scores));
            }
            return _results1;
          })()).join('')) + "\n  </table>\n  </div>"));
        }
        if (accuracyMember != null) {
          showedAnyScores = true;
          team_div.append($("<div>\n  <h3>Accuracy</h3>\n  <table class='table table-bordered'>\n    <tr><th>#</th>" + (((function() {
            var _j, _ref2, _results1;
            _results1 = [];
            for (i = _j = 1, _ref2 = accuracyMember.accuracy_scores.length; 1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = 1 <= _ref2 ? ++_j : --_j) {
              _results1.push("<th>" + i + "</th>");
            }
            return _results1;
          })()).join('')) + "</tr>\n    " + (((function() {
            var _j, _len1, _ref2, _results1;
            _ref2 = team.members;
            _results1 = [];
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              member = _ref2[_j];
              _results1.push(format_scores(member.name, member.accuracy_scores));
            }
            return _results1;
          })()).join('')) + "\n  </table>\n  </div>"));
        }
        if (team.team_scores != null) {
          showedAnyScores = true;
          team_div.append($("<div>\n  <h3>Team</h3>\n  <table class='table table-bordered'>\n    <tr>" + (((function() {
            var _j, _ref2, _results1;
            _results1 = [];
            for (i = _j = 1, _ref2 = team.team_scores.length; 1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = 1 <= _ref2 ? ++_j : --_j) {
              _results1.push("<th>" + i + "</th>");
            }
            return _results1;
          })()).join('')) + "</tr>\n    <tr>" + (((function() {
            var _j, _len1, _ref2, _results1;
            _ref2 = team.team_scores;
            _results1 = [];
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              k = _ref2[_j];
              _results1.push("<td class='" + (k ? 'score-correct' : 'score-incorrect') + "'></td>");
            }
            return _results1;
          })()).join('')) + "</tr>\n  </table>\n</div>"));
        }
        if (team.guts_scores != null) {
          showedAnyScores = true;
          team_div.append($("<div>\n  <h3>Guts</h3>\n  <table class='table table-bordered'>\n    <tr>" + (((function() {
            var _j, _ref2, _results1;
            _results1 = [];
            for (i = _j = 1, _ref2 = team.guts_scores.length; 1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = 1 <= _ref2 ? ++_j : --_j) {
              _results1.push("<th>" + i + "</th>");
            }
            return _results1;
          })()).join('')) + "</tr>\n    <tr>" + (((function() {
            var _j, _len1, _ref2, _results1;
            _ref2 = team.guts_scores;
            _results1 = [];
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              k = _ref2[_j];
              _results1.push("<td class='" + (k ? 'score-correct' : 'score-incorrect') + "'></td>");
            }
            return _results1;
          })()).join('')) + "</tr>\n  </table>\n  </div>"));
        }
        if (!showedAnyScores) {
          team_div.append('There are no scores for this team yet.');
        }
        _results.push(teams_list.append(team_div));
      }
      return _results;
    }
  });

}).call(this);
