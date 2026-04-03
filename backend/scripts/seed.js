import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";
import Record from "../src/models/Record.js";

dotenv.config();

// ==================== USER DATA ====================
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
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "password123",
    role: "viewer",
    active: true,
  },
  {
    name: "Michael Chen",
    email: "michael@example.com",
    password: "password123",
    role: "analyst",
    active: true,
  },
];

// ==================== HELPER FUNCTIONS ====================
const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

const getLast12Months = () => {
  const months = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(date);
  }
  return months;
};

// ==================== INCOME CATEGORIES ====================
const incomeCategories = [
  "Salary",
  "Freelance",
  "Bonus",
  "Investment Returns",
  "Gift Received",
  "Refund",
  "Rental Income",
  "Dividends",
  "Interest Earned",
  "Business Income",
  "Commission",
  "Tax Refund",
];

// ==================== EXPENSE CATEGORIES ====================
const expenseCategories = [
  "Rent",
  "Mortgage",
  "Groceries",
  "Restaurants",
  "Food Delivery",
  "Transport",
  "Fuel",
  "Car Maintenance",
  "Public Transit",
  "Uber/Ride Share",
  "Shopping",
  "Clothing",
  "Electronics",
  "Home Improvement",
  "Furniture",
  "Entertainment",
  "Movies",
  "Netflix/Streaming",
  "Concerts",
  "Games",
  "Utilities",
  "Electricity",
  "Water",
  "Internet",
  "Phone Bill",
  "Healthcare",
  "Doctor",
  "Pharmacy",
  "Dental",
  "Insurance",
  "Education",
  "Courses",
  "Books",
  "Tuition",
  "Travel",
  "Flights",
  "Hotels",
  "Vacation",
  "Gym",
  "Sports",
  "Hobbies",
  "Subscriptions",
  "Gifts Given",
  "Charity",
  "Baby/Kids",
  "Pets",
];

// ==================== GENERATE INCOME RECORDS ====================
const generateIncomeRecords = (userId, months) => {
  const records = [];

  // Salary (every month, consistent amount)
  months.forEach((month, index) => {
    const salaryAmount = 50000 + Math.floor(Math.random() * 10000) - 5000;
    records.push({
      user: userId,
      amount: salaryAmount,
      type: "income",
      category: "Salary",
      date: new Date(month.getFullYear(), month.getMonth(), 25),
      description: `Monthly salary - ${month.toLocaleString("default", { month: "long" })} ${month.getFullYear()}`,
    });
  });

  // Freelance (random months)
  [0, 2, 5, 8, 10].forEach((monthOffset) => {
    if (months[monthOffset]) {
      records.push({
        user: userId,
        amount: 8000 + Math.floor(Math.random() * 12000),
        type: "income",
        category: "Freelance",
        date: new Date(
          months[monthOffset].getFullYear(),
          months[monthOffset].getMonth(),
          15,
        ),
        description: "Freelance web development project",
      });
    }
  });

  // Bonus (March and December)
  const bonusMonths = [2, 11];
  bonusMonths.forEach((monthOffset) => {
    if (months[monthOffset]) {
      records.push({
        user: userId,
        amount: 15000 + Math.floor(Math.random() * 10000),
        type: "income",
        category: "Bonus",
        date: new Date(
          months[monthOffset].getFullYear(),
          months[monthOffset].getMonth(),
          28,
        ),
        description: "Performance bonus",
      });
    }
  });

  // Investment Returns (quarterly)
  [2, 5, 8, 11].forEach((monthOffset) => {
    if (months[monthOffset]) {
      records.push({
        user: userId,
        amount: 2000 + Math.floor(Math.random() * 3000),
        type: "income",
        category: "Investment Returns",
        date: new Date(
          months[monthOffset].getFullYear(),
          months[monthOffset].getMonth(),
          1,
        ),
        description: "Stock dividends and interest",
      });
    }
  });

  return records;
};

