import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";
import Record from "../src/models/Record.js";

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@finance.com",
    password: "admin123",
    role: "admin",
    active: true,
  },
  {
    name: "Analyst User",
    email: "analyst@finance.com",
    password: "analyst123",
    role: "analyst",
    active: true,
  },
  {
    name: "Viewer User",
    email: "viewer@finance.com",
    password: "viewer123",
    role: "viewer",
    active: true,
  },
];

const generateRecords = (userId) => {
  const today = new Date();
  return [
    {
      user: userId,
      amount: 50000,
      type: "income",
      category: "Salary",
      date: today,
      description: "Monthly salary",
    },
    {
      user: userId,
      amount: 15000,
      type: "expense",
      category: "Rent",
      date: today,
      description: "Rent payment",
    },
    {
      user: userId,
      amount: 5000,
      type: "expense",
      category: "Food",
      date: today,
      description: "Groceries",
    },
    {
      user: userId,
      amount: 2000,
      type: "expense",
      category: "Transport",
      date: today,
      description: "Uber rides",
    },
    {
      user: userId,
      amount: 10000,
      type: "income",
      category: "Freelance",
      date: today,
      description: "Client project",
    },
  ];
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await User.deleteMany();
    await Record.deleteMany();
    console.log("Cleared existing data");

    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    for (const user of createdUsers) {
      const records = generateRecords(user._id);
      await Record.create(records);
      console.log(`Created ${records.length} records for ${user.email}`);
    }

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📝 Test Credentials:");
    console.log("Admin:    admin@finance.com / admin123");
    console.log("Analyst:  analyst@finance.com / analyst123");
    console.log("Viewer:   viewer@finance.com / viewer123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
