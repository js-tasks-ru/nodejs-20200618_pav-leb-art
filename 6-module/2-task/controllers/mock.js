const category = require('../models/Category');
const product = require('../models/Product');

module.exports.fillMockData = async function mockData(ctx, next) {
    await category.deleteMany({});
    await product.deleteMany({});

    const products = [
        new product({
            title: 'Product1',
            images: ['image1'],
            category: '5d20d32d3a0676032a9a3172',
            subcategory: '5d20d32d3a0676032a9a3173',
            price: 10,
            description: 'Description bla'
        }),
        new product({
            title: 'Product2',
            images: ['image2'],
            category: '5d20d32d3a0676032a9a3179',
            subcategory: '5d20d32d3a0676032a9a3123',
            price: 20,
            description: 'Description1'
        })
    ];

    const categories = [
        new category({
            _id: '5d20d32d3a0676032a9a3111',
            title: 'Category2',
            subcategories: [{
                _id: '5d20d32d3a0676032a9a3123',
                title: 'Subcategory2'
            }]
        }),
        new category({
            _id: '5d20d32d3a0676032a9a3172',
            title: 'Category1',
            subcategories: [{
                _id: '5d20d32d3a0676032a9a3173',
                title: 'Subcategory1'
            }]
        })
    ];

    for (let doc of [...products, ...categories]) {
        await doc.save()
    }

    ctx.message = 'Mock data loaded'
    ctx.status = 200;
}