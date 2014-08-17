import sqlite3
import requests

with sqlite3.connect('auth.db') as conn:
    c = conn.cursor();
    c.execute("SELECT * FROM users")
    for user in c:
        if user[6] is not None:
            print 'Updoading:' + user[6]
            payload = {
                    'salt': str(user[1]),
                    'hash': user[2],
                    'email': user[6],
                    'institution': user[3]
            }
            r = requests.post('http://localhost:8080/add_legacy', data=payload)
