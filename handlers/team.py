import webapp2
import json

from account import User
from account import LegacyUser
from team_schema import Team
from team_schema import Individual
from base import BaseHandler

from google.appengine.ext import ndb

import datetime

def get_year():
    return datetime.datetime.today().year

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
        query = Individual.query(Individual.user == user, Individual.year == get_year())

        for member in query:
            member.key.delete()

        individuals = json.loads(self.request.get('individuals'))

        for individual in individuals:
            record = Individual(
                    name=individual['name'],
                    team=individual['team'],
                    user=user,
                    paid=(individual['paid'] if 'paid' in individual else False),
                    year=get_year()
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
        query = Individual.query(Individual.user == user, Individual.year == get_year())

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
            teams[team_id]['paid'] = record.paid

        # Inform the client of success.
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'teams': teams,
            'individuals': individuals
        }))

class AdminListHandler(BaseHandler):
    def get(self):
        teams = {}
        individuals = []

        # Create and insert a record
        # for this registration.
        query = Individual.query(Individual.year == get_year())

        for member in query:
            if member.team != -1:
                if member.team in teams:
                    teams[member.team]['members'].append(member.serialize())
                else:
                    teams[member.team] = {
                        'members': [member.serialize()]
                    }
            else:
                individuals.append({
                    'name': member.serialize(),
                    'user': member.team
                })

        for team_id in teams:
            record = Team.get_by_id(team_id)
            teams[team_id]['name'] = record.name
            teams[team_id]['id'] = int(team_id)
            teams[team_id]['paid'] = record.paid
            teams[team_id]['user'] = record.user

        users_query = User.query()

        users = {}

        for user in users_query:
            users[user.key.id()] = user.auth_ids[0]

        # Inform the client of success.
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'teams': teams,
            'individuals': individuals,
            'users': users
        }))

class AddLegacyTeamHandler(BaseHandler):
    def post(self):
        user_email = self.request.get('user_email')

        user_query = LegacyUser.query(LegacyUser.email == user_email)
        user = user_query.get()
        user_id = None

        if user is None:
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps({
                'success': False
            }))
            return
        else:
            user_id = user.key.id()

        team_name = self.request.get('team_name')
        members = json.loads(self.request.get('members'))

        team = Team(
            name = team_name,
            user = user_id,
            guts_scores = self.request.get('guts_scores'),
            team_scores = self.request.get('team_scores')
        )
        team.put()

        team_id = team.key.id()

        for member in members:
            individual = Individual(
                name = member['name'],
                team = team_id,
                user = user_id,
                paid = True,
                year = 2013,

                speed_scores = member['speed_scores'],
                accuracy_scores = member['accuracy_scores']
            )

            individual.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'success': True
        }))

def parse_or_none(string):
    if string is None:
        return string
    else:
        return json.loads(string)

class ListAllHandler(BaseHandler):
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
                    teams[member.team]['members'].append(member.serialize_full())
                else:
                    teams[member.team] = {
                       'members': [member.serialize_full()]
                    }
            else:
                individuals.append(member.serialize_full())

        for team_id in teams:
            record = Team.get_by_id(team_id)
            teams[team_id]['name'] = record.name
            teams[team_id]['id'] = int(team_id)
            teams[team_id]['paid'] = record.paid
            teams[team_id]['guts_scores'] = parse_or_none(record.guts_scores)
            teams[team_id]['team_scores'] = parse_or_none(record.team_scores)

        # Inform the client of success.
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'teams': teams,
            'individuals': individuals
        }))
