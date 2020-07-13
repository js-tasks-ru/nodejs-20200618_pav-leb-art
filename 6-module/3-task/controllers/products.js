const products = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const searchQuery = ctx.query.query

  await products.createIndexes()

  const query = { $text: { $search: searchQuery } };
  const docs = await products.find(query);

  ctx.body = {products: docs};
  ctx.status = 200;
};
