const Shop = require("../../schema/Shop")

async function createShop({ req }) {
    console.log(req.body)
    try {
        const results = await Shop.create({ ...req.body })
        return { message: "Shop created successfully" }

    } catch (error) {
        return error
    }
}

module.exports = {
    createShop
}