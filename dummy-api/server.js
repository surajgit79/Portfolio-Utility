const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 4000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

function readDb() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function now() {
  return new Date().toISOString();
}

function isValidUserRole(role) {
  return ['admin', 'teacher'].includes(role);
}

function isValidGender(gender) {
  return ['Male', 'Female', 'Others'].includes(gender);
}

function validateRequiredFields(body, fields) {
  const missing = fields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });

  return missing;
}

app.get('/', (req, res) => {
  res.json({ message: 'Dummy API is running' });
});

/* =========================
   USERS CRUD
========================= */

// Get all users
app.get('/users', (req, res) => {
  const db = readDb();
  res.json(db.users);
});

// Get user by id
app.get('/users/:id', (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// Create user
app.post('/users', (req, res) => {
  const db = readDb();
  const { email, password, role = 'teacher' } = req.body;

  const missing = validateRequiredFields(req.body, ['email', 'password']);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
  }

  if (!isValidUserRole(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be admin or teacher' });
  }

  const existingEmail = db.users.find((u) => u.email === email);
  if (existingEmail) {
    return res.status(400).json({ message: 'User email must be unique' });
  }

  const timestamp = now();

  const newUser = {
    id: uuidv4(),
    email,
    password,
    role,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  db.users.push(newUser);
  writeDb(db);

  res.status(201).json(newUser);
});

// Update user
app.put('/users/:id', (req, res) => {
  const db = readDb();
  const userIndex = db.users.findIndex((u) => u.id === req.params.id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const existingUser = db.users[userIndex];
  const { email, password, role } = req.body;

  if (email) {
    const duplicate = db.users.find((u) => u.email === email && u.id !== req.params.id);
    if (duplicate) {
      return res.status(400).json({ message: 'User email must be unique' });
    }
    existingUser.email = email;
  }

  if (password) {
    existingUser.password = password;
  }

  if (role) {
    if (!isValidUserRole(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be admin or teacher' });
    }
    existingUser.role = role;
  }

  existingUser.updatedAt = now();

  db.users[userIndex] = existingUser;
  writeDb(db);

  res.json(existingUser);
});

// Delete user
app.delete('/users/:id', (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // On Delete: Cascade for teacher
  db.users = db.users.filter((u) => u.id !== req.params.id);
  db.teachers = db.teachers.filter((t) => t.userId !== req.params.id);

  writeDb(db);

  res.json({ message: 'User deleted successfully' });
});

/* =========================
   TEACHERS CRUD
========================= */

// Get all teachers
app.get('/teachers', (req, res) => {
  const db = readDb();
  res.json(db.teachers);
});

// Get teacher by id
app.get('/teachers/:id', (req, res) => {
  const db = readDb();
  const teacher = db.teachers.find((t) => t.id === req.params.id);

  if (!teacher) {
    return res.status(404).json({ message: 'Teacher not found' });
  }

  res.json(teacher);
});

// Create teacher
app.post('/teachers', (req, res) => {
  const db = readDb();

  const {
    userId,
    name,
    address,
    contact,
    email,
    gender,
    imageUrl = '',
    dob
  } = req.body;

  const missing = validateRequiredFields(req.body, [
    'userId',
    'name',
    'address',
    'contact',
    'email',
    'gender',
    'dob'
  ]);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
  }

  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(400).json({ message: 'userId does not reference an existing user' });
  }

  const existingTeacherByUserId = db.teachers.find((t) => t.userId === userId);
  if (existingTeacherByUserId) {
    return res.status(400).json({ message: 'Each user can only have one teacher record' });
  }

  const existingTeacherByEmail = db.teachers.find((t) => t.email === email);
  if (existingTeacherByEmail) {
    return res.status(400).json({ message: 'Teacher email must be unique' });
  }

  if (!isValidGender(gender)) {
    return res.status(400).json({ message: 'Invalid gender. Must be Male, Female, or Others' });
  }

  const dobDate = new Date(dob);
  if (Number.isNaN(dobDate.getTime())) {
    return res.status(400).json({ message: 'Invalid dob timestamp' });
  }

  const timestamp = now();

  const newTeacher = {
    id: uuidv4(),
    userId,
    name,
    address,
    contact,
    email,
    gender,
    imageUrl,
    dob: dobDate.toISOString(),
    createdAt: timestamp,
    updatedAt: timestamp
  };

  db.teachers.push(newTeacher);
  writeDb(db);

  res.status(201).json(newTeacher);
});

// Update teacher
app.put('/teachers/:id', (req, res) => {
  const db = readDb();
  const teacherIndex = db.teachers.findIndex((t) => t.id === req.params.id);

  if (teacherIndex === -1) {
    return res.status(404).json({ message: 'Teacher not found' });
  }

  const teacher = db.teachers[teacherIndex];
  const {
    userId,
    name,
    address,
    contact,
    email,
    gender,
    imageUrl,
    dob
  } = req.body;

  if (userId) {
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      return res.status(400).json({ message: 'userId does not reference an existing user' });
    }

    const duplicateUserLink = db.teachers.find(
      (t) => t.userId === userId && t.id !== req.params.id
    );

    if (duplicateUserLink) {
      return res.status(400).json({ message: 'Each user can only have one teacher record' });
    }

    teacher.userId = userId;
  }

  if (email) {
    const duplicateEmail = db.teachers.find(
      (t) => t.email === email && t.id !== req.params.id
    );

    if (duplicateEmail) {
      return res.status(400).json({ message: 'Teacher email must be unique' });
    }

    teacher.email = email;
  }

  if (gender) {
    if (!isValidGender(gender)) {
      return res.status(400).json({ message: 'Invalid gender. Must be Male, Female, or Others' });
    }
    teacher.gender = gender;
  }

  if (dob) {
    const dobDate = new Date(dob);
    if (Number.isNaN(dobDate.getTime())) {
      return res.status(400).json({ message: 'Invalid dob timestamp' });
    }
    teacher.dob = dobDate.toISOString();
  }

  if (name) teacher.name = name;
  if (address) teacher.address = address;
  if (contact) teacher.contact = contact;
  if (imageUrl !== undefined) teacher.imageUrl = imageUrl;

  teacher.updatedAt = now();

  db.teachers[teacherIndex] = teacher;
  writeDb(db);

  res.json(teacher);
});

// Delete teacher
app.delete('/teachers/:id', (req, res) => {
  const db = readDb();
  const teacher = db.teachers.find((t) => t.id === req.params.id);

  if (!teacher) {
    return res.status(404).json({ message: 'Teacher not found' });
  }

  db.teachers = db.teachers.filter((t) => t.id !== req.params.id);
  writeDb(db);

  res.json({ message: 'Teacher deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Dummy API running at http://localhost:${PORT}`);
});