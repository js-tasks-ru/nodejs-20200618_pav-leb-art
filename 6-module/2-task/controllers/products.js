const productModel = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
	if (ctx.query.subcategory) {
		const products = await productModel.find({
			subcategory: ctx.query.subcategory
		}, '-__v')
		ctx.body = {
			products
		};
		ctx.status = 200;
	} else {
		await next()
	}

};

module.exports.productList = async function productList(ctx, next) {
	const products = await productModel.find({}, '-__v');
	ctx.body = {
		products
	};
	ctx.status = 200;
};

module.exports.productById = async function productById(ctx, next) {
	const id = ctx.URL.pathname.split('/').slice(-1)[0];
	try {
		const product = await productModel.findById(id, '-__v');
		if (!product) {
			ctx.status = 404;
			return;
		}
		ctx.body = {
			product
		};
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			ctx.status = 400;
			ctx.message = 'Invalid identifier'
			return;
		}

		throw error
	}

};