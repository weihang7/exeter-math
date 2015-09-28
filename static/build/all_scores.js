(function() {
  var individuals_list, teams_list;

  teams_list = $('#teams_list');

  individuals_list = $('#individuals_list');

  $.ajax({
    url: '/all_scores',
    dataType: 'json',
    success: function(data) {
      var id, member, ref, results, team, team_tr;
      ref = data.teams;
      results = [];
      for (id in ref) {
        team = ref[id];
        team_tr = $("<tr><td>\n  <a href=\"mailto:" + data.users[team.user] + "\">" + data.users[team.user] + "</a></td><td>" + team.name + "</td>" + (((function() {
          var i, len, ref1, results1;
          ref1 = team.members;
          results1 = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            member = ref1[i];
            results1.push("<td>" + member + "</td>");
          }
          return results1;
        })()).join('')) + "<td>" + team.paid + "</td></tr>");
        results.push(teams_list.append(team_tr));
      }
      return results;
    }
  });

}).call(this);
