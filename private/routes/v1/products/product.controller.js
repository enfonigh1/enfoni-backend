const router = require("../router")

router.post("/create-product", async (req, res) => {
    try {
        return res.status(200).json(await createProduct({ req }))
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})