const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing users
    await User.deleteMany();
    console.log('Cleared existing users');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [
      {
        name: 'System Admin',
        email: 'admin@securepass.com',
        password: hashedPassword,
        role: 'admin',
        organization: 'SecurePass Corp'
      },
      {
        name: 'Security John',
        email: 'security@securepass.com',
        password: hashedPassword,
        role: 'security',
        organization: 'SecurePass Corp'
      },
      {
        name: 'Employee Sarah',
        email: 'sarah@securepass.com',
        password: hashedPassword,
        role: 'employee',
        organization: 'SecurePass Corp'
      }
    ];

    await User.insertMany(users);
    console.log('Seeded 3 users successfully!');
    console.log('Emails: admin@securepass.com, security@securepass.com, sarah@securepass.com');
    console.log('Password: password123');

    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
