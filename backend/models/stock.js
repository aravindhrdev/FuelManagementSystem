import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
  branch_id: {
      type: String,
      required: true,
  },
  fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'cng'],
      required: true,
  },
  transaction_id: {
    type: Number,
    required: true,
  },
  quantity: {
      type: Number,
      required: true,
  },
  transactionDate: {
    type: Date,
    required: true,
  },
  payment_method: {
    type: String,
    enum: ['cash','card','upi'],
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  employee_id: {
    type: Number,
    required: true,
  },
  pump_id: {
    type: String,
    required: true,
  }
});

const FuelTransaction = model('FuelTransaction', transactionSchema);

export default FuelTransaction;
