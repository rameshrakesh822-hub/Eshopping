
const products = [
    { id: 1, name: "Smartphone", price: 15000, image: "📱" },
    { id: 2, name: "Laptop", price: 45000, image: "💻" },
    { id: 3, name: "Headphones", price: 1500, image: "🎧" },
    { id: 4, name: "Smart Watch", price: 2500, image: "⌚" },
    { id: 5, name: "Camera", price: 12000, image: "📷" },
    { id: 6, name: "Keyboard", price: 1000, image: "⌨️" }
];

// Get cart from browser storage
function getCart() {
    return JSON.parse(localStorage.getItem("shopzoneCart")) || [];
}

// Save cart in browser storage
function saveCart(cart) {
    localStorage.setItem("shopzoneCart", JSON.stringify(cart));
}

// Display products
const productList = document.getElementById("product-list");

if (productList) {
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.image}</div>
            <h3>${product.name}</h3>
            <p class="product-price">₹${product.price.toLocaleString("en-IN")}</p>
            <button class="btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join("");
}

// Add product to cart
function addToCart(productId) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    saveCart(cart);
    alert("Product added to cart!");
}

// Display cart items
function displayCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems || !cartTotal) return;

    const cart = getCart();
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        cartTotal.textContent = "0";
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);

        if (!product) return "";

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return `
            <div class="cart-item">
                <div>
                    <h3>${product.image} ${product.name}</h3>
                    <p>₹${product.price.toLocaleString("en-IN")} each</p>
                </div>

                <div>
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    <strong>${item.quantity}</strong>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>

                <strong>₹${subtotal.toLocaleString("en-IN")}</strong>

                <button onclick="removeItem(${item.id})">Remove</button>
            </div>
        `;
    }).join("");

    cartTotal.textContent = total.toLocaleString("en-IN");
}

// Change product quantity
function changeQuantity(productId, amount) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += amount;

    const updatedCart = cart.filter(item => item.quantity > 0);

    saveCart(updatedCart);
    displayCart();
}

// Remove product
function removeItem(productId) {
    const updatedCart = getCart().filter(item => item.id !== productId);

    saveCart(updatedCart);
    displayCart();
}

// Login form demo
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const message = document.getElementById("login-message");

        message.textContent = "Login form submitted for " + email;
    });
}

// Checkout demo
const checkoutButton = document.getElementById("checkout-btn");

if (checkoutButton) {
    checkoutButton.addEventListener("click", function() {
        const cart = getCart();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        alert("Checkout will be connected to the backend later.");
    });
}

// Run cart display when cart page opens
displayCart();
