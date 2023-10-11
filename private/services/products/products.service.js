const Product = require("../../schema/Product")

async function createProduct({ req }) {
    try {
        const results = await Product.create({ ...req.body })
        return { message: "Shop created successfully" }
    } catch (error) {
        return error
    }
}

module.exports = {
    createProduct
}