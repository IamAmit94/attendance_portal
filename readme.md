Features
1. User Registration (Sign Up) API:

Endpoint: /signup
Method: POST
Parameters:
name: User's name (String)
email: User's email (String)
password: User's password (String)
Description: Registers a new user. Validates input and stores the user's information securely.
2. User Login API:

Endpoint: /login
Method: POST
Parameters:
email OR name: User's email or name (String)
password: User's password (String)
Description: Logs in a user and generates an authentication token. The token is required for check-in and check-out operations.
3. Check-In API:

Endpoint: /checkin
Method: POST
Headers:
Authorization: User's authentication token
Parameters:
date (Optional): Check-in date in yy-mm-dd format (String)
time (Optional): Check-in time in hh:mm format (String)
Description: Records the user's check-in. Default date and time are used if not provided.
4. Check-Out API:

Endpoint: /checkout
Method: POST
Headers:
Authorization: User's authentication token
Parameters:
date (Optional): Check-out date in yy-mm-dd format (String)
time (Optional): Check-out time in hh:mm format (String)
Description: Records the user's check-out. Default date and time are used if not provided.
5. Monthly Report API:

Endpoint: /monthly/:instructorId/:year/:month
Method: GET
Parameters:
instructorId: User's ID (String)
year: Year for the report (String)
month: Month for the report (String)
Description: Retrieves the monthly attendance report for a specific user based on the provided ID, year, and month.
6. Get All Check-Ins API:

Endpoint: /checkins/:instructorId
Method: GET
Parameters:
instructorId: User's ID (String)
Description: Retrieves all check-in records for a specific user based on the provided ID.
7. Get All Check-Outs API:

Endpoint: /checkouts/:instructorId
Method: GET
Parameters:
instructorId: User's ID (String)
Description: Retrieves all check-out records for a specific user based on the provided ID.

  Usage
1. User Registration:

Endpoint: /signup
Method: POST
Parameters: name, email, password
Example: /signup { "name": "John Doe", "email": "john@example.com", "password": "password123" }
2. User Login:

Endpoint: /login
Method: POST
Parameters: email OR name, password
Example: /login { "email": "john@example.com", "password": "password123" }
3. Check-In:

Endpoint: /checkin
Method: POST
Headers: Authorization: <user_token>
Parameters: date (Optional), time (Optional)
Example: /checkin { "date": "2024-02-18", "time": "09:00" }
4. Check-Out:

Endpoint: /checkout
Method: POST
Headers: Authorization: <user_token>
Parameters: date (Optional), time (Optional)
Example: /checkout { "date": "2024-02-18", "time": "17:00" }
5. Monthly Report:

Endpoint: /monthly/:instructorId/:year/:month
Method: GET
Parameters: instructorId, year, month
Example: /monthly/65d1fbbd3b0236f5fabb0f5d/2024/02
6. Get All Check-Ins:

Endpoint: /checkins/:instructorId
Method: GET
Parameters: instructorId
Example: /checkins/65d1fbbd3b0236f5fabb0f5d
7. Get All Check-Outs:

Endpoint: /checkouts/:instructorId
Method: GET
Parameters: instructorId
Example: /checkouts/65d1fbbd3b0236f5fabb0f5d


Note
Ensure to replace <user_token> with the actual user authentication token in the headers.
Use the provided examples as a reference for making API requests.
Feel free to reach out if you have any questions or need further assistance!