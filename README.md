
# Multi-Organization Manager Demonstration Application

The Multi-Organization Manager is meant to demonstrate the capabilities of the Auth0 platform to allow users to
manage their own organizaitons. In the past, this has been a common ask from Auth0's customers. The intent is
to provide an example appliction which permits organization managers to manage the following for their specific
organization;

    1. Branding (names, colors, logos)
    2. Organization metadata
    3. Members (user roles, invitations)
    4. Connections (databases, social connectors, enterprise connections)
    5. Multi-factor options

Since this application is NOT intended to be a production application, but is instead an example app to be shown
to potential developers, there is also a "debug" page that shows the content of ID and Access Tokens for authenticated
users of the application.

## Installation

    1. Clone this repository
```bash
git clone https://github.com/WolbachAuth0/multi-org-manager
cd multi-org-manager
```

    2. Install dependencies with npm
```bash
npm install
```

    3. In the Auth0 tenant that you wish to deploy your Multi-Org Manager application, you must perform the
following tasks. This can be done manually (e.g. via the Auth0 dashboard) or programatically (e.g with a deploy CLI).

## Environment Variables

To run this project, you will need to create environment files (listed below). The `.env` file will contain
variables which are present in every environment, while the `.env.development`, `.env.local` and 
`.env.production` files hold the environment values which are specific to each environment. 

```txt
.env
.env.development
.env.local
.env.production
```

The `.env` file contains values which are present in every environment. It must contain the following 

```txt
# values present in vue application
VUE_APP_AUTH0_CLIENT_ID=<auth0-client-id-of-org-manager-spa>
VUE_APP_AUTH0_DOMAIN=<auth0-tenant-domain>
VUE_APP_AUTH0_AUDIENCE=<identifier-of-auth0-org-manager-api>

# values present in api-server application
# client-id + secret of M2M integration with Auth0 management api
AUTH0_API_ID=<auth0-client-id-m2m>
AUTH0_API_CLIENT_SECRET=<auth0-client-secret-m2m>
```

Then, the `.env.development`, `.env.local` and `.env.production` files should contain the following

```txt
# Environment vars present only when built for <environment> (enviroment = development, local or production)
NODE_ENV=<environment>
VUE_APP_MODE=<environment>
VUE_APP_API_HOST=<base-url-for-api-server-in-environment>
VUE_APP_DOMAIN=<base-url-for-vue-app-in-environment>
```

## Demo

A demonstration of this application is live [here](https://multi-org-manager.herokuapp.com/). But you'll need an 
invitation from one of the Organization's manager's to login.

To host a version of this applicaion on your own local machine, make sure that your Auth0 tenant is setup and that your
environment files are correct. To start the Vue.js application locally, run
```bash
npm run dev-front
```
and to start the api server locally run
```bash
npm run dev-api
```

## References

This application has two components - a Vue.js client application and an Express.js API server application.
 - [Vuetify.js](https://vuetifyjs.com/)
 - [Express.js](https://expressjs.com/)
 - [Auth0 Vue.js SPA Quickstart](https://auth0.com/docs/quickstart/spa/vuejs)
 - [Auth0 Express Quickstart](https://auth0.com/docs/quickstart/backend/nodejs/01-authorization)
 - [Auth0 Management API Docs](https://auth0.com/docs/api/management/v2)

## Authors

- [@aaron.wolbach](https://github.com/WolbachAuth0)

