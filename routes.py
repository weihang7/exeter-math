import webapp2

config = {}
config['webapp2_extras.auth'] = {
    'user_model': 'handlers.account.User',
    'user_attributes': ['institution']
}
config['webapp2_extras.sessions'] = {
    'secret_key': 'ikrm~BbMF2/7v]yljeL|v^9K}]S+-@4?p-;^cCzrG9RjYda}is`:}=(n<S~o.J,z',
}

application = webapp2.WSGIApplication([
    ('/register', 'handlers.account.RegisterHandler'),
    ('/login', 'handlers.account.LoginHandler'),
    ('/create_team', 'handlers.team.CreateTeamHandler'),
    ('/edit_info', 'handlers.team.EditInfoHandler')
], debug=True, config=config)
