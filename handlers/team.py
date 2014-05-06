import webapp2
import json

from account import User
from base import BaseHandler

from google.appengine.ext import ndb

class Team(ndb.Model):
    name = ndb.StringProperty(indexed=False)
    user = ndb.KeyProperty(kind=User, indexed=True)

class Individual(ndb.Model):
    name = ndb.StringProperty(indexed=False)
    team = ndb.KeyProperty(kind=Team, indexed=True)
    user = ndb.KeyProperty(kind=User, indexed=True)

# CreateTeamHandler
# The handler that listens on /register
# for signup submissions
class CreateTeamHandler(BaseHandler):
    def get(self):
        
        # Create and insert a record
        # for this registration.
        record = Team(user=self.request.get('user'))
        record.put()
        
        # Inform the client of success.
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'id': record.key.id()
        }))

class EditInfoHandler(BaseHandler):
    def get(self):
        
        # Create and insert a record
        # for this registration.
        user = self.request.get('user')
        query = Individual.query(Individual.user == user)

        for member in query:
            member.key.delete()

        individuals = json.loads(self.request.get('individuals'))

        for individual in individuals:
            record = Individual(
                    name=individual['name'],
                    team=individual['team'],
                    user=user
            )
            record.put()

        teams = json.loads(self.request.get('teams'))

        for team in teams:
            record = Team.get_by_id(team['id'])
            record.name = team['name']
            record.put()
        
        # Inform the client of success.
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'success': True
        }))
