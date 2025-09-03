## SignIn Callback 

🔍 SignIn callback triggered

## Sent By GitHub

👤 User: {
  id: 'cmf208v5g0000hyigqpvso4po',  
  name: 'Sudhanva',
  email: 'sudhanvapops@gmail.com',
  image: 'https://avatars.githubusercontent.com/u/88150042?v=4',
  role: 'USER',
  createdAt: 2025-09-02T03:44:51.125Z,
  updatedAt: 2025-09-02T03:44:51.125Z
}

🔗 Account: {
  a_t: 'secreate',
  token_type: 'bearer',
  scope: 'read:user,user:email',
  provider: 'github',
  type: 'oauth',
  providerAccountId: '88150042'
}

## DB stored 
Account
{
    "_id": "cmf208v5h0001hyigl58k93vm",
    "user_id": "cmf208v5g0000hyigqpvso4po",
    "type":"oauth",
    "provider":"github",
    "provider_account_id":"88150042",
    "a_t":"secreat",
    "token_type":"bearer",
    "scope":"read:user,
    user:email"
    }

## New User Creation with google 

 SignIn callback triggered
👤 User: {
  id: '3fc1ea48-e02a-43ae-b7a5-d91cfb72d005',
  <!-- After creation looged in second time -->
  <!-- id: 'cmf3e8g5d0000hy207eij361n', -->
  name: 'Sudhanva S',
  email: 'sudhanvahackathon@gmail.com',
  image: 'https://lh3.googleusercontent.com/a/ACg8ocLhE1r6NUmjnXhllqe_NrVj3AgL-86soZ28n9diOGFy9Y3LCw=s96-c'
}

🔗 Account: {
  a_t: "secreat,
  expires_in: 3599,
  scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
  token_type: 'bearer',
  id_token: ""
  expires_at: 1756872239,
  provider: 'google',
  type: 'oidc',
  providerAccountId: '100669807968721432533'
}

🔍 Existing user: Not found
➕ Creating new user...
✅ New user created: cmf3e8g5d0000hy207eij361n
✅ SignIn callback completed successfully