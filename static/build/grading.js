(function() {
  var check, checkboxes, cur_scores, grade, guts_round, guts_round_control, id, id_control, last_received, map, password, password_control, refresh, refresh_guts, request_id, round, serialize, submit, validate, verify;

  password = $('#password');

  round = $('#round');

  id = $('#id');

  guts_round = $('#guts-round');

  submit = $('#submit');

  password_control = $('#password-control');

  id_control = $('#id-control');

  guts_round_control = $('#guts-round-control');

  checkboxes = $('#checkboxes');

  cur_scores = [];

  map = {
    'speed': 20,
    'accuracy': 10,
    'team': 15
  };

  verify = function(password, id) {
    var failed;
    failed = false;
    if (password === "") {
      password_control.addClass('has-error');
      failed = true;
    } else {
      password_control.removeClass('has-error');
    }
    if (id === "") {
      id_control.addClass('has-error');
      failed = true;
    } else {
      id_control.removeClass('has-error');
    }
    return !failed;
  };

  serialize = function() {
    var ret;
    ret = [];
    ($("input[type=checkbox]")).map(function(i, el) {
      return ret.push(el.checked);
    });
    return ret;
  };

  validate = function(scores) {
    var cur, i, j, k, ref, ref1, ref2, results, results1, rnd;
    cur = serialize();
    ($('#diff')).text('Conflicts: ');
    if (round.val() !== 'guts') {
      results = [];
      for (i = j = 0, ref = cur_scores.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        if (cur_scores[i] !== cur[i]) {
          results.push(($('#diff')).append((i + 1) + (i !== cur_scores.length - 1 ? ', ' : '')));
        } else {
          results.push(void 0);
        }
      }
      return results;
    } else {
      rnd = parseInt(guts_round.val());
      results1 = [];
      for (i = k = ref1 = rnd * 3 - 3, ref2 = rnd * 3; ref1 <= ref2 ? k < ref2 : k > ref2; i = ref1 <= ref2 ? ++k : --k) {
        if (cur_scores[i] !== cur[i - (rnd * 3 - 3)]) {
          results1.push(($('#diff')).append((i + 1) + (i !== rnd * 3 - 1 ? ', ' : '')));
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    }
  };

  request_id = 0;

  last_received = 0;

  grade = function() {
    if (verify(password.val(), id.val())) {
      request_id++;
      return $.ajax({
        url: '/grade',
        method: 'POST',
        data: {
          password: password.val(),
          round: round.val(),
          id: id.val(),
          guts_round: guts_round.val(),
          score: JSON.stringify(serialize())
        },
        dataType: 'json',
        success: (function(request_id) {
          return function(data) {
            if (request_id > last_received) {
              if (data.success) {
                ($("input[type=checkbox]")).prop('checked', false);
                refresh();
                id.val('');
              } else {
                if (data.problem === 'password') {
                  password.val('');
                  password_control.addClass('has-error');
                } else if (data.problem === 'id') {
                  id.val('');
                  id_control.addClass('has-error');
                }
              }
              return last_received = request_id;
            }
          };
        })(request_id)
      });
    }
  };

  submit.click(grade);

  refresh = function() {
    var i, j, ref;
    checkboxes.empty();
    if (round.val() !== 'guts') {
      for (i = j = 1, ref = map[round.val()]; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        checkboxes.append($("<div class='checkbox'> <label>" + i + "<input type='checkbox'></label> </div>"));
      }
      guts_round_control.addClass('hidden');
    } else {
      guts_round_control.removeClass('hidden');
      refresh_guts();
    }
    ($('#graded')).text('');
    cur_scores = [];
    return validate();
  };

  refresh_guts = function() {
    var i, j, ref, ref1;
    checkboxes.empty();
    for (i = j = ref = parseInt(guts_round.val()) * 3 - 2, ref1 = parseInt(guts_round.val()) * 3; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      checkboxes.append($("<div class='checkbox'> <label>" + i + "<input type='checkbox'></label> </div>"));
    }
    return validate();
  };

  check = function() {
    return $.ajax({
      url: '/check',
      method: 'GET',
      data: {
        round: round.val(),
        id: id.val()
      },
      dataType: 'json',
      success: function(data) {
        var scores;
        scores = data.scores;
        ($('#graded')).text(data.name);
        if (scores && scores.length > 0) {
          cur_scores = JSON.parse(scores);
        } else {
          cur_scores = [];
        }
        return validate();
      }
    });
  };

  refresh();

  round.change(refresh);

  guts_round.change(refresh_guts);

  id.keyup(check);

  checkboxes.change(validate);

}).call(this);
