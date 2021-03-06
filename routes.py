import webapp2
from webapp2 import Route

config = {}
config['webapp2_extras.auth'] = {
    'user_model': 'handlers.account.User'
}
config['webapp2_extras.sessions'] = {
    'secret_key': 'ikrm~BbMF2/7v]yljeL|v^9K}]S+-@4?p-;^cCzrG9RjYda}is`:}=(n<S~o.J,z',
}

application = webapp2.WSGIApplication([
    Route('/register', 'handlers.account.RegisterHandler'),
    Route('/login', 'handlers.account.LoginHandler'),
    Route('/logout', 'handlers.account.LogoutHandler'),
    Route('/forgot', 'handlers.account.ForgotPasswordHandler'),
    Route('/create_team', 'handlers.team.CreateTeamHandler'),
    Route('/add_legacy_team', 'handlers.team.AddLegacyTeamHandler'),
    Route('/list_all', 'handlers.team.ListAllHandler'),
    Route('/edit_info', 'handlers.team.EditInfoHandler'),
    Route('/list', 'handlers.team.ListHandler'),
    Route('/admin_list', 'handlers.team.AdminListHandler'),
    Route('/reset/<user_id:\d+>-<signup_token:.+>', 'handlers.template.ResetPasswordHandler', name='reset'),
    Route('/reset', 'handlers.account.SetPasswordHandler'),
    Route('/cleanup', 'handlers.account.CleanupHandler'),
    Route('/send_emails', 'handlers.team.SendEmailHandler'),
    Route('/add_legacy', 'handlers.account.AddLegacyUserHandler'),
    Route('/grade', 'handlers.team.GradeHandler'),
    Route('/check', 'handlers.team.CheckHandler'),
    Route('/list_scores', 'handlers.team.ListScoresHandler'),
    Route('/assign_id', 'handlers.team.AssignIdHandler'),
    Route('/assign_individual_id', 'handlers.team.AssignIndivIdHandler'),
    Route('/_emergency_year_reset', 'handlers.team.EmergencyYearReset'),
    Route('/guts_time_sync', 'handlers.team.GutsTimeSyncHandler'),
    Route('/guts_round_update', 'handlers.team.GutsRoundUpdateHandler'),
    Route('/admin_edit', 'handlers.team.AdminEditHandler'),
    Route('/admin_edit_name', 'handlers.team.EditNameHandler'),
    Route('/individual_team', 'handlers.team.IndivTeamHandler'),
    Route('/start_guts', 'handlers.team.StartGutsHandler')
], debug=True, config=config)

