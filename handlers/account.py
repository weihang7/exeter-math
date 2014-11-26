import json
import time
import hashlib
import datetime

from team_schema import Team
from team_schema import Individual

from google.appengine.api import mail
from google.appengine.ext import ndb
import sys
sys.modules['ndb'] = ndb
import webapp2_extras.appengine.auth.models
from webapp2_extras import security

from webapp2_extras.auth import InvalidAuthIdError
from webapp2_extras.auth import InvalidPasswordError

from base import BaseHandler

class User(webapp2_extras.appengine.auth.models.User):
    team_updated = ndb.DateTimeProperty()

    def set_password(self, password):
        self.password = security.generate_password_hash(password)

    def refresh(self):
        self.team_updated = datetime.datetime.today()

    @classmethod
    def get_by_auth_token(cls, user_id, token, subject='auth'):
        token_key = cls.token_model.get_key(user_id, subject, token)
        user_key = ndb.Key(cls, user_id)
        valid_token, user = ndb.get_multi([token_key, user_key])
        if valid_token and user:
            timestamp = int(time.mktime(valid_token.created.timetuple()))
            return user, timestamp
        return None, None

class LegacyUser(ndb.Model):
    email = ndb.StringProperty()
    salt = ndb.StringProperty()
    hash = ndb.StringProperty()
    institution = ndb.StringProperty()

# Decorator for requiring login.
def login_required(handler):
    def check_login(self, *args, **kwargs):
        auth = self.auth
        if not auth.get_user_by_session():
            self.redirect('/login.html', abort=True)
        else:
            return handler(self, *args, **kwargs)

    return check_login

class RegisterHandler(BaseHandler):
    def post(self):
        email = self.request.get('email')
        password = self.request.get('password')
        institution = self.request.get('institution')
        success = True

        if LegacyUser.query(LegacyUser.email == email).count():
            success = False
        else:
            user_data = self.user_model.create_user(email,
                    password_raw=password, institution=institution)

            if not user_data[0]:
                success = False
            else:
                self.auth.set_session(self.auth.store.user_to_dict(user_data[1]), remember=True)

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'success': success
        }))

class LoginHandler(BaseHandler):
    def post(self):
        email = self.request.get('email')
        password = self.request.get('password')

        success = True
        problem = ""
        query = LegacyUser.query(LegacyUser.email == email)

        if query.count() == 0:
            try:
                u = self.auth.get_user_by_password(email, password, remember=True, save_session=True)
                print u
            except (InvalidAuthIdError, InvalidPasswordError) as e:
                success = False
                problem = str(type(e))
        else:
            user = query.get()
            salt = user.salt
            _hash = user.hash
            hashfun = hashlib.sha512()
            hashfun.update(salt)
            hashfun.update(password.encode())
            hashval = hashfun.hexdigest()
            if hashval == _hash:
                success = True
                user_data = self.user_model.create_user(email,
                    password_raw=password, institution=user.institution)
                if not user_data[0]:
                    success = False
                else:
                    # Re-attribute any teams belonging to the legacy user
                    # to the new user.
                    query = Team.query(Team.user == user.key.id())
                    for team in query:
                        print 'Reattributing ' + team.name
                        team.user = user_data[1].key.id()
                        team.put()

                    query = Individual.query(Individual.user == user.key.id())
                    for individual in query:
                        print 'Reattributing ' + individual.name
                        individual.user = user_data[1].key.id()
                        individual.put()

                    self.auth.set_session(self.auth.store.user_to_dict(user_data[1]), remember=True)
                user.key.delete()
            else:
                success = False
                problem = 'InvalidPasswordError'

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'success': success,
            'problem': problem
        }))

class ForgotPasswordHandler(BaseHandler):
    def post(self):
        email = self.request.get('email')

        success = True
        user = self.user_model.get_by_auth_id(email)
        if not user:
            success = False
        else:
            user_id = user.get_id()
            token = self.user_model.create_signup_token(user_id)

            print token
            print 'Visit: ' + self.uri_for('reset', user_id=user_id, signup_token=token, _full=True)

            mail.send_mail(sender='Exeter Math Club Competition <emcc-do-not-reply@exeter-math.appspotmail.com>',
                    to=email,
                    subject='EMCC Reset Password',
                    body="""Hi,

Thank you for contacting us. Click the link below to reset your password. This link is valid for one use only.
%s

Best,
Exeter Math Club Competition""" % self.uri_for('reset', user_id=user_id, signup_token=token, _full=True))
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'success': success
        }))

class LogoutHandler(BaseHandler):
    def get(self):
        self.auth.unset_session()
        self.redirect('/')

class SetPasswordHandler(BaseHandler):

    def post(self):
        password = self.request.get('password')
        old_token = self.request.get('token')
        user_id = int(self.request.get('id'))
        success = True

        user, ts = self.user_model.get_by_auth_token(user_id, old_token, 'signup')
        print ts
        print time.time()
        if ts + 24 * 3600 < time.time():
            success = False
        else:
            user.set_password(password)
            user.put()

        # remove signup token
        self.user_model.delete_signup_token(user.get_id(), old_token)

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'success': success
        }))

class AddLegacyUserHandler(BaseHandler):

    def post(self):
        email = self.request.get('email')
        salt = self.request.get('salt')
        _hash = self.request.get('hash')
        institution = self.request.get('institution')
        query = LegacyUser.query(LegacyUser.email == email)

        if query.count() == 0:
            user = LegacyUser(email=email, salt=salt, hash=_hash, institution=institution)
            user.put()

class CleanupHandler(BaseHandler):

    def get(self):
        expiredTokens = User.token_model.query(User.token_model.created <= (datetime.datetime.utcnow() - datetime.timedelta(1)))
        while expiredTokens.count() > 0:
            keys = expiredTokens.fetch(100, keys_only=True)
            ndb.delete_multi(keys)
