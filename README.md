# docker-jwt-cookie-setter

Extremely simplistic application that allows you to set a JWT in a user's
cookie. Only to be used for development purposes.

Simply volume mount any json files into /app/users (see users.json for an
example), then navigate to: <docker-host-address>/cookies/<json_file>. For
example: http://localhost:3000/cookies/sample. Runs on port 3000.

## Environment variables

* COOKIE_DOMAIN
* JWT_SIGNING_KEY
* JWT_ENCRYPTION_KEY
* COOKIE_NAME
* `COOKIE_EXPIRY` In minutes
