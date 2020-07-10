const categoryModel = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  let categories = await categoryModel.find({}, '-__v')

  // categories = categories.map(cat => {
  //   delete cat['_id'];
  //   delete cat.subcategories['_id']
  //   return cat;
  // })
  // console.log(categories)
  ctx.body = {categories};
  ctx.status = 200;
};
