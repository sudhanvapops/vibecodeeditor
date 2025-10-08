### State Full and State Less

State -> Data

Stored -> State Full


### State Full

First User Logins 
Server checks if the Username and password is correct

1. Session Id -> Created when successfull
Session Contains ->Name, Id, Email, Role etc what are required
meaning we rember who is signed in and all


The Data above is stored inside the DB/Memory

### Pros and Cons

<!-- Pros -->
- Used in Banks, etc
- For short term Authentication / Session 
    Eg: 20 - 30 min

- Can Be Revoked anytime
    - Means You can delete the session id whom it belongs and data in db
    - To remove all the users who are loged in 
    - You can controll session from backend


<!-- Disadvantage -->
- Scalability cause of memory usage 
- If server Restars Full session memory is cleared / eg redis 


### Stateless

- No state 
- meaning we wont rember who is signed in and all
- used jwt 

- When Logged in after validation

- Makes a token 
- contains id name role etc...
- and sign it with secreate key 
- and the key is known to server

- can be stored in 
    - localstorage
    - file
    - cookie

- used in every request 

<!-- Pros -->
- No Memory is used
- Session time is more usually days 
- easily scalable 

<!-- Cons -->
- If token is hacked 
- its deficult to ban the token
- its hard for security

