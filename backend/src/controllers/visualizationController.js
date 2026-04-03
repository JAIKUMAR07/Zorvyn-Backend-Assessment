import mongoose from "mongoose";
import Record from "../models/Record.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

/**
 * HELPER: Calculates Date Range based on period string
 */
const getDateRange = (period, fromDate, toDate, year, month, quarter) => {
  const now = new Date();
  let start = new Date();
  let end = new Date(now);

  switch (period) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "yesterday":
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(now.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case "thisWeek":
      const day = now.getDay() || 7;
      start.setDate(now.getDate() - day + 1);
      start.setHours(0, 0, 0, 0);
      break;
    case "lastWeek":
      const lday = now.getDay() || 7;
      start.setDate(now.getDate() - lday - 6);
      start.setHours(0, 0, 0, 0);
      end.setDate(now.getDate() - lday);
      end.setHours(23, 59, 59, 999);
      break;
    case "thisMonth":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "lastMonth":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;
    case "month":
      if (!year || !month)
        throw new AppError(
          'Period "month" requires year and month parameters',
          400,
        );
      start = new Date(year, month - 1, 1);
      end = new Date(year, month, 0, 23, 59, 59, 999);
      break;
    case "thisQuarter":
      const tq = Math.floor(now.getMonth() / 3) * 3;
      start = new Date(now.getFullYear(), tq, 1);
      break;
    case "lastQuarter":
      const lq = (Math.floor(now.getMonth() / 3) - 1) * 3;
      start = new Date(now.getFullYear(), lq, 1);
      end = new Date(now.getFullYear(), lq + 3, 0, 23, 59, 59, 999);
      break;
    case "quarter":
      if (!year || !quarter)
        throw new AppError(
          'Period "quarter" requires year and quarter parameters',
          400,
        );
      const sq = (quarter - 1) * 3;
      start = new Date(year, sq, 1);
      end = new Date(year, sq + 3, 0, 23, 59, 59, 999);
      break;
    case "thisYear":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case "lastYear":
      start = new Date(now.getFullYear() - 1, 0, 1);
      end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
      break;
    case "year":
      if (!year)
        throw new AppError('Period "year" requires year parameter', 400);
      start = new Date(year, 0, 1);
      end = new Date(year, 11, 31, 23, 59, 59, 999);
      break;
    case "ytd":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case "last30days":
      start.setDate(now.getDate() - 30);
      break;
    case "last6months":
      start.setMonth(now.getMonth() - 6);
      start.setDate(1);
      break;
    case "last12months":
      start.setMonth(now.getMonth() - 12);
      start.setDate(1);
      break;
    case "custom":
      if (!fromDate || !toDate)
        throw new AppError("Custom range requires fromDate and toDate", 400);
      start = new Date(fromDate);
      end = new Date(toDate);
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  }

  return { start, end };
};

/**
 * HELPER: Calculates Previous Date Range for comparison
 */
const getPreviousRange = (start, end, compare) => {
  let prevStart = new Date(start);
  let prevEnd = new Date(end);
  const diff = end.getTime() - start.getTime();

  if (compare === "previous") {
    prevStart.setTime(start.getTime() - diff - 1000);
    prevEnd.setTime(start.getTime() - 1000);
  } else if (compare === "previousYear") {
    prevStart.setFullYear(start.getFullYear() - 1);
    prevEnd.setFullYear(end.getFullYear() - 1);
  } else if (compare === "previousMonth") {
    prevStart.setMonth(start.getMonth() - 1);
    prevEnd.setMonth(end.getMonth() - 1);
  } else if (compare === "previousQuarter") {
    prevStart.setMonth(start.getMonth() - 3);
    prevEnd.setMonth(end.getMonth() - 3);
  }

  return { prevStart, prevEnd };
};

/**
 * 1. MONTHLY COMPARISON (Bar Chart)
 */
