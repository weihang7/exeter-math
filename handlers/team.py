import webapp2
import json

from account import User
from account import LegacyUser
from team_schema import Team
from team_schema import Individual
from team_schema import GutsTime
from base import BaseHandler

from google.appengine.api import mail
from google.appengine.ext import ndb

import datetime
import time

def get_year():
    return 2016 #datetime.datetime.today().year

# CreateTeamHandler
# The handler that listens on /register
# for signup submissions
class CreateTeamHandler(BaseHandler):
    def get(self):

        # Create and insert a record
        # for this registration.
        record = Team(
            user=self.auth.get_user_by_session()['user_id'],
            paid=False,
            year = get_year()
        )
        record.put()

        # Inform the client of success.
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'id': record.key.id()
        }))

class EditInfoHandler(BaseHandler):
    def post(self):

        # Create and insert a record
        # for this registration.
        user_id = int(self.auth.get_user_by_session()['user_id'])
        query = Individual.query(Individual.user == user_id, Individual.year == get_year())

        for member in query:
            member.key.delete()

        individuals = json.loads(self.request.get('individuals'))

        for individual in individuals:
            record = Individual(
                    name = individual['name'],
                    team = individual['team'],
                    user = user_id,
                    paid = (individual['paid'] if 'paid' in individual else False),
                    year = get_year()
            )
            record.put()

        teams = json.loads(self.request.get('teams'))

        for team in teams:
            print team
            record = Team.get_by_id(team['id'])
            record.name = team['name']
            record.put()

        user = self.user_model.get_by_id(user_id)
        user.refresh()
        user.put()

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
        user_dict = self.auth.get_user_by_session()
        if user_dict:
            user = user_dict['user_id']
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
        else:
            self.abort(403)

class AdminListHandler(BaseHandler):
    def get(self):
        teams = {}
        individuals = []

        # Query all users registered this year.
        query = Individual.query(ndb.OR(Individual.year == get_year(), Individual.year == 2014))

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
            teams[team_id]['assigned_id'] = record.assigned_id
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
            team_scores = self.request.get('team_scores'),
            paid = False,
            year = 2013
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
        return []
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
            teams[team_id]['year'] = record.year
            teams[team_id]['guts_scores'] = parse_or_none(record.guts_scores)
            teams[team_id]['team_scores'] = parse_or_none(record.team_scores)

        # Inform the client of success.
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'teams': teams,
            'individuals': individuals
        }))

# For the team year emergency
class EmergencyYearReset(BaseHandler):
    def get(self):
        teams = Team.query(Team.year == get_year() - 1)

        teams_dict = {}

        for team in teams:
            team.year = get_year()
            individuals = Individual.query(Individual.team == team.key.id())
            for individual in individuals:
                individual.year = team.year
                individual.put()
            teams_dict[team.key.id()] = team.year
            team.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'teams': teams_dict
        }))

class SendEmailHandler(BaseHandler):

    def get(self):
        users = self.user_model.query(self.user_model.team_updated >= (datetime.datetime.today() - datetime.timedelta(hours=1))).fetch()
        for user in users:
            teams = {}
            individuals = []

            query = Individual.query(Individual.user == user.key.id(), Individual.year == get_year())

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
            values = teams.values()
            body = ""
            for team in values:
                body += """
%s

%s
%s
%s
%s
                """ % (team['name'], team['members'][0], team['members'][1], team['members'][2], team['members'][3])
            if len(individuals) > 0:
                body += """
Individuals

"""
                for individual in individuals:
                    body += individual + '\n'
            mail.send_mail(sender='Exeter Math Club Competition <emcc-do-not-reply@exeter-math.appspotmail.com>',
                    to=user.auth_ids[0],
                    subject='EMCC Team Information Change',
                    body="""Hi,

This email is to confirm that you have made changes to your registered teams and the list of teams and individuals registered is now:
%s

Best,
Exeter Math Club Competition""" % (body,))

class GradeHandler(BaseHandler):

    def post(self):
        password = self.request.get('password')
        problem = ''
        success = True
        if password != 'adidasTwilight':
            success = False
            problem = 'password'
        else:
            rnd = self.request.get('round')
            _id = self.request.get('id')
            score = self.request.get('score')
            if rnd in ('speed', 'accuracy'):
                ind = Individual.query(Individual.assigned_id == _id)
                if ind.count() != 0:
                    ind = ind.fetch()[0]
                    if rnd == 'speed':
                        ind.speed_scores = score
                    else:
                        ind.accuracy_scores = score
                    ind.put()
                else:
                    success = False
                    problem = 'id'
            else:
                team = Team.query(Team.assigned_id == _id)
                if team.count() != 0:
                    team = team.fetch()[0]
                    if rnd == 'team':
                        team.team_scores = score
                    else:
                        guts_round = int(self.request.get('guts_round'))
                        if team.guts_scores is None:
                            team.guts_scores = '[]'
                        loaded = json.loads(team.guts_scores)
                        loaded[guts_round*3-3:guts_round*3] = json.loads(score)
                        team.guts_scores = json.dumps(loaded)
                    team.put()
                else:
                    success = False
                    problem = 'id'
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'success': success,
            'problem': problem
        }))