// ==================== GENERATE EXPENSE RECORDS ====================
const generateExpenseRecords = (userId, months) => {
  const records = [];

  // Rent/Mortgage (every month)
  months.forEach((month) => {
    records.push({
      user: userId,
      amount: 15000 + Math.floor(Math.random() * 5000),
      type: "expense",
      category: "Rent",
      date: new Date(month.getFullYear(), month.getMonth(), 1),
      description: "Monthly rent payment",
    });
  });

  // Groceries (weekly - 4 times per month)
  months.forEach((month) => {
    for (let week = 1; week <= 4; week++) {
      records.push({
        user: userId,
        amount: 1500 + Math.floor(Math.random() * 1000),
        type: "expense",
        category: "Groceries",
        date: new Date(month.getFullYear(), month.getMonth(), week * 7),
        description: `Weekly groceries - Week ${week}`,
      });
    }
  });

  // Restaurants & Dining (2-3 times per month)
  months.forEach((month) => {
    const diningCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < diningCount; i++) {
      records.push({
        user: userId,
        amount: 500 + Math.floor(Math.random() * 1500),
        type: "expense",
        category: "Restaurants",
        date: getRandomDate(
          new Date(month.getFullYear(), month.getMonth(), 1),
          new Date(month.getFullYear(), month.getMonth() + 1, 0),
        ),
        description: [
          "Dinner with friends",
          "Lunch meeting",
          "Weekend brunch",
          "Date night",
        ][i % 4],
      });
    }
  });

  // Utilities (every month)
  months.forEach((month) => {
    records.push({
      user: userId,
      amount: 2000 + Math.floor(Math.random() * 1500),
      type: "expense",
      category: "Utilities",
      date: new Date(month.getFullYear(), month.getMonth(), 15),
      description: "Electricity, water, internet bills",
    });
  });

  // Transport (daily commute - 20 times per month)
  months.forEach((month) => {
    for (let day = 1; day <= 20; day++) {
      records.push({
        user: userId,
        amount: 50 + Math.floor(Math.random() * 100),
        type: "expense",
        category: "Transport",
        date: new Date(month.getFullYear(), month.getMonth(), day),
        description: "Daily commute - Metro/Bus",
      });
    }
  });

  // Shopping (3-4 times per month)
  months.forEach((month) => {
    const shoppingCount = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < shoppingCount; i++) {
      records.push({
        user: userId,
        amount: 1000 + Math.floor(Math.random() * 4000),
        type: "expense",
        category: "Shopping",
        date: getRandomDate(
          new Date(month.getFullYear(), month.getMonth(), 1),
          new Date(month.getFullYear(), month.getMonth() + 1, 0),
        ),
        description: [
          "Clothes purchase",
          "Electronics",
          "Home decor",
          "Online shopping",
        ][i % 4],
      });
    }
  });

  // Entertainment (2-3 times per month)
  months.forEach((month) => {
    const entertainmentCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < entertainmentCount; i++) {
      records.push({
        user: userId,
        amount: 300 + Math.floor(Math.random() * 1200),
        type: "expense",
        category: "Entertainment",
        date: getRandomDate(
          new Date(month.getFullYear(), month.getMonth(), 1),
          new Date(month.getFullYear(), month.getMonth() + 1, 0),
        ),
        description: [
          "Movie tickets",
          "Netflix subscription",
          "Concert tickets",
          "Weekend getaway",
        ][i % 4],
      });
    }
  });

  // Healthcare (1-2 times per month)
  months.forEach((month) => {
    const healthcareCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < healthcareCount; i++) {
      records.push({
        user: userId,
        amount: 500 + Math.floor(Math.random() * 2000),
        type: "expense",
        category: "Healthcare",
        date: getRandomDate(
          new Date(month.getFullYear(), month.getMonth(), 1),
          new Date(month.getFullYear(), month.getMonth() + 1, 0),
        ),
        description: [
          "Doctor visit",
          "Pharmacy",
          "Dental checkup",
          "Health insurance",
        ][i % 4],
      });
    }
  });

  // Education/Courses (occasional)
  [1, 4, 7, 10].forEach((monthOffset) => {
    if (months[monthOffset]) {
      records.push({
        user: userId,
        amount: 3000 + Math.floor(Math.random() * 5000),
        type: "expense",
        category: "Education",
        date: new Date(
          months[monthOffset].getFullYear(),
          months[monthOffset].getMonth(),
          10,
        ),
        description: "Online course subscription",
      });
    }
  });

  // Travel (twice a year)
  [5, 11].forEach((monthOffset) => {
    if (months[monthOffset]) {
      records.push({
        user: userId,
        amount: 15000 + Math.floor(Math.random() * 15000),
        type: "expense",
        category: "Travel",
        date: new Date(
          months[monthOffset].getFullYear(),
          months[monthOffset].getMonth(),
          20,
        ),
        description:
          months[monthOffset].getMonth() === 5
            ? "Summer vacation"
            : "Winter holiday trip",
      });
    }
  });

  // Subscriptions (every month)
  const subscriptions = [
    { name: "Netflix", amount: 649 },
    { name: "Spotify", amount: 119 },
    { name: "Amazon Prime", amount: 299 },
    { name: "Gym Membership", amount: 1500 },
  ];

  months.forEach((month) => {
    subscriptions.forEach((sub) => {
      records.push({
        user: userId,
        amount: sub.amount,
        type: "expense",
        category: "Subscriptions",
        date: new Date(month.getFullYear(), month.getMonth(), 5),
        description: `${sub.name} monthly subscription`,
      });
    });
  });

  return records;
};

