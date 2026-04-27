const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@securepass.com',
    password: 'password123',
    role: 'admin',
    organization: 'SecurePass HQ'
  },
  {
    name: 'Security John',
    email: 'security@securepass.com',
    password: 'password123',
    role: 'security',
    organization: 'SecurePass HQ'
  },
  {
    name: 'Sarah Employee',
    email: 'sarah@securepass.com',
    password: 'password123',
    role: 'employee',
    organization: 'SecurePass HQ'
  },
  {
    name: 'Michael Dev',
    email: 'michael@securepass.com',
    password: 'password123',
    role: 'employee',
    organization: 'SecurePass HQ'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding...');

    await User.deleteMany();
    console.log('Cleared existing users.');

    await User.create(users);
    console.log('Sample users created successfully.');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
