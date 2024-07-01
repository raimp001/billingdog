const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  icdCode: { type: String, required: true },
  patientId: { type: String, required: true },
  transactionHash: { type: String, required: true },
  visitType: { type: String, required: true },
  visitCategory: { type: String, required: true },
  complexity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

transactionSchema.index({ patientId: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
