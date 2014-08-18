import sqlite3
import requests
import json

def dictToArray(d):
    if d is not None:
        array = [0]*len(d)
        for key in d:
            array[int(key) - 1] = d[key]

        print array

        return array
    else:
        return None

with sqlite3.connect('teams.db') as conn:
  with sqlite3.connect('auth.db') as uconn:
    with sqlite3.connect('scores.db') as sconn:
      c = conn.cursor();
      c.execute("SELECT * FROM teams")

      for team in c:
        u = uconn.cursor()
        u.execute("SELECT email FROM users WHERE username=?", (team[1],))

        user = u.fetchone()

        members = json.loads(team[3])

        members_dict = []

        index = 1
        for member in members:

          s = sconn.cursor()
          s.execute("SELECT answers FROM speed WHERE indiv_id=?", (str(team[0]) + '-' + str(index),))
          speed_answer = s.fetchone()

          if speed_answer is not None:
              speed_answer = speed_answer[0]
              s = sconn.cursor()
              s.execute("SELECT answers FROM accuracy WHERE indiv_id=?", (str(team[0]) + '-' + str(index),))
              accuracy_answer = s.fetchone()

              if accuracy_answer is not None:
                  accuracy_answer = accuracy_answer[0]

                  if accuracy_answer is not None and speed_answer is not None:
                      members_dict.append({
                        'name': member,
                        'speed_scores': json.dumps(dictToArray(json.loads(speed_answer))),
                        'accuracy_scores': json.dumps(dictToArray(json.loads(accuracy_answer)))
                      })

              index += 1

        s = sconn.cursor()
        s.execute("SELECT answers FROM guts WHERE team_id=?", (str(team[0]),))
        guts_answer = s.fetchone()

        if guts_answer is not None:
            guts_answer = guts_answer[0]

            s = sconn.cursor()
            s.execute("SELECT answers FROM team WHERE team_id=?", (str(team[0]),))

            team_answer = s.fetchone()
            if team_answer is not None:
                team_answer = team_answer[0]

                if user is not None and guts_answer is not None and team_answer is not None:
                  print 'Uploading: ' + team[2]

                  payload = {
                    'user_email': user[0],
                    'team_name': team[2],
                    'members': json.dumps(members_dict),
                    'guts_scores': json.dumps(dictToArray(json.loads(guts_answer))),
                    'team_scores': json.dumps(dictToArray(json.loads(team_answer)))
                  }

                  r = requests.post('http://exeter-math.appspot.com/add_legacy_team', data=payload)
