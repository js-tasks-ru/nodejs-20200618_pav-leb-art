const categoryModel = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  let categories = await categoryModel.find({}, '-__v')

  ctx.body = {categories};
  ctx.status = 200;
};