// ==================== GENERATE ALL RECORDS ====================
const generateAllRecords = (userId) => {
  const months = getLast12Months();
  const incomeRecords = generateIncomeRecords(userId, months);
  const expenseRecords = generateExpenseRecords(userId, months);
  return [...incomeRecords, ...expenseRecords];
};

// ==================== SEED DATABASE ====================
const seedDatabase = async () => {
  try {
    // Validate environment
    if (process.env.NODE_ENV === "production") {
      console.error("❌ Seeding is disabled in production.");
      process.exit(1);
    }

    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    const usersDeleted = await User.deleteMany();
    const recordsDeleted = await Record.deleteMany();
    console.log(`🗑️  Cleared ${usersDeleted.deletedCount} users`);
    console.log(`🗑️  Cleared ${recordsDeleted.deletedCount} records`);

    // Create users
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Generate and insert records for each user
    let totalRecords = 0;

    for (const user of createdUsers) {
      const records = generateAllRecords(user._id);
      await Record.create(records);
      totalRecords += records.length;
      console.log(
        `✅ Created ${records.length} records for ${user.email} (${user.role})`,
      );
    }

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DATABASE SEEDED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Records: ${totalRecords}`);
    console.log(`   - Income Records: ${totalRecords / 2} (approx)`);
    console.log(`   - Expense Records: ${totalRecords / 2} (approx)`);

    // Print test credentials
    console.log("\n🔐 TEST CREDENTIALS:");
    console.log("-".repeat(40));
    console.log("| Role     | Email                    | Password   |");
    console.log("|----------|--------------------------|------------|");
    console.log("| Admin    | admin@finance.com        | admin123   |");
    console.log("| Analyst  | analyst@finance.com      | analyst123 |");
    console.log("| Viewer   | viewer@finance.com       | viewer123  |");
    console.log("| Viewer   | sarah@example.com        | password123|");
    console.log("| Analyst  | michael@example.com      | password123|");

    // Print data range
    const dates = await Record.aggregate([
      {
        $group: {
          _id: null,
          minDate: { $min: "$date" },
          maxDate: { $max: "$date" },
        },
      },
    ]);

    if (dates.length > 0) {
      console.log("\n📅 DATA RANGE:");
      console.log(
        `   - From: ${new Date(dates[0].minDate).toLocaleDateString()}`,
      );
      console.log(
        `   - To: ${new Date(dates[0].maxDate).toLocaleDateString()}`,
      );
    }

    // Print category distribution
    const categoryStats = await Record.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    console.log("\n📊 TOP 10 CATEGORIES:");
    console.log("-".repeat(40));
    categoryStats.forEach((cat, idx) => {
      console.log(
        `   ${idx + 1}. ${cat._id}: ${cat.count} records, ₹${cat.total.toLocaleString()}`,
      );
    });

    console.log("\n✅ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding database:");
    console.error(error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
