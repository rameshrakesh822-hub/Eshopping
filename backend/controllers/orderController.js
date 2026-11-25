
const { pool } = require("../config/db");

async function createOrder(req, res) {
    let connection;

    try {
        const { items } = req.body;
        const userId = req.user.id;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Order must contain products"
            });
        }

        const quantities = new Map();

        for (const item of items) {
            const productId = Number(item.productId);
            const quantity = Number(item.quantity);

            if (
                !Number.isInteger(productId) ||
                productId <= 0 ||
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {
                return res.status(400).json({
                    message: "Invalid product ID or quantity"
                });
            }

            quantities.set(
                productId,
                (quantities.get(productId) || 0) + quantity
            );
        }

        connection = await pool.getConnection();

        await connection.beginTransaction();

        let totalAmount = 0;
        const orderItems = [];

        for (const [productId, quantity] of quantities) {
            const [products] = await connection.execute(
                `SELECT id, name, price, stock
                 FROM products
                 WHERE id = ?
                 FOR UPDATE`,
                [productId]
            );

            if (products.length === 0) {
                throw new Error("Product not found: " + productId);
            }

            const product = products[0];

            if (product.stock < quantity) {
                throw new Error(
                    "Insufficient stock for " + product.name
                );
            }

            const price = Number(product.price);

            totalAmount += price * quantity;

            orderItems.push({
                productId,
                quantity,
                price
            });
        }

        const [orderResult] = await connection.execute(
            `INSERT INTO orders
             (user_id, total_amount, status)
             VALUES (?, ?, ?)`,
            [userId, totalAmount.toFixed(2), "PLACED"]
        );

        const orderId = orderResult.insertId;

        for (const item of orderItems) {
            await connection.execute(
                `INSERT INTO order_items
                 (order_id, product_id, quantity, price)
                 VALUES (?, ?, ?, ?)`,
                [
                    orderId,
                    item.productId,
                    item.quantity,
                    item.price
                ]
            );

            await connection.execute(
                `UPDATE products
                 SET stock = stock - ?
                 WHERE id = ?`,
                [item.quantity, item.productId]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: "Order placed successfully",
            orderId,
            totalAmount
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error("Order Error:", error.message);

        const clientError =
            error.message.startsWith("Product not found") ||
            error.message.startsWith("Insufficient stock");

        res.status(clientError ? 400 : 500).json({
            message: clientError
                ? error.message
                : "Order creation failed"
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
}

async function getMyOrders(req, res) {
    try {
        const userId = req.user.id;

        const [orders] = await pool.execute(
            `SELECT
                o.id AS orderId,
                o.total_amount,
                o.status,
                o.created_at,
                oi.product_id,
                p.name AS product_name,
                oi.quantity,
                oi.price
             FROM orders o
             LEFT JOIN order_items oi
                ON o.id = oi.order_id
             LEFT JOIN products p
                ON oi.product_id = p.id
             WHERE o.user_id = ?
             ORDER BY o.created_at DESC`,
            [userId]
        );

        res.status(200).json({
            orders
        });

    } catch (error) {
        console.error("Get Orders Error:", error.message);

        res.status(500).json({
            message: "Unable to fetch orders"
        });
    }
}

module.exports = {
    createOrder,
    getMyOrders
};