export const getMonthlyComparison = catchAsync(async (req, res, next) => {
  const {
    period,
    fromDate,
    toDate,
    year,
    month,
    quarter,
    type = "both",
    currency = "INR",
    groupBy = "month",
  } = req.query;
  const { start, end } = getDateRange(
    period,
    fromDate,
    toDate,
    year,
    month,
    quarter,
  );
  const userId = req.user.role === "admin" ? null : req.user._id;

  const records = await Record.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
        ...(userId && { user: new mongoose.Types.ObjectId(userId) }),
      },
    },
    {
      $group: {
        _id: { month: { $month: "$date" }, year: { $year: "$date" } },
        income: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
        },
        expense: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const labels = records.map((r) => monthNames[r._id.month - 1]);
  const incomeData = records.map((r) => r.income);
  const expenseData = records.map((r) => r.expense);

  const totalIncome = incomeData.reduce((a, b) => a + b, 0);
  const totalExpense = expenseData.reduce((a, b) => a + b, 0);

  res.status(200).json({
    status: "success",
    metadata: {
      period: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      totalMonths: records.length,
      comparison: req.query.compare || "none",
      type,
      currency,
      generatedAt: new Date().toISOString(),
    },
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
        stack: "income",
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        stack: "expense",
      },
    ],
    summary: {
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      avgMonthlyIncome: Math.round(totalIncome / (records.length || 1)),
      avgMonthlyExpense: Math.round(totalExpense / (records.length || 1)),
      savingsRate:
        totalIncome > 0
          ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) +
            "%"
          : "0%",
    },
  });
});

/**
 * 2. CATEGORY BREAKDOWN (Pie/Donut Chart)
 */
