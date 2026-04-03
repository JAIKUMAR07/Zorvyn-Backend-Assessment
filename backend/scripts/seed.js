import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";
import Record from "../src/models/Record.js";

dotenv.config();

// ==================== USER DATA (Business Roles) ====================
const users = [
  {
    name: "John Martinez",
    email: "admin@finance.com",
    password: "admin123",
    role: "admin",
    active: true,
  },
  {
    name: "Sarah Williams",
    email: "analyst@finance.com",
    password: "analyst123",
    role: "analyst",
    active: true,
  },
  {
    name: "David Chen",
    email: "viewer@finance.com",
    password: "viewer123",
    role: "viewer",
    active: true,
  },
  {
    name: "Emma Thompson",
    email: "emma@techsolutions.com",
    password: "password123",
    role: "analyst",
    active: true,
  },
  {
    name: "Robert Kumar",
    email: "robert@digitalmarketing.com",
    password: "password123",
    role: "viewer",
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

// ==================== BUSINESS INCOME CATEGORIES ====================
const incomeCategories = [
  "Product Sales",
  "Service Revenue",
  "Consulting Fees",
  "Subscription Revenue",
  "License Fees",
  "Maintenance Contracts",
  "Interest Income",
  "Investment Income",
  "Refunds Received",
  "Government Grants",
  "Rental Income",
  "Commission Income",
];

// ==================== BUSINESS EXPENSE CATEGORIES ====================
const expenseCategories = [
  "Office Rent",
  "Employee Salaries",
  "Software Licenses",
  "Cloud Services",
  "Marketing Ads",
  "Travel Expenses",
  "Client Meals",
  "Office Supplies",
  "Equipment Purchase",
  "Internet & Phone",
  "Legal Fees",
  "Accounting Fees",
  "Insurance Premiums",
  "Training & Development",
  "Conference Fees",
  "Subcontractor Costs",
  "Shipping & Delivery",
  "Bank Charges",
  "Taxes & Licenses",
  "Maintenance & Repairs",
  "Utilities",
  "Recruiting Costs",
  "Employee Benefits",
  "Research & Development",
];

// ==================== GENERATE INCOME RECORDS ====================
const generateIncomeRecords = (userId, months, userRole, userName) => {
  const records = [];

  // Product Sales (every month)
  months.forEach((month) => {
    const salesAmount = 25000 + Math.floor(Math.random() * 20000);
    records.push({
      user: userId,
      amount: salesAmount,
      type: "income",
      category: "Product Sales",
      date: new Date(month.getFullYear(), month.getMonth(), 28),
      description: `${userName} - Monthly product sales revenue`,
    });
  });

  // Service Revenue (every month)
  months.forEach((month) => {
    const serviceAmount = 15000 + Math.floor(Math.random() * 15000);
    records.push({
      user: userId,
      amount: serviceAmount,
      type: "income",
      category: "Service Revenue",
      date: new Date(month.getFullYear(), month.getMonth(), 20),
      description: `${userName} - Client service fees`,
    });
  });

  // Consulting Fees (quarterly)
  [2, 5, 8, 11].forEach((monthOffset) => {
    if (months[monthOffset]) {
      records.push({
        user: userId,
        amount: 10000 + Math.floor(Math.random() * 15000),
        type: "income",
        category: "Consulting Fees",
        date: new Date(
          months[monthOffset].getFullYear(),
          months[monthOffset].getMonth(),
          10,
        ),
        description: `${userName} - Strategic consulting project`,
      });
    }
  });

  // Subscription Revenue (recurring)
  months.forEach((month) => {
    records.push({
      user: userId,
      amount: 5000 + Math.floor(Math.random() * 5000),
      type: "income",
      category: "Subscription Revenue",
      date: new Date(month.getFullYear(), month.getMonth(), 1),
      description: `${userName} - Monthly subscription renewals`,
    });
  });

  // Maintenance Contracts (bi-monthly)
  [1, 3, 5, 7, 9, 11].forEach((monthOffset) => {
    if (months[monthOffset]) {
      records.push({
        user: userId,
        amount: 8000 + Math.floor(Math.random() * 7000),
        type: "income",
        category: "Maintenance Contracts",
        date: new Date(
          months[monthOffset].getFullYear(),
          months[monthOffset].getMonth(),
          15,
        ),
        description: `${userName} - Annual maintenance contract`,
      });
    }
  });

  return records;
};

// ==================== GENERATE EXPENSE RECORDS ====================
const generateExpenseRecords = (userId, months, userRole, userName) => {
  const records = [];

  // Office Rent (every month)
  months.forEach((month) => {
    records.push({
      user: userId,
      amount: 25000 + Math.floor(Math.random() * 10000),
      type: "expense",
      category: "Office Rent",
      date: new Date(month.getFullYear(), month.getMonth(), 1),
      description: `${userName} - Monthly office rent payment`,
    });
  });

  // Employee Salaries (every month)
  months.forEach((month) => {
    records.push({
      user: userId,
      amount: 50000 + Math.floor(Math.random() * 30000),
      type: "expense",
      category: "Employee Salaries",
      date: new Date(month.getFullYear(), month.getMonth(), 25),
      description: `${userName} - Monthly payroll`,
    });
  });

  // Software Licenses (every month)
  const softwareLicenses = [
    { name: "Microsoft 365", amount: 1500 },
    { name: "Adobe Creative Cloud", amount: 3500 },
    { name: "Salesforce", amount: 5000 },
    { name: "Slack", amount: 800 },
    { name: "Zoom", amount: 1200 },
  ];

  months.forEach((month) => {
    softwareLicenses.forEach((license) => {
      records.push({
        user: userId,
        amount: license.amount,
        type: "expense",
        category: "Software Licenses",
        date: new Date(month.getFullYear(), month.getMonth(), 5),
        description: `${userName} - ${license.name} subscription`,
      });
    });
  });

  // Cloud Services (AWS/Azure/GCP)
  months.forEach((month) => {
    records.push({
      user: userId,
      amount: 5000 + Math.floor(Math.random() * 10000),
      type: "expense",
      category: "Cloud Services",
      date: new Date(month.getFullYear(), month.getMonth(), 10),
      description: `${userName} - Cloud infrastructure costs`,
    });
  });

  // Marketing Ads (Google/Facebook/LinkedIn)
  months.forEach((month) => {
    const adSpend = 8000 + Math.floor(Math.random() * 12000);
    records.push({
      user: userId,
      amount: adSpend,
      type: "expense",
      category: "Marketing Ads",
      date: new Date(month.getFullYear(), month.getMonth(), 15),
      description: `${userName} - Digital marketing campaigns`,
    });
  });

  // Travel Expenses (monthly)
  months.forEach((month) => {
    const travelCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < travelCount; i++) {
      records.push({
        user: userId,
        amount: 3000 + Math.floor(Math.random() * 7000),
        type: "expense",
        category: "Travel Expenses",
        date: getRandomDate(
          new Date(month.getFullYear(), month.getMonth(), 1),
          new Date(month.getFullYear(), month.getMonth() + 1, 0),
        ),
        description: `${userName} - Business travel (flights + hotel)`,
      });
    }
  });

  // Client Meals (2-3 times per month)
  months.forEach((month) => {
    const mealCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < mealCount; i++) {
      records.push({
        user: userId,
        amount: 1000 + Math.floor(Math.random() * 3000),
        type: "expense",
        category: "Client Meals",
        date: getRandomDate(
          new Date(month.getFullYear(), month.getMonth(), 1),
          new Date(month.getFullYear(), month.getMonth() + 1, 0),
        ),
        description: `${userName} - Client dinner meeting`,
      });
    }
  });

  // Office Supplies (weekly)
  months.forEach((month) => {
    for (let week = 1; week <= 4; week++) {
      records.push({
        user: userId,
        amount: 500 + Math.floor(Math.random() * 1000),
        type: "expense",
        category: "Office Supplies",
        date: new Date(month.getFullYear(), month.getMonth(), week * 7),
        description: `${userName} - Weekly office supplies`,
      });
    }
  });

  // Equipment Purchase (quarterly)
  [2, 5, 8, 11].forEach((monthOffset) => {
    if (months[monthOffset]) {
      records.push({
        user: userId,
        amount: 15000 + Math.floor(Math.random() * 25000),
        type: "expense",
        category: "Equipment Purchase",
        date: new Date(
          months[monthOffset].getFullYear(),
          months[monthOffset].getMonth(),
          20,
        ),
        description: `${userName} - New laptops/monitors purchase`,
      });
    }
  });

  // Internet & Phone (every month)
  months.forEach((month) => {
    records.push({
      user: userId,
      amount: 3000 + Math.floor(Math.random() * 2000),
      type: "expense",
      category: "Internet & Phone",
      date: new Date(month.getFullYear(), month.getMonth(), 8),
      description: `${userName} - Business internet and phone bills`,
    });
  });

  // Legal Fees (quarterly)
  [2, 5, 8, 11].forEach((monthOffset) => {
    if (months[monthOffset]) {
      records.push({
        user: userId,
        amount: 5000 + Math.floor(Math.random() * 10000),
        type: "expense",
        category: "Legal Fees",
        date: new Date(
          months[monthOffset].getFullYear(),
          months[monthOffset].getMonth(),
          12,
        ),
        description: `${userName} - Legal consultation fees`,
      });
    }
  });

  // Accounting Fees (quarterly)
  [3, 6, 9, 12].forEach((monthOffset) => {
    if (months[monthOffset - 1]) {
      records.push({
        user: userId,
        amount: 8000 + Math.floor(Math.random() * 7000),
        type: "expense",
        category: "Accounting Fees",
        date: new Date(
          months[monthOffset - 1].getFullYear(),
          months[monthOffset - 1].getMonth(),
          18,
        ),
        description: `${userName} - Quarterly tax preparation`,
      });
    }
  });

  // Insurance Premiums (monthly)
  months.forEach((month) => {
    records.push({
      user: userId,
      amount: 5000 + Math.floor(Math.random() * 5000),
      type: "expense",
      category: "Insurance Premiums",
      date: new Date(month.getFullYear(), month.getMonth(), 22),
      description: `${userName} - Business insurance premiums`,
    });
  });

  // Training & Development (bi-monthly)
  [1, 4, 7, 10].forEach((monthOffset) => {
    if (months[monthOffset]) {
      records.push({
        user: userId,
        amount: 5000 + Math.floor(Math.random() * 10000),
        type: "expense",
        category: "Training & Development",
        date: new Date(
          months[monthOffset].getFullYear(),
          months[monthOffset].getMonth(),
          25,
        ),
        description: `${userName} - Employee training programs`,
      });
    }
  });

  // Subcontractor Costs (monthly)
  months.forEach((month) => {
    records.push({
      user: userId,
      amount: 10000 + Math.floor(Math.random() * 15000),
      type: "expense",
      category: "Subcontractor Costs",
      date: new Date(month.getFullYear(), month.getMonth(), 28),
      description: `${userName} - Freelance/contractor payments`,
    });
  });

  // Bank Charges (every month)
  months.forEach((month) => {
    records.push({
      user: userId,
      amount: 500 + Math.floor(Math.random() * 1000),
      type: "expense",
      category: "Bank Charges",
      date: new Date(month.getFullYear(), month.getMonth(), 30),
      description: `${userName} - Monthly bank fees and transaction charges`,
    });
  });

  return records;
};

