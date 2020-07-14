const products = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const searchQuery = ctx.query.query

  // await products.createIndexes()

  const query = { $text: { $search: searchQuery } };
  const opts = {score: { $meta: "textScore"} };
  const docs = await products
    .find(query, opts)
    .sort({score: { $meta: 'textScore' } })
    .limit(20);

  ctx.body = {products: docs};
  ctx.status = 200;
};
