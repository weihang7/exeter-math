from google.appengine.ext import testbed
import webapp2
import webtest
import cookielib
import urllib
import unittest
import json
import imp
import routes
from handlers.account import User
from webapp2_extras import auth

config = {}
config['webapp2_extras.auth'] = {
    'user_model': 'handlers.account.User',
    'user_attributes': ['institution']
}
config['webapp2_extras.sessions'] = {
    'secret_key': 'ikrm~BbMF2/7v]yljeL|v^9K}]S+-@4?p-;^cCzrG9RjYda}is`:}=(n<S~o.J,z',
}

# First define an email and password to be registered.
email = 'example@example.com'
password = 'example'
institution = 'example'

class RegisterTest(unittest.TestCase):
  def setUp(self):
    app = routes.application
    self.testapp = webtest.TestApp(app)
    self.testbed = testbed.Testbed()
    self.testbed.activate()
    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()

  def tearDown(self):
     self.testbed.deactivate()
  
  def testRegister(self):
    params = {'email': email, 'password': password, 'institution': institution}

    # Pass those values to the handler.
    response = self.testapp.post('/register', params)
    # The registration request should return true.
    self.assertEqual(response.status_int, 200)
    self.assertEqual(response.content_type, 'application/json')
    self.assertTrue(json.loads(response.normal_body)[u'success'])

    # It should fail when the email is already used.
    response = self.testapp.post('/register', params)
    # The registration request should return false.
    self.assertEqual(response.status_int, 200)
    self.assertEqual(response.content_type, 'application/json')
    self.assertFalse(json.loads(response.normal_body)[u'success'])

    # Verify that the passed-in values are actually stored in database.
    ret = User.get_by_auth_password(email, password)
    self.assertEqual(ret.auth_ids[0], email)
    self.assertEqual(ret.institution, institution)

class LoginTest(unittest.TestCase):
  def setUp(self):
    app = routes.application
    self.testapp = webtest.TestApp(app)
    self.testbed = testbed.Testbed()
    self.testbed.activate()
    # Initialize the testing environment
    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()

  def tearDown(self):
     self.testbed.deactivate()
  
  def testLogin(self):
    # Register the user first.
    User.create_user(email, password_raw=password, institution=institution)

    params = {'email': email, 'password': password}
    response = self.testapp.post('/login', params)
    # The login request should succeed.
    self.assertEqual(response.status_int, 200)
    self.assertEqual(response.content_type, 'application/json')
    self.assertTrue(json.loads(response.normal_body)[u'success'])

    params = {'email': email, 'password': 'wrong_password'}
    response = self.testapp.post('/login', params)
    # The login request with a wrong password should fail.
    self.assertEqual(response.status_int, 200)
    self.assertEqual(response.content_type, 'application/json')
    self.assertFalse(json.loads(response.normal_body)[u'success'])

class ResetTest(unittest.TestCase):

  def setUp(self):
    self.app = routes.application
    self.testapp = webtest.TestApp(self.app)
    self.testbed = testbed.Testbed()
    self.testbed.activate()
    # Initialize the testing environment
    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()
    self.testbed.init_mail_stub()
    self.mail_stub = self.testbed.get_stub(testbed.MAIL_SERVICE_NAME)

  def tearDown(self):
     self.testbed.deactivate()
  
  def testReset(self):
    # Register the user first.
    User.create_user(email, password_raw=password, institution=institution)

    params = {'email': email}
    response = self.testapp.post('/forgot', params)
    # The forgot password request should succeed.
    self.assertEqual(response.status_int, 200)
    self.assertEqual(response.content_type, 'application/json')
    self.assertTrue(json.loads(response.normal_body)[u'success'])

    params = {'email': 'nonexistent_email@na.na'}
    response = self.testapp.post('/forgot', params)
    # The forgot password request with nonexistent email should fail.
    self.assertEqual(response.status_int, 200)
    self.assertEqual(response.content_type, 'application/json')
    self.assertFalse(json.loads(response.normal_body)[u'success'])

    messages = self.mail_stub.get_sent_messages(to=email)
    # There should be only one email sent.
    self.assertEqual(1, len(messages))
    content = urllib.unquote(messages[0].body.decode())
    url = content.split('\n')[3]
    data = url.split('/')[4]
    user_id, token = data.split('-')

    params = {'id': user_id, 'token': token, 'password': 'new_password'}
    response = self.testapp.post('/reset', params)
    # The reset request should succeed.
    self.assertEqual(response.status_int, 200)
    self.assertEqual(response.content_type, 'application/json')
    self.assertTrue(json.loads(response.normal_body)[u'success'])

    user = auth.get_store(app=self.app).validate_password(email, 'new_password')
    self.assertIsNotNone(user)

