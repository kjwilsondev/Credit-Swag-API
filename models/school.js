const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
    title: String,
    yearFounded: String,
    colors: Array
});

SchoolSchema.pre("save", function(next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
});

module.exports = mongoose.model("School", SchoolSchema);