# Tenant Actions

These are the actions that must be present in your tenant in order for the Multi-Org Manager to work.

## Post Login Actions

* Add Roles To Tokens
  This action appends the name of the roles that are assigned to a user to both the ID token and the access token. It is necessary for the ID token to have the role names appended so that the front-end application will know which pages should be rendered to the user. 

## Post User Registration Actions

* Add Default Role To Users
  This action ensures that a user always has a valid role when they accept an invitation to an organization. 