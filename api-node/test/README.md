# Feature 6 – User Profile Enhancement

## Project Context
This repository contains multiple services.  
This feature focuses **only** on the Node.js backend (`api-node`) and enhances user profile security using JWT authentication.

---

## Feature Description
Feature 6 secures user profile–related endpoints and ensures that **only authenticated users** can access protected resources.

This implementation provides:
- JWT authentication middleware
- Protection of profile-related endpoints
- Automated tests validating authentication behavior
- Proper test scoping in a multi-service repository

---

## What Was Implemented
- JWT authentication middleware to validate access tokens
- Protected profile endpoint using authentication middleware
- Automated tests using **Jest** and **Supertest**
- Test isolation to avoid running out-of-scope or database-dependent tests

---

## How Authentication Works
- Requests **without** a JWT token return **401 Unauthorized**
- Requests **with** a valid JWT token are allowed to proceed
- Authentication is handled via a reusable middleware

---

## Project Structure (Relevant Part)
```
api-node/
├── src/
│ └── index.js
├── test/
│ ├── example.test.js
│ └── profile.auth.test.js
├── package.json 
```

## How to Run the Project
```bash
cd api-node
npm install
npm start
```
## How to Run Tests
```bash
npm test
```
## Expected Result
- PASS  api-node/test/example.test.js
- PASS  api-node/test/profile.auth.test.js

## Demo Instructions

- Run automated tests using npm test

## Verify that profile authentication tests pass

- Call a protected endpoint without a token → returns 401

- Call the same endpoint with a valid JWT token → access allowed

## Example cURL Commands
- Without Token
```curl http://localhost:3000/auth/me```

- With Token
```curl -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \```
 ```http://localhost:3000/auth/me ```

## Notes

Authentication tests related to login and database access were intentionally skipped

These tests are outside the scope of Feature 6 and require seeded database data

## Conclusion

Feature 6 successfully secures user profile endpoints using JWT authentication.
The implementation is validated through automated tests and demonstrated via a simple, reproducible workflow.
