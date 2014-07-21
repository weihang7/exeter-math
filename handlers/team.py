import webapp2
import json

from account import User
from base import BaseHandler

from google.appengine.ext import ndb

class Team(ndb.Model):
    name = ndb.StringProperty(indexed=False)
    user = ndb.IntegerProperty(indexed=True)

class Individual(ndb.Model):
    name = ndb.StringProperty(indexed=False)
    team = ndb.IntegerProperty(indexed=True)
    user = ndb.IntegerProperty(indexed=True)

# CreateTeamHandler
# The handler that listens on /register
# for signup submissions
class CreateTeamHandler(BaseHandler):
    def get(self):

        # Create and insert a record
        # for this registration.
        record = Team(user=self.auth.get_user_by_session()['user_id'])
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
        user = self.auth.get_user_by_session()['user_id']
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
            print team
            record = Team.get_by_id(team['id'])
            record.name = team['name']
            record.put()
        
        # Inform the client of success.
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'success': True
        }))