class CheckHandler(BaseHandler):

    def get(self):
        rnd = self.request.get('round')
        _id = self.request.get('id')
        name = ''
        ret = '[]'
        if rnd in ('speed', 'accuracy'):
            ind = Individual.query(Individual.assigned_id == _id)
            if ind.count() > 0:
                ind = ind.fetch()[0]
                name = ind.name + '|' + Team.get_by_id(ind.team).name
                if rnd == 'speed':
                    ret = ind.speed_scores
                else:
                    ret = ind.accuracy_scores
        else:
            team = Team.query(Team.assigned_id == _id)
            if team.count() > 0:
                team = team.fetch()[0]
                name = team.name
                if rnd == 'team':
                    ret = team.team_scores
                else:
		    if team.guts_scores is None:
                        ret = []
                    else:
                        ret = team.guts_scores
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'scores': ret,
            'name': name
        }))

class GutsRoundUpdateHandler(BaseHandler):
    def get(self):
        teams = Team.query(Team.year == get_year()).fetch()
        ret = []
        for team in teams:
            if team.name is not None and team.assigned_id is not None and len(team.assigned_id) > 0:
                ret.append({
                    'name': team.name,
                    'scores': team.guts_scores
                    })
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'teams': ret
        }))

class StartGutsHandler(BaseHandler):
    def get(self):
        ndb.delete_multi(GutsTime.query().fetch(keys_only=True))
        record = GutsTime(endTime = datetime.datetime.fromtimestamp(time.time()) + datetime.timedelta(seconds=4500))
        record.put()

class GutsTimeSyncHandler(BaseHandler):
    def get(self):
        time_end = int(GutsTime.query().fetch()[0].endTime.strftime("%s"))
        time_now = int(time.time())
        ret = {
                'time_end': time_end,
                'time_now': time.time(),
                'time': time_end - time_now
        }
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(ret))

class ListScoresHandler(BaseHandler):
    def get(self):
        teams = Team.query(Team.year == get_year()).fetch()
        individuals = Individual.query(Individual.year == get_year()).fetch()
        teamsDict = {}

        for team in teams:
            if team.assigned_id is not None and len(team.assigned_id) > 0:
                teamsDict[team.key.id()] = {
                    'id': team.assigned_id,
                    'name': team.name,
                    'team_scores': parse_or_none(team.team_scores),
                    'guts_scores': parse_or_none(team.guts_scores),
                    'members': []
                }

        for individual in individuals:
            if individual.team > 0 and individual.team in teamsDict:
                print(individual.speed_scores is not None)
                teamsDict[individual.team]["members"].append({
                    'name': individual.name,
                    'id': individual.assigned_id,
                    'speed_scores': json.loads(individual.speed_scores if (individual.speed_scores is not None) else 'null'),
                    'accuracy_scores': json.loads(individual.accuracy_scores if (individual.accuracy_scores is not None) else 'null')
                })

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(teamsDict))

'''
# Obsoleted autoassign

class AssignIdsHandler(BaseHandler):
    def get(self):
        teams = Team.query(Team.year == get_year()).fetch()
        individuals = Individual.query(Individual.year == get_year()).fetch()

        ids = json.loads(self.request.get('room_ids'))
        assignationDict = {}

        for team in teams:
            team.assigned_id = ids.pop()
            assignationDict[team.key.id()] = {
                'id': str(team.assigned_id),
                'n': 0
            }
            team.put()

        for individual in individuals:
            if individual.team > 0:
                individual.assigned_id = str(assignationDict[individual.team]['id']) + '-' + str(assignationDict[individual.team]['n'])
                assignationDict[individual.team]['n'] += 1
                individual.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(assignationDict))
'''

class AssignIdHandler(BaseHandler):
    def get(self):
        old_id = int(self.request.get('primary_id'))
        new_id = self.request.get('assigned_id')
        team = Team.get_by_id(old_id)
        team.assigned_id = new_id
        team.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({'success': True}))

class AssignIndivIdHandler(BaseHandler):
    def get(self):
        old_id = int(self.request.get('primary_id'))
        new_id = self.request.get('assigned_id')
        individual = Individual.get_by_id(old_id)
        individual.assigned_id = new_id
        individual.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({'success': True}))

class AdminEditHandler(BaseHandler):
    def get(self):
        individual = Individual.get_by_id(int(self.request.get('id')))
        individual.name = self.request.get('name')
        individual.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(individual.serialize()))

class EditNameHandler(BaseHandler):
    def get(self):
        team = Team.get_by_id(int(self.request.get('id')))
        team.name = self.request.get('name')
        team.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({'success': True}))

class IndivTeamHandler(BaseHandler):
    def get(self):
        ids = json.loads(self.request.get('ids'))
        record = Team(
            user = -1,
            paid = False,
            name = "Individual Team",
            year = get_year()
        )
        record.put()
        for i in ids:
            indiv = Individual.get_by_id(i)
            indiv.team = record.key.id()
            indiv.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({"success": True}))
