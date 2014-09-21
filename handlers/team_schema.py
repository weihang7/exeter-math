import webapp2
import json

from base import BaseHandler

from google.appengine.ext import ndb

import datetime

class Team(ndb.Model):
    name = ndb.StringProperty(indexed=False)
    user = ndb.IntegerProperty(indexed=True)
    paid = ndb.BooleanProperty(indexed=True)
    year = ndb.IntegerProperty(indexed=True)
    assigned_id = ndb.IntegerProperty(indexed=True)

    guts_scores = ndb.StringProperty(indexed=False)
    team_scores = ndb.StringProperty(indexed=False)

class Individual(ndb.Model):
    name = ndb.StringProperty(indexed=False)
    team = ndb.IntegerProperty(indexed=True)
    user = ndb.IntegerProperty(indexed=True)
    paid = ndb.BooleanProperty(indexed=True)
    year = ndb.IntegerProperty(indexed=True)
    assigned_id = ndb.IntegerProperty(indexed=True)

    speed_scores = ndb.StringProperty(indexed=False)
    accuracy_scores = ndb.StringProperty(indexed=False)

    def serialize(self):
        return self.name

    def serialize_full(self):
        return {
            'name': self.name,
            'speed_scores': json.loads(self.speed_scores) if self.speed_scores is not None else None,
            'accuracy_scores': json.loads(self.accuracy_scores) if self.speed_scores is not None else None
        }

    def isPaid(self):
        return self.paid or Team.get_by_id(self.team).paid
