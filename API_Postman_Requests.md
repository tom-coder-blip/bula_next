# API Postman Requests Cheat Sheet

## Authentication

### Register (POST)
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Peter",
  "email": "peter10@gmail.com",
  "password": "123456",
  "role": "learner",
  "interests": ["coding", "business"],
  "location": "Johannesburg"
}
```

### Login (POST)
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "peter10@gmail.com",
  "password": "123456"
}
```

---

## Users

### Get Own Profile (GET)
```
GET http://localhost:5000/api/users/profile
Authorization: Bearer <token>
```

### Update Own Profile (PUT)
```
PUT http://localhost:5000/api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Peter Updated",
  "location": "Cape Town"
}
```

### Get All Users (GET)
```
GET http://localhost:5000/api/users/profiles
Authorization: Bearer <token>
```

### Get User by ID (GET)
```
GET http://localhost:5000/api/users/profiles/<userId>
Authorization: Bearer <token>
```

### Get All Mentors (GET, paginated)
```
GET http://localhost:5000/api/users/mentors?page=1&limit=10
Authorization: Bearer <token>
```

### Get All Learners (GET, paginated)
```
GET http://localhost:5000/api/users/learners?page=1&limit=10
Authorization: Bearer <token>
```

---

## Matching

### Get Matches (GET)
```
GET http://localhost:5000/api/match/
Authorization: Bearer <token>
```

---

## Mentor Goals

### Create Goal (POST)
```
POST http://localhost:5000/api/mentor/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Finish React Course",
  "description": "Complete all modules by end of month"
}
```

### Get Goals (GET)
```
GET http://localhost:5000/api/mentor/goals
Authorization: Bearer <token>
```

### Update Goal (PUT)
```
PUT http://localhost:5000/api/mentor/goals/<goalId>
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Finish Node.js Course"
}
```

### Delete Goal (DELETE)
```
DELETE http://localhost:5000/api/mentor/goals/<goalId>
Authorization: Bearer <token>
```

---

## CV

### (Example) Upload CV (POST)
```
POST http://localhost:5000/api/cv/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <select file>
```

---

## Q&A

### Ask a Question (POST)
```
POST http://localhost:5000/api/qa/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "How do I use MongoDB with Node.js?"
}
```

### Get All Questions (GET)
```
GET http://localhost:5000/api/qa/questions
Authorization: Bearer <token>
```

### Answer a Question (PUT)
```
PUT http://localhost:5000/api/qa/questions/<questionId>/answer
Authorization: Bearer <token>
Content-Type: application/json

{
  "answer": "You can use the mongoose library to connect to MongoDB."
}
```

---

## File Uploads

### Access Uploaded Files (GET)
```
GET http://localhost:5000/uploads/<filename>
```

---

Replace `<token>`, `<userId>`, `<goalId>`, `<questionId>`, and `<filename>` with actual values from your app.
