const mongoose = require("mongoose")

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

module.exports = mongoose.model("Item", ItemSchema)
