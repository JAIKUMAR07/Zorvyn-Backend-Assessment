import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'A record must have an amount'],
      min: [1, 'Amount must be a positive number'],
    },
    type: {
      type: String,
      required: [true, 'A record must have a type (income/expense)'],
      enum: {
        values: ['income', 'expense'],
        message: 'Type must be either: income or expense',
      },
    },
    category: {
      type: String,
      required: [true, 'A record must have a category'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A record must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Record = mongoose.model('Record', recordSchema);

export default Record;
