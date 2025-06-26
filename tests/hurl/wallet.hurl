# ====================================================================
# Register 
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
# Login  
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
# List wallets
# ====================================================================
GET http://localhost:3000/api/wallets

HTTP 200
[Asserts]
jsonpath "$.data" count == 0


# ====================================================================
# Create wallets without data
# ====================================================================
POST http://localhost:3000/api/wallets

HTTP 400


# ====================================================================
# Create wallets
# ====================================================================
POST http://localhost:3000/api/wallets
{
  "name": "wallet name",
  "balance": 0,
  "icon": "i-tabler-wallet"
}

HTTP 201
[Asserts]
jsonpath "$.data.name" == "wallet name"
jsonpath "$.data.balance" == 0
jsonpath "$.data.icon" == "i-tabler-wallet"
[Captures]
wallet_id: jsonpath "$.data.id"


# ====================================================================
# List wallets
# ====================================================================
GET http://localhost:3000/api/wallets

HTTP 200
[Asserts]
jsonpath "$.data" count == 1


# ====================================================================
# List transactions
# ====================================================================
GET http://localhost:3000/api/transactions

HTTP 200
[Asserts]
jsonpath "$.data" count == 0


# ====================================================================
# Create wallets (2)
# ====================================================================
POST http://localhost:3000/api/wallets
{
  "name": "wallet name 2",
  "balance": 100000,
  "icon": "i-tabler-wallet"
}

HTTP 201
[Asserts]
jsonpath "$.data.name" == "wallet name 2"
jsonpath "$.data.balance" == 100000
jsonpath "$.data.icon" == "i-tabler-wallet"
[Captures]
wallet_id_2: jsonpath "$.data.id"


# ====================================================================
# List wallets
# ====================================================================
GET http://localhost:3000/api/wallets

HTTP 200
[Asserts]
jsonpath "$.data" count == 2


# ====================================================================
# List transactions
# ====================================================================
GET http://localhost:3000/api/transactions

HTTP 200
[Asserts]
jsonpath "$.data" count == 1


# ====================================================================
# Delete wallet
# ====================================================================
DELETE http://localhost:3000/api/wallets/{{wallet_id_2}}

HTTP 204


# ====================================================================
# List wallets
# ====================================================================
GET http://localhost:3000/api/wallets

HTTP 200
[Asserts]
jsonpath "$.data" count == 1


# ====================================================================
# List transactions
# ====================================================================
GET http://localhost:3000/api/transactions

HTTP 200
[Asserts]
jsonpath "$.data" count == 0


# ====================================================================
# Get wallet
# ====================================================================
GET http://localhost:3000/api/wallets/{{wallet_id}}

HTTP 200
[Asserts]
jsonpath "$.data.name" == "wallet name"
jsonpath "$.data.balance" == 0
jsonpath "$.data.icon" == "i-tabler-wallet"


# ====================================================================
# Get missing wallet
# ====================================================================
GET http://localhost:3000/api/wallets/{{newUuid}}

HTTP 404


# ====================================================================
# Update wallet
# ====================================================================
PATCH http://localhost:3000/api/wallets/{{wallet_id}}
{
  "name": "wallet new name",
  "icon": "i-tabler-brand-visa"
}

HTTP 200
[Asserts]
jsonpath "$.data.name" == "wallet new name"
jsonpath "$.data.balance" == 0
jsonpath "$.data.icon" == "i-tabler-brand-visa"
