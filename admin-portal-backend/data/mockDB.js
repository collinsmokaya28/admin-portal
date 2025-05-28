const bcrypt = require('bcryptjs');

const db = {
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: bcrypt.hashSync('password123', 10), // hashed password
      role: 'admin',
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: bcrypt.hashSync('password123', 10),
      role: 'user',
    },
  ],
  registrations: [
    {
      id: 1,
      name: 'Registration 1',
      description: 'This is registration 1',
      userId: 1,
    },
    {
      id: 2,
      name: 'Registration 2',
      description: 'This is registration 2',
      userId: 2,
    },
  ],
  customerRequests: [
    {
      id: 1,
      name: 'Customer Request 1',
      description: 'This is customer request 1',
      userId: 1,
    },
    {
      id: 2,
      name: 'Customer Request 2',
      description: 'This is customer request 2',
      userId: 2,
    },
  ],
  metrics: [
    {
      id: 1,
      name: 'Metric 1',
      value: 10,
    },
    {
      id: 2,
      name: 'Metric 2',
      value: 20,
    },
  ],
};

// Utility functions for CRUD

const getNextId = (collection) => {
  if (db[collection].length === 0) return 1;
  return Math.max(...db[collection].map(item => item.id)) + 1;
};

const findUserByEmail = (email) => db.users.find(u => u.email === email);

const addUser = ({ name, email, password, role = 'user' }) => {
  const id = getNextId('users');
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { id, name, email, password: hashedPassword, role };
  db.users.push(newUser);
  return newUser;
};

const updateUser = (id, { name, email }) => {
  const user = db.users.find(u => u.id === Number(id));
  if (!user) return null;
  if (name) user.name = name;
  if (email) user.email = email;
  return user;
};

const deleteUser = (id) => {
  const index = db.users.findIndex(u => u.id === Number(id));
  if (index === -1) return false;
  db.users.splice(index, 1);
  return true;
};

// Similar functions can be created for registrations, customerRequests, metrics if needed

module.exports = {
  db,
  getMockData: () => db,
  getNextId,
  findUserByEmail,
  addUser,
  updateUser,
  deleteUser,
};
