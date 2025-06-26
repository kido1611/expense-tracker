# ====================================================================
# Register without data
# ====================================================================
POST http://localhost:3000/api/auth/register

HTTP 400


# ====================================================================
# Register with data
# ====================================================================
POST http://localhost:3000/api/auth/register
{
  "name": "name",
  "email": "{{newUuid}}@local.host",
  "password": "password",
  "passwordConfirmation": "password"
}

HTTP 201
[Captures]
user_email: jsonpath "$.data.email"
user_name: jsonpath "$.data.name"


# ====================================================================
# Register with same email 
# ====================================================================
POST http://localhost:3000/api/auth/register
{
  "name": "name",
  "email": "{{user_email}}",
  "password": "password",
  "passwordConfirmation": "password"
}

HTTP 409


# ====================================================================
# Login without data
# ====================================================================
POST http://localhost:3000/api/auth/login

HTTP 400
[Asserts]
cookie "nuxt-session" not exists


# ====================================================================
# Login with incorrect credential 
# ====================================================================
POST http://localhost:3000/api/auth/login
{
  "email": "{{newUuid}}@local.test",
  "password": "password"
}

HTTP 401
[Asserts]
cookie "nuxt-session" not exists


# ====================================================================
# Login with correct credential 
# ====================================================================
POST http://localhost:3000/api/auth/login
{
  "email": "{{user_email}}",
  "password": "password"
}

HTTP 200
[Asserts]
cookie "nuxt-session" exists
jsonpath "$.data.email" == {{user_email}}
jsonpath "$.data.name" == {{user_name}}


# ====================================================================
# Logout
# ====================================================================
DELETE http://localhost:3000/api/_auth/session

HTTP 200
[Asserts]
cookie "nuxt-session" exists
cookie "nuxt-session[Value]" == ""


# ====================================================================
# Logout Again
# ====================================================================
DELETE http://localhost:3000/api/_auth/session

HTTP 200
[Asserts]
cookie "nuxt-session" exists
cookie "nuxt-session[Value]" == ""
