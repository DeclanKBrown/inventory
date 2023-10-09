const mongoose = require("mongoose")

// Define a schema
const Schema = mongoose.Schema

const CatagorySchema = new Schema({
  name:{ type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 100 },
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }]
});

CatagorySchema.virtual("url").get(function () {
    return `/catagory/${this._id}`
})

module.exports = mongoose.model("Catagory", CatagorySchema)
