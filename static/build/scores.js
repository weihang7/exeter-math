(function() {
  var format_scores, individualss_list, teams_list;

  teams_list = $('#teams_list');

  individualss_list = $('#individuals_list');

  format_scores = function(name, scores) {
    var k;
    if (scores != null) {
      return ("<tr><td>" + name + "</td>") + ((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = scores.length; j < len; j++) {
          k = scores[j];
          results.push("<td class='" + (k ? 'score-correct' : 'score-incorrect') + "'></td>");
        }
        return results;
      })()).join('') + "</tr>";
    } else {
      return "";
    }
  };

  $.ajax({
    url: '/list_all',
    dataType: 'json',
    success: function(data) {
      var accuracyMember, i, id, j, k, len, member, ref, ref1, results, showedAnyScores, speedMember, team, team_div;
      ref = data.teams;
      results = [];
      for (id in ref) {
        team = ref[id];
        team_div = $("<div>\n  <h2>" + team.name + " (" + team.year + ")</h2>\n</div>");
        speedMember = null;
        accuracyMember = null;
        ref1 = team.members;
        for (i = j = 0, len = ref1.length; j < len; i = ++j) {
          member = ref1[i];
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
            var l, ref2, results1;
            results1 = [];
            for (i = l = 1, ref2 = speedMember.speed_scores.length; 1 <= ref2 ? l <= ref2 : l >= ref2; i = 1 <= ref2 ? ++l : --l) {
              results1.push("<th>" + i + "</th>");
            }
            return results1;
          })()).join('')) + "</tr>\n    " + (((function() {
            var l, len1, ref2, results1;
            ref2 = team.members;
            results1 = [];
            for (l = 0, len1 = ref2.length; l < len1; l++) {
              member = ref2[l];
              results1.push(format_scores(member.name, member.speed_scores));
            }
            return results1;
          })()).join('')) + "\n  </table>\n  </div>"));
        }
        if (accuracyMember != null) {
          showedAnyScores = true;
          team_div.append($("<div>\n  <h3>Accuracy</h3>\n  <table class='table table-bordered'>\n    <tr><th>#</th>" + (((function() {
            var l, ref2, results1;
            results1 = [];
            for (i = l = 1, ref2 = accuracyMember.accuracy_scores.length; 1 <= ref2 ? l <= ref2 : l >= ref2; i = 1 <= ref2 ? ++l : --l) {
              results1.push("<th>" + i + "</th>");
            }
            return results1;
          })()).join('')) + "</tr>\n    " + (((function() {
            var l, len1, ref2, results1;
            ref2 = team.members;
            results1 = [];
            for (l = 0, len1 = ref2.length; l < len1; l++) {
              member = ref2[l];
              results1.push(format_scores(member.name, member.accuracy_scores));
            }
            return results1;
          })()).join('')) + "\n  </table>\n  </div>"));
        }
        if ((team.team_scores != null) && team.team_scores.length > 0) {
          showedAnyScores = true;
          team_div.append($("<div>\n  <h3>Team</h3>\n  <table class='table table-bordered'>\n    <tr>" + (((function() {
            var l, ref2, results1;
            results1 = [];
            for (i = l = 1, ref2 = team.team_scores.length; 1 <= ref2 ? l <= ref2 : l >= ref2; i = 1 <= ref2 ? ++l : --l) {
              results1.push("<th>" + i + "</th>");
            }
            return results1;
          })()).join('')) + "</tr>\n    <tr>" + (((function() {
            var l, len1, ref2, results1;
            ref2 = team.team_scores;
            results1 = [];
            for (l = 0, len1 = ref2.length; l < len1; l++) {
              k = ref2[l];
              results1.push("<td class='" + (k ? 'score-correct' : 'score-incorrect') + "'></td>");
            }
            return results1;
          })()).join('')) + "</tr>\n  </table>\n</div>"));
        }
        if (team.guts_scores != null) {
          showedAnyScores = true;
          team_div.append($("<div>\n  <h3>Guts</h3>\n  <table class='table table-bordered'>\n    <tr>" + (((function() {
            var l, ref2, results1;
            results1 = [];
            for (i = l = 1, ref2 = team.guts_scores.length; 1 <= ref2 ? l <= ref2 : l >= ref2; i = 1 <= ref2 ? ++l : --l) {
              results1.push("<th>" + i + "</th>");
            }
            return results1;
          })()).join('')) + "</tr>\n    <tr>" + (((function() {
            var l, len1, ref2, results1;
            ref2 = team.guts_scores;
            results1 = [];
            for (l = 0, len1 = ref2.length; l < len1; l++) {
              k = ref2[l];
              results1.push("<td class='" + (k ? 'score-correct' : 'score-incorrect') + "'></td>");
            }
            return results1;
          })()).join('')) + "</tr>\n  </table>\n  </div>"));
        }
        if (!showedAnyScores) {
          team_div.append('There are no scores for this team yet.');
        }
        results.push(teams_list.append(team_div));
      }
      return results;
    }
  });

}).call(this);
