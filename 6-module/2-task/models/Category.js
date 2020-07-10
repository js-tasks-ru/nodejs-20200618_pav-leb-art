const mongoose = require('mongoose');
const connection = require('../libs/connection');

const schemaOptions = {
  toJSON: {
    virtuals: true
  },
  toObject: {
    vistuals: true
  }
}

const subCategorySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
  },
  schemaOptions);

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
}, schemaOptions);

subCategorySchema.virtual('id').get(function () {
  return this._id;
});
categorySchema.virtual('id').get(function () {
  return this._id;
});

module.exports = connection.model('Category', categorySchema);