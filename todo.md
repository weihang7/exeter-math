EMCC Coding Tasks
------------------
Steps 1-5 should all have associated unit tests. Unit tests should act as documentation and will be required before a step is complete. These unit tests will be included in the website build environment, and a build tracker (e.g. Travis) can be used to track coding progress from steps 1 through 5.

Steps 6-9 should each be showcased to the rest of the EMCC team before they are called complete. You will know when these steps are completed, because you or someone near you will be asked to review the site UI.

Note that not all steps are expected to take the same amount of time. The time a step should take is roughly proportional to the number of tick marks it has in the list underneath it, with the exception of steps 1 and 2. Steps 1 and 2 are expected to take extremely long, as they are core elements and will have to be constructed with great care.
------------------

1. [ ] Create api-level database interface for coach login. Operations that should be done here (implemented in this order):
  - [x] Create user
  - [x] Check user credentials
  - [ ] Edit user information (incl. password)
  - [x] Generate a password reset key
  - [x] Reset password

2. [ ] Create api-level database interface for teams. Operations that should be done here (implemented in this order):
  - [ ] Create individual
  - [ ] Create team
  - [ ] Assign individual to a team
  - [ ] Automatically create team, individuals, and assign individuals to teams when given a list of individuals and a team name
  - [ ] Delete individual
  - [ ] Delete team
  - [ ] Delete team + all associated individuals
  - [ ] Send automatic email about team registration and payment status
  - [ ] Send automatic email invoice with recieved payment information
  - [ ] Generate individual IDs (given room #s)
  - [ ] Enter/lookup payment information for a team or individual
  - [ ] Lookup individual/team by ID
  - [ ] Enter/lookup scores for individual rounds
  - [ ] Enter/lookup scores for team rounds
  - [ ] Query awards (top individuals, top per round, top per team)

3. [ ] Create cgi wrappers for coach login. CGI backends:
  - [ ] Login (given password hash)

4. [ ] Create cgi wrappers for end-user teams database. CGI backends (all require coach authentication):
  - [ ] Create individual
  - [ ] Create team
  - [ ] Assign individual to team
  - [ ] Automatically create team, individuals, and assign individuals to teams when given a list of individuals and a team name
  - [ ] Lookup scores for individuals
  - [ ] Lookup scores for teams

5. [ ] Create cgi wrappers for registration admin functions. CGI backends (all require admin authentication, using SRP):
  - [ ] Create individual
  - [ ] Create team
  - [ ] Assign individual to team
  - [ ] (re-)Generate individual IDs (given room #s)
  - [ ] Delete team + all associated individuals
  - [ ] Enter/lookup payment information for teams

6. [ ] Create front-end for user registration. Action items:
  - [x] Register new user
  - [ ] Login

7. [ ] Create front-end for team registration. Action items:
  - [ ] Create team
  - [ ] Create team from member list
  - [ ] Create individual
  - [ ] Assign individual to team

  - [ ] View individual scores
  - [ ] View team scores
  - [ ] Check team payment status

8. [ ] Create admin dashboard. Action items:
  - [ ] Create individual (will be registered under special "admin" user; used for emergencies that require manual intervention)
  - [ ] Create team
  - [ ] Assign individual to team

  - [ ] Enter payment status information
  - [ ] Delete/edit team info
  - [ ] Email the coach of a team

9. [ ] Create scoring interface. Action items:
  - [ ] Enter scores for a round
  - [ ] View currently-entered scores for a round
