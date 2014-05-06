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

config = {}
config['webapp2_extras.auth'] = {
    'user_model': 'handlers.account.User',
    'user_attributes': ['institution']
}
config['webapp2_extras.sessions'] = {
    'secret_key': 'ikrm~BbMF2/7v]yljeL|v^9K}]S+-@4?p-;^cCzrG9RjYda}is`:}=(n<S~o.J,z',
}

class RegisterTest(unittest.TestCase):
  # First define an email and password to be registered.
  email = 'example@example.com'
  password = 'example'
  institution = 'example'

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
    params = {'email': self.email, 'password': self.password, 'institution': self.institution}

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
    ret = User.get_by_auth_password(self.email, self.password)
    self.assertEqual(ret.auth_ids[0], self.email)
    self.assertEqual(ret.institution, self.institution)

class LoginTest(unittest.TestCase):
  # First define an email and password to be registered.
  email = 'example@example.com'
  password = 'example'
  institution = 'example'

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
    User.create_user(self.email, password_raw=self.password, institution=self.institution)

    params = {'email': self.email, 'password': self.password}
    response = self.testapp.post('/login', params)
    # The login request should succeed.
    self.assertEqual(response.status_int, 200)
    self.assertEqual(response.content_type, 'application/json')
    self.assertTrue(json.loads(response.normal_body)[u'success'])

    params = {'email': self.email, 'password': 'wrong_password'}
    response = self.testapp.post('/login', params)
    # The login request with a wrong password should fail.
    self.assertEqual(response.status_int, 200)
    self.assertEqual(response.content_type, 'application/json')
    self.assertFalse(json.loads(response.normal_body)[u'success'])

class ResetTest(unittest.TestCase):
  # First define an email and password to be registered.
  email = 'example@example.com'
  password = 'example'
  institution = 'example'

  def setUp(self):
    app = routes.application
    self.testapp = webtest.TestApp(app, cookiejar=cookielib.CookieJar())
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
    User.create_user(self.email, password_raw=self.password, institution=self.institution)

    params = {'email': self.email}
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

    messages = self.mail_stub.get_sent_messages(to=self.email)
    # There should be only one email sent.
    self.assertEqual(1, len(messages))
    email = urllib.unquote(messages[0].body.decode())
    url = email.split('\n')[3]
    # Get the cookie
    self.testapp.get(url)
    token = url.split('-')[1]

    params = {'token': token, 'password': 'new_password'}
    response = self.testapp.post('/reset', params)
    # The reset request should succeed.
    self.assertEqual(response.status_int, 200)
    self.assertEqual(response.content_type, 'application/json')
    self.assertTrue(json.loads(response.normal_body)[u'success'])

