(function() {
  var ACCURACY, GUTS, SPEED, TEAM, formatGuts, formatScore, getScore, getSweepstakes, individuals_list, reload, teams_list;

  teams_list = $('#teams_list');

  individuals_list = $('#individuals_list');

  SPEED = 3;

  ACCURACY = 9;

  TEAM = 20;

  GUTS = [5, 5, 5, 7, 7, 7, 9, 9, 9, 11, 11, 11, 13, 13, 13, 15, 15, 15, 18, 18, 18, 22, 22, 22];

  reload = function(sortfun) {
    return $.ajax({
      url: '/list_scores',
      dataType: 'json',
      success: function(data) {
        var id, individual, individual_tr, j, len, number, ref, team, team_tr;
        number = 0;
        for (id in data) {
          team = data[id];
          team_tr = $("<tr>\n  <td>" + team.name + "</td>\n  <td>" + team.id + "</td>\n  <td>" + (formatScore(team.team_scores)) + "</td>\n  <td>" + (formatGuts(team.guts_scores)) + "</td>\n  <td>" + (getSweepstakes(team)) + "</td>\n</tr>");
          teams_list.append(team_tr);
          ref = team.members;
          for (j = 0, len = ref.length; j < len; j++) {
            individual = ref[j];
            individual_tr = $("<tr>\n  <td>" + team.name + "</td>\n  <td>" + individual.name + "</td>\n  <td>" + individual.id + "</td>\n  <td>" + (formatScore(individual.speed_scores)) + "</td>\n  <td>" + (formatScore(individual.accuracy_scores)) + "</td>\n  <td>" + (getScore(individual.speed_scores) * SPEED + getScore(individual.accuracy_scores) * ACCURACY) + "</td>\n</tr>");
            individuals_list.append(individual_tr);
          }
        }
        teams_list.tablesorter({
          headers: {
            2: {
              sorter: 'digit'
            },
            3: {
              sorter: 'digit'
            },
            4: {
              sorter: 'digit'
            }
          }
        });
        return individuals_list.tablesorter({
          headers: {
            3: {
              sorter: 'digit'
            },
            4: {
              sorter: 'digit'
            },
            5: {
              sorter: 'digit'
            }
          }
        });
      }
    });
  };

  formatScore = function(arr) {
    var correct, el, i, incorrect, j, k, len, len1;
    if (arr != null) {
      correct = [];
      incorrect = [];
      for (i = j = 0, len = arr.length; j < len; i = ++j) {
        el = arr[i];
        if (el) {
          correct.push(i + 1);
        }
      }
      for (i = k = 0, len1 = arr.length; k < len1; i = ++k) {
        el = arr[i];
        if (!el) {
          incorrect.push(i + 1);
        }
      }
      if (correct.length < incorrect.length) {
        return correct.length + " (" + (correct.join(', ')) + ")";
      } else {
        return correct.length + " (missed " + (incorrect.join(', ')) + ")";
      }
    } else {
      return "0 (not scored)";
    }
  };

  formatGuts = function(arr) {
    var el, i, j, len, total;
    total = 0;
    if (arr != null) {
      for (i = j = 0, len = arr.length; j < len; i = ++j) {
        el = arr[i];
        if (el) {
          total += GUTS[i];
        }
      }
    }
    return total;
  };

  getScore = function(arr) {
    var count, el, i, j, len;
    count = 0;
    if (arr != null) {
      for (i = j = 0, len = arr.length; j < len; i = ++j) {
        el = arr[i];
        if (el) {
          count++;
        }
      }
    }
    return count;
  };

  getSweepstakes = function(team) {
    var individual, j, len, ref, total;
    total = getScore(team.team_scores) * TEAM + formatGuts(team.guts_scores);
    ref = team.members;
    for (j = 0, len = ref.length; j < len; j++) {
      individual = ref[j];
      total += getScore(individual.speed_scores) * SPEED + getScore(individual.accuracy_scores) * ACCURACY;
    }
    return total;
  };

  reload();

}).call(this);
