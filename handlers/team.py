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

    def serialize(self):
        return self.name

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
        user = int(self.auth.get_user_by_session()['user_id'])
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

class ListHandler(BaseHandler):
    def get(self):
        teams = {}
        individuals = []

        # Create and insert a record
        # for this registration.
        user = self.auth.get_user_by_session()['user_id']
        query = Individual.query(Individual.user == user)

        for member in query:
            if member.team != -1:
                if member.team in teams:
                    teams[member.team]['members'].append(member.serialize())
                else:
                    teams[member.team] = {
                        'members': [member.serialize()]
                    }
            else:
                individuals.append(member.serialize())

        for team_id in teams:
            record = Team.get_by_id(team_id)
            teams[team_id]['name'] = record.name
            teams[team_id]['id'] = int(team_id)
        
        # Inform the client of success.
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'teams': teams,
            'individuals': individuals
        }))
