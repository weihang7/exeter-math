import json

from google.appengine.ext import ndb
import webapp2_extras.appengine.auth.models
from google.appengine.ext.webapp import template
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

class LogoutHandler(BaseHandler):
    def get(self):
        self.auth.unset_session()
        self.redirect('/')