export const getCategoryBreakdown = catchAsync(async (req, res, next) => {
  const {
    period,
    fromDate,
    toDate,
    year,
    month,
    quarter,
    type = "expense",
    limit = 10,
    compare,
  } = req.query;
  const { start, end } = getDateRange(
    period,
    fromDate,
    toDate,
    year,
    month,
    quarter,
  );
  const userId = req.user.role === "admin" ? null : req.user._id;

  const aggregateType = async (t, rangeStart, rangeEnd) => {
    return await Record.aggregate([
      {
        $match: {
          date: { $gte: rangeStart, $lte: rangeEnd },
          type: t,
          ...(userId && { user: new mongoose.Types.ObjectId(userId) }),
        },
      },
      { $group: { _id: "$category", amount: { $sum: "$amount" } } },
      { $sort: { amount: -1 } },
      { $limit: parseInt(limit) },
    ]);
  };

  if (type === "both") {
    const incomeStats = await aggregateType("income", start, end);
    const expenseStats = await aggregateType("expense", start, end);
    const formatData = (stats) => {
      const total = stats.reduce((a, b) => a + b.amount, 0);
      return {
        labels: stats.map((s) => s._id),
        datasets: [
          {
            data: stats.map((s) => s.amount),
            backgroundColor: [
              "#4BC0C0",
              "#36A2EB",
              "#FFCE56",
              "#9966FF",
              "#FF9F40",
            ],
          },
        ],
        percentages: stats.map((s) =>
          ((s.amount / (total || 1)) * 100).toFixed(1),
        ),
        total,
      };
    };
    const response = {
      status: "success",
      metadata: {
        period: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
        type,
      },
      income: formatData(incomeStats),
      expense: formatData(expenseStats),
    };

    if (compare === "previousMonth") {
      const { prevStart, prevEnd } = getPreviousRange(start, end, compare);
      const prevIncomeStats = await aggregateType("income", prevStart, prevEnd);
      const prevExpenseStats = await aggregateType("expense", prevStart, prevEnd);
      response.comparison = {
        period: `${prevStart.toLocaleDateString()} - ${prevEnd.toLocaleDateString()}`,
        income: formatData(prevIncomeStats),
        expense: formatData(prevExpenseStats),
      };
    }

    return res.status(200).json(response);
  }

  const stats = await aggregateType(type, start, end);
  const total = stats.reduce((a, b) => a + b.amount, 0);
  const response = {
    status: "success",
    metadata: {
      period: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      type,
      totalAmount: total,
      currency: "INR",
    },
    labels: stats.map((s) => s._id),
    datasets: [
      {
        data: stats.map((s) => s.amount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
    percentages: stats.map((s) => ((s.amount / (total || 1)) * 100).toFixed(1)),
    summary: {
      highestCategory: stats[0]
        ? {
            name: stats[0]._id,
            amount: stats[0].amount,
            percentage: ((stats[0].amount / (total || 1)) * 100).toFixed(1),
          }
        : null,
      lowestCategory: stats[stats.length - 1]
        ? {
            name: stats[stats.length - 1]._id,
            amount: stats[stats.length - 1].amount,
            percentage: (
              (stats[stats.length - 1].amount / (total || 1)) *
              100
            ).toFixed(1),
          }
        : null,
    },
  };

  if (compare === "previousMonth") {
    const { prevStart, prevEnd } = getPreviousRange(start, end, compare);
    const prevStats = await aggregateType(type, prevStart, prevEnd);
    const prevTotal = prevStats.reduce((a, b) => a + b.amount, 0);
    response.comparison = {
      period: `${prevStart.toLocaleDateString()} - ${prevEnd.toLocaleDateString()}`,
      totalAmount: prevTotal,
      labels: prevStats.map((s) => s._id),
      datasets: [
        {
          data: prevStats.map((s) => s.amount),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
      percentages: prevStats.map((s) =>
        ((s.amount / (prevTotal || 1)) * 100).toFixed(1),
      ),
    };
  }

  res.status(200).json(response);
});

/**
 * 3. TRENDS OVER TIME (Line Chart)
 */
export const getTrends = catchAsync(async (req, res, next) => {
  const {
    period,
    fromDate,
    toDate,
    year,
    month,
    quarter,
    type = "both",
    groupBy = "day",
    compare,
    includeProjection = "false",
  } = req.query;
  const { start, end } = getDateRange(
    period,
    fromDate,
    toDate,
    year,
    month,
    quarter,
  );
  const userId = req.user.role === "admin" ? null : req.user._id;

  const getAgg = async (s, e) => {
    let g = { year: { $year: "$date" } };
    if (groupBy === "month") g.month = { $month: "$date" };
    else if (groupBy === "week") g.week = { $week: "$date" };
    else g.day = { $dayOfMonth: "$date" };
    return await Record.aggregate([
      {
        $match: {
          date: { $gte: s, $lte: e },
          ...(userId && { user: new mongoose.Types.ObjectId(userId) }),
        },
      },
      {
        $group: {
          _id: g,
          income: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 } },
    ]);
  };

  const current = await getAgg(start, end);
  const datasets = [];
  if (type === "income" || type === "both")
    datasets.push({
      label: "Current Income",
      data: current.map((s) => s.income),
      borderColor: "rgb(75, 192, 192)",
      tension: 0.4,
    });
  if (type === "expense" || type === "both")
    datasets.push({
      label: "Current Expense",
      data: current.map((s) => s.expense),
      borderColor: "rgb(255, 99, 132)",
      tension: 0.4,
    });

  if (compare && compare !== "none") {
    const { prevStart, prevEnd } = getPreviousRange(start, end, compare);
    const previous = await getAgg(prevStart, prevEnd);
    if (type === "income" || type === "both")
      datasets.push({
        label: "Prev Income",
        data: previous.map((s) => s.income),
        borderColor: "rgba(75, 192, 192, 0.4)",
        borderDash: [5, 5],
      });
    if (type === "expense" || type === "both")
      datasets.push({
        label: "Prev Expense",
        data: previous.map((s) => s.expense),
        borderColor: "rgba(255, 99, 132, 0.4)",
        borderDash: [5, 5],
      });
  }

  const response = {
    status: "success",
    metadata: {
      groupBy,
      type,
      startDate: start.toLocaleDateString(),
      endDate: end.toLocaleDateString(),
    },
    labels: current.map(
      (s) =>
        `${s._id.day || ""}${s._id.month ? "/" + s._id.month : ""}/${s._id.year}`,
    ),
    datasets,
  };

  if (includeProjection === "true") {
    const projectionCount =
      groupBy === "day" ? 30 : groupBy === "week" ? 8 : 12;
    const makeProjection = (series = []) => {
      if (!series.length) return new Array(projectionCount).fill(0);
      const avg =
        series.reduce((sum, val) => sum + val, 0) / series.length;
      return new Array(projectionCount).fill(Math.round(avg));
    };

    const projectionLabels = [];
    const baseDate = new Date(end);
    for (let i = 1; i <= projectionCount; i += 1) {
      const d = new Date(baseDate);
      if (groupBy === "month") d.setMonth(d.getMonth() + i);
      else if (groupBy === "week") d.setDate(d.getDate() + i * 7);
      else d.setDate(d.getDate() + i);
      projectionLabels.push(d.toISOString().split("T")[0]);
    }

    const projectionDatasets = [];
    if (type === "income" || type === "both") {
      projectionDatasets.push({
        label: "Projected Income",
        data: makeProjection(current.map((s) => s.income)),
        borderColor: "rgba(75, 192, 192, 0.6)",
        borderDash: [4, 4],
        tension: 0.4,
      });
    }
    if (type === "expense" || type === "both") {
      projectionDatasets.push({
        label: "Projected Expense",
        data: makeProjection(current.map((s) => s.expense)),
        borderColor: "rgba(255, 99, 132, 0.6)",
        borderDash: [4, 4],
        tension: 0.4,
      });
    }

    response.projection = {
      labels: projectionLabels,
      datasets: projectionDatasets,
    };
  }

  res.status(200).json(response);
});

/**
 * 4. STACKED BAR (Income vs Expense by Category)
 */
export const getStackedCategory = catchAsync(async (req, res, next) => {
  const { period, fromDate, toDate, year, month, quarter, filter } = req.query;
  const { start, end } = getDateRange(
    period,
    fromDate,
    toDate,
    year,
    month,
    quarter,
  );
  const userId = req.user.role === "admin" ? null : req.user._id;

  let stats = await Record.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
        ...(userId && { user: new mongoose.Types.ObjectId(userId) }),
      },
    },
    {
      $group: {
        _id: "$category",
        income: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
        },
        expense: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
        },
      },
    },
    { $sort: { income: -1, expense: -1 } },
  ]);

  if (filter === "mixedOnly") {
    stats = stats.filter((s) => s.income > 0 && s.expense > 0);
  }

  const totalIncome = stats.reduce((a, b) => a + b.income, 0);
  const totalExpense = stats.reduce((a, b) => a + b.expense, 0);

  res.status(200).json({
    status: "success",
    metadata: {
      period: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      totalIncome,
      totalExpense,
      currency: req.query.currency || "INR",
    },
    labels: stats.map((s) => s._id),
    datasets: [
      {
        label: "Income",
        data: stats.map((s) => s.income),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        stack: "income",
      },
      {
        label: "Expense",
        data: stats.map((s) => s.expense),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        stack: "expense",
      },
    ],
    insights: {
      topIncomeCategory: stats[0]
        ? {
            name: stats[0]._id,
            amount: stats[0].income,
            percentage: ((stats[0].income / (totalIncome || 1)) * 100).toFixed(
              1,
            ),
          }
        : null,
      topExpenseCategory: [...stats].sort((a, b) => b.expense - a.expense)[0]
        ? {
            name: [...stats].sort((a, b) => b.expense - a.expense)[0]._id,
            amount: [...stats].sort((a, b) => b.expense - a.expense)[0].expense,
          }
        : null,
      savingsRate:
        totalIncome > 0
          ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) +
            "%"
          : "0%",
      categoriesWithOnlyIncome: stats
        .filter((s) => s.income > 0 && s.expense === 0)
        .map((s) => s._id),
      categoriesWithOnlyExpense: stats
        .filter((s) => s.expense > 0 && s.income === 0)
        .map((s) => s._id),
    },
  });
});

