import json
import time
import datetime

from google.appengine.api import mail
from google.appengine.ext import ndb
import webapp2_extras.appengine.auth.models
from webapp2_extras import security
from webapp2_extras import auth

from webapp2_extras.auth import InvalidAuthIdError
from webapp2_extras.auth import InvalidPasswordError

from base import BaseHandler

class User(webapp2_extras.appengine.auth.models.User):
    def set_password(self, password):
        self.password = security.generate_password_hash(password)

    @classmethod
    def get_by_auth_token(cls, user_id, token, subject='auth'):
        token_key = cls.token_model.get_key(user_id, subject, token)
        user_key = ndb.Key(cls, user_id)
        valid_token, user = ndb.get_multi([token_key, user_key])
        if valid_token and user:
            timestamp = int(time.mktime(valid_token.created.timetuple()))
            return user, timestamp
        return None, None

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
        
        user_data = self.user_model.create_user(email,
                password_raw=password, institution=institution)

        success = True
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

        try:
            u = self.auth.get_user_by_password(email, password, remember=True, save_session=True)
        except (InvalidAuthIdError, InvalidPasswordError) as e:
            success = False
            problem = str(type(e))

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

            mail.send_mail(sender='Exeter Math Club Competition <emcc-do-not-reply@exeter-math.appspot.com>',
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

        user, ts = self.user_model.get_by_auth_token(user_id, old_token, 'signup')
        user.set_password(password)
        user.put()

        # remove signup token
        self.user_model.delete_signup_token(user.get_id(), old_token)

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps({
            'success': True
        }))

class CleanupHandler(BaseHandler):

    def get(self):
        expiredTokens = User.token_model.query(User.token_model.created <= (datetime.datetime.utcnow() - datetime.timedelta(1)))
        while expiredTokens.count() > 0:
            keys = expiredTokens.fetch(100, keys_only=True)
            ndb.delete_multi(keys)
