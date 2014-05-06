import os

from base import BaseHandler
import jinja2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), '..', 'static')),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class ResetPasswordHandler(BaseHandler):
    def get(self, *args, **kwargs):
        user_id = kwargs['user_id']
        signup_token = kwargs['signup_token']
        user, ts = self.user_model.get_by_auth_token(int(user_id), signup_token, 'signup')

        if not user:
            self.abort(404)
        params = {
                'token': signup_token
        }
        template = JINJA_ENVIRONMENT.get_template('reset.html')
        self.response.out.write(template.render(params))

class StaticFileHandler(BaseHandler):
    def get(self, filename='index'):
        auth = self.auth
        params = {
                'user': auth.get_user_by_session()
        }
        template = JINJA_ENVIRONMENT.get_template(filename + '.html')
        self.response.out.write(template.render(params))
