(function() {
  var check, checkboxes, cur_scores, grade, guts_round, guts_round_control, id, id_control, map, password, password_control, refresh, refresh_guts, round, serialize, submit, validate, verify;

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
    var cur, i, _i, _ref, _results;
    cur = serialize();
    ($('#diff')).text('Conflicts: ');
    _results = [];
    for (i = _i = 0, _ref = cur_scores.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (cur_scores[i] !== cur[i]) {
        _results.push(($('#diff')).append((i + 1) + ', '));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  grade = function() {
    if (verify(password.val(), id.val())) {
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
        success: function(data) {
          if (data.success) {
            ($("input[type=checkbox]")).prop('checked', false);
            return id.val('');
          } else {
            if (data.problem === 'password') {
              password.val('');
              return password_control.addClass('has-error');
            } else if (data.problem === 'id') {
              id.val('');
              return id_control.addClass('has-error');
            }
          }
        }
      });
    }
  };

  submit.click(grade);

  refresh = function() {
    var i, _i, _ref;
    checkboxes.empty();
    if (round.val() !== 'guts') {
      for (i = _i = 1, _ref = map[round.val()]; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        checkboxes.append($("<div class='checkbox'> <label>" + i + "<input type='checkbox'></label> </div>"));
      }
      return guts_round_control.addClass('hidden');
    } else {
      guts_round_control.removeClass('hidden');
      return refresh_guts();
    }
  };

  refresh_guts = function() {
    var i, _i, _ref, _ref1, _results;
    checkboxes.empty();
    _results = [];
    for (i = _i = _ref = parseInt(guts_round.val()) * 3 - 2, _ref1 = parseInt(guts_round.val()) * 3; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
      _results.push(checkboxes.append($("<div class='checkbox'> <label>" + i + "<input type='checkbox'></label> </div>")));
    }
    return _results;
  };

  check = function() {
    return $.ajax({
      url: '/check',
      method: 'GET',
      data: {
        round: round.val(),
        id: id.val(),
        guts_round: guts_round.val()
      },
      success: function(data) {
        var scores;
        scores = JSON.parse(data.scores);
        if (scores.length > 0) {
          ($('#graded')).text(data.name);
          cur_scores = scores;
          return validate();
        } else {
          return ($('#graded')).text('');
        }
      }
    });
  };

  refresh();

  round.change(refresh);

  guts_round.change(refresh_guts);

  id.keyup(check);

  checkboxes.change(validate);

}).call(this);
