const { createShop } = require("../../../services/Shop/shop.service");
const router = require("../Users/auth.controller");


router.post("/create-shop", async (req, res) => {
    try {

        return res.status(200).json(await createShop({ req }))
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

module.exports = router;