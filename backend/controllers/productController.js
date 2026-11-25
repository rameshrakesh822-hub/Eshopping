
const { pool } = require("../config/db");

async function getProducts(req, res) {
    try {
        const [products] = await pool.execute(
            `SELECT id, name, description, price, stock, image_url
             FROM products
             ORDER BY id DESC`
        );

        res.status(200).json({
            count: products.length,
            products
        });

    } catch (error) {
        console.error("Get Products Error:", error.message);

        res.status(500).json({
            message: "Unable to fetch products"
        });
    }
}

async function getProductById(req, res) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const [products] = await pool.execute(
            `SELECT id, name, description, price, stock, image_url
             FROM products
             WHERE id = ?`,
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            product: products[0]
        });

    } catch (error) {
        console.error("Get Product Error:", error.message);

        res.status(500).json({
            message: "Unable to fetch product"
        });
    }
}

module.exports = {
    getProducts,
    getProductById
};