// ==================== GENERATE ALL RECORDS ====================
const generateAllRecords = (userId, userRole, userName) => {
  const months = getLast12Months();
  const incomeRecords = generateIncomeRecords(
    userId,
    months,
    userRole,
    userName,
  );
  const expenseRecords = generateExpenseRecords(
    userId,
    months,
    userRole,
    userName,
  );
  return [...incomeRecords, ...expenseRecords];
};

// ==================== SEED DATABASE ====================
const seedDatabase = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      console.error("❌ Seeding is disabled in production.");
      process.exit(1);
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const usersDeleted = await User.deleteMany();
    const recordsDeleted = await Record.deleteMany();
    console.log(`🗑️ Cleared ${usersDeleted.deletedCount} users`);
    console.log(`🗑️ Cleared ${recordsDeleted.deletedCount} records`);

    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    let totalRecords = 0;

    for (const user of createdUsers) {
      const records = generateAllRecords(
        user._id,
        user.role,
        user.name.split(" ")[0],
      );
      await Record.create(records);
      totalRecords += records.length;
      console.log(
        `✅ Created ${records.length} records for ${user.email} (${user.role})`,
      );
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎉 DATABASE SEEDED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Records: ${totalRecords}`);
    console.log(`   - Income Records: ~${Math.floor(totalRecords / 2)}`);
    console.log(`   - Expense Records: ~${Math.floor(totalRecords / 2)}`);

    console.log("\n🔐 TEST CREDENTIALS (Business Roles):");
    console.log("-".repeat(50));
    console.log("| Role     | Email                          | Password   |");
    console.log("|----------|--------------------------------|------------|");
    console.log("| Admin    | admin@finance.com              | admin123   |");
    console.log("| Analyst  | analyst@finance.com            | analyst123 |");
    console.log("| Viewer   | viewer@finance.com             | viewer123  |");
    console.log("| Analyst  | emma@techsolutions.com         | password123|");
    console.log("| Viewer   | robert@digitalmarketing.com    | password123|");

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

    console.log("\n📊 TOP 10 BUSINESS CATEGORIES:");
    console.log("-".repeat(50));
    categoryStats.forEach((cat, idx) => {
      console.log(
        `   ${idx + 1}. ${cat._id}: ${cat.count} records, ₹${cat.total.toLocaleString()}`,
      );
    });

    console.log("\n✅ Seed completed successfully!");
    console.log(
      "\n💡 TIP: Use Postman collection to test all visualization endpoints!",
    );
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding database:");
    console.error(error.message);
    process.exit(1);
  }
};

seedDatabase();