/**
 * 5. TOP EXPENSES (Horizontal Bar Chart)
 */
export const getTopExpenses = catchAsync(async (req, res, next) => {
  const {
    period,
    fromDate,
    toDate,
    year,
    month,
    quarter,
    limit = 5,
    compare,
  } = req.query;
  const { start, end } = getDateRange(
    period,
    fromDate,
    toDate,
    year,
    month,
    quarter,
  );
  const userId = req.user.role === "admin" ? null : req.user._id;

  const getTop = async (s, e) => {
    return await Record.aggregate([
      {
        $match: {
          date: { $gte: s, $lte: e },
          type: "expense",
          ...(userId && { user: new mongoose.Types.ObjectId(userId) }),
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: parseInt(limit) },
    ]);
  };

  const current = await getTop(start, end);
  const total = current.reduce((a, b) => a + b.total, 0);
  const response = {
    status: "success",
    metadata: {
      period: `Range: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      totalExpenses: total,
      currency: req.query.currency || "INR",
    },
    labels: current.map((r) => r._id),
    datasets: [
      {
        label: "Current (INR)",
        data: current.map((r) => r.total),
        backgroundColor: "rgba(255, 159, 64, 0.7)",
      },
    ],
    percentages: current.map((r) => ((r.total / (total || 1)) * 100).toFixed(1)),
    summary: {
      top1: current[0]
        ? {
            category: current[0]._id,
            amount: current[0].total,
            percentage: ((current[0].total / (total || 1)) * 100).toFixed(1),
          }
        : null,
      actionItems: current[0]
        ? [
            `${current[0]._id} is your biggest expense - consider cost-cutting here.`,
            "Review recurring subscriptions in your top categories.",
          ]
        : [],
    },
  };

  if (compare && compare !== "none") {
    const { prevStart, prevEnd } = getPreviousRange(start, end, compare);
    const previous = await getTop(prevStart, prevEnd);
    response.comparison = {
      previousData: previous.map((r) => r.total),
      changes: current.map((c) => {
        const p = previous.find((x) => x._id === c._id);
        const pVal = p ? p.total : 0;
        return {
          category: c._id,
          change:
            pVal === 0
              ? "+100%"
              : (((c.total - pVal) / pVal) * 100).toFixed(1) + "%",
          trend: c.total >= pVal ? "up" : "down",
        };
      }),
    };
  }
  res.status(200).json(response);
});

/**
 * 6. CUMULATIVE CASH FLOW (Area Chart)
 */
export const getCashFlow = catchAsync(async (req, res, next) => {
  const {
    period,
    fromDate,
    toDate,
    year,
    month,
    quarter,
    startingBalance = 0,
    includeProjection = "false",
  } = req.query;
  const { start, end } = getDateRange(
    period,
    fromDate,
    toDate,
    year,
    month,
    quarter,
  );
  const userId = req.user.role === "admin" ? null : req.user._id;

  const stats = await Record.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
        ...(userId && { user: new mongoose.Types.ObjectId(userId) }),
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$date" },
          month: { $month: "$date" },
          year: { $year: "$date" },
        },
        net: {
          $sum: {
            $cond: [
              { $eq: ["$type", "income"] },
              "$amount",
              { $subtract: [0, "$amount"] },
            ],
          },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
  ]);

  let rb = parseFloat(startingBalance);
  const data = stats.map((s) => {
    rb += s.net;
    return rb;
  });
  const response = {
    status: "success",
    metadata: {
      startingBalance: parseFloat(startingBalance),
      endingBalance: rb,
      netChange: rb - parseFloat(startingBalance),
    },
    labels: stats.map((s) => `${s._id.day}/${s._id.month}/${s._id.year}`),
    datasets: [
      {
        label: "Running Balance",
        data,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
      },
    ],
    analysis: {
      trend: rb >= parseFloat(startingBalance) ? "increasing" : "decreasing",
      financialHealth: rb >= parseFloat(startingBalance) ? "good" : "caution",
      recommendations: [
        rb >= parseFloat(startingBalance)
          ? "Your balance is trending upward - great job!"
          : "Your balance is trending downward - review your expenses.",
        "Consider building an emergency fund of 3-6 months of expenses.",
      ],
    },
  };

  if (includeProjection === "true") {
    const days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) || 1;
    const avg = (rb - parseFloat(startingBalance)) / days;
    response.projection = { next30Days: { expectedBalance: rb + avg * 30 } };
  }
  res.status(200).json(response);
});

/**
 * 7. COMPARISON DASHBOARD (Current vs Previous)
 */
export const getComparison = catchAsync(async (req, res, next) => {
  const {
    type = "mom",
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1,
  } = req.query;
  const userId = req.user.role === "admin" ? null : req.user._id;
  let cs, ce, ps, pe;
  const ty = parseInt(year);
  const tm = parseInt(month);

  if (type === "mom") {
    cs = new Date(ty, tm - 1, 1);
    ce = new Date(ty, tm, 0, 23, 59, 59);
    ps = new Date(ty, tm - 2, 1);
    pe = new Date(ty, tm - 1, 0, 23, 59, 59);
  } else if (type === "yoy") {
    cs = new Date(ty, tm - 1, 1);
    ce = new Date(ty, tm, 0, 23, 59, 59);
    ps = new Date(ty - 1, tm - 1, 1);
    pe = new Date(ty - 1, tm, 0, 23, 59, 59);
  } else {
    // Default mom
    cs = new Date(ty, tm - 1, 1);
    ce = new Date(ty, tm, 0, 23, 59, 59);
    ps = new Date(ty, tm - 2, 1);
    pe = new Date(ty, tm - 1, 0, 23, 59, 59);
  }

  const getT = async (s, e) => {
    const agg = await Record.aggregate([
      {
        $match: {
          date: { $gte: s, $lte: e },
          ...(userId && { user: new mongoose.Types.ObjectId(userId) }),
        },
      },
      {
        $group: {
          _id: null,
          income: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
    ]);
    return agg[0] || { income: 0, expense: 0 };
  };

  const curr = await getT(cs, ce);
  const prev = await getT(ps, pe);
  const calcChange = (c, p) =>
    p === 0 ? (c > 0 ? "+100%" : "0%") : (((c - p) / p) * 100).toFixed(1) + "%";

  const wins = [];
  const concerns = [];
  if (curr.income > prev.income)
    wins.push(`Income increased by ${calcChange(curr.income, prev.income)}`);
  if (curr.expense < prev.expense)
    wins.push(`Expenses decreased by ${calcChange(curr.expense, prev.expense)}`);
  if (curr.expense > prev.expense)
    concerns.push(
      `Expenses increased by ${calcChange(curr.expense, prev.expense)}`,
    );

  res.status(200).json({
    status: "success",
    metadata: {
      comparison: type.toUpperCase(),
      current: cs.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      previous: ps.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    },
    current: {
      income: curr.income,
      expense: curr.expense,
      savings: curr.income - curr.expense,
      savingsRate:
        curr.income > 0
          ? (((curr.income - curr.expense) / curr.income) * 100).toFixed(1) +
            "%"
          : "0%",
    },
    previous: {
      income: prev.income,
      expense: prev.expense,
      savings: prev.income - prev.expense,
    },
    changes: {
      income: {
        percentage: calcChange(curr.income, prev.income),
        trend: curr.income >= prev.income ? "up" : "down",
      },
      expense: {
        percentage: calcChange(curr.expense, prev.expense),
        trend: curr.expense >= prev.expense ? "up" : "down",
      },
    },
    insights: {
      summary:
        curr.income - curr.expense > prev.income - prev.expense
          ? "Your financial health is improving!"
          : "Review your spending to boost savings.",
      wins,
      concerns,
      recommendations: [
        "Focus on your top expense categories to find savings.",
        "Ensure all income sources are being tracked correctly.",
      ],
    },
  });
});
