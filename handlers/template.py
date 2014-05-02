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
        self.auth.set_session(self.auth.store.user_to_dict(user), remember=True)
        params = {
                'user': user,
                'token': signup_token
        }
        template = JINJA_ENVIRONMENT.get_template('reset.html')
        self.response.out.write(template.render(params))
