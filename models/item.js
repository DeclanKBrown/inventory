const mongoose = require("mongoose")
const { DateTime } = require("luxon");

// Define a schema
const Schema = mongoose.Schema

const ItemSchema = new Schema({
  name:{ type: String, required: true, maxLength: 100 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  numberInStock: { type: Number, required: true },
  expiryDate: { type: Date },
});

ItemSchema.virtual("url").get(function () {
    return `/item/${this._id}`
})

ItemSchema.virtual('expiry_formatted').get(function () {
  return DateTime.fromJSDate(this.expiryDate).toISODate();
})

module.exports = mongoose.model("Item", ItemSchema)
