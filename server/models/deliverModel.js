const mongoose = require("mongoose");

const deliverSchema = new mongoose.Schema({
  deliverFee: { type: Number, default: 0 },
  description: { type: String },

}, { timestamps: true });

const Deliver = mongoose.model("Deliver", deliverSchema);
module.exports = Deliver;
