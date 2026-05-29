// Product data
const products = [
    {
        id: 1,
        name: "Air Max 90",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
        category: "Sneakers"
    },
    {
        id: 2,
        name: "Classic Leather",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=300&fit=crop",
        category: "Casual"
    },
    {
        id: 3,
        name: "Running Pro",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
        category: "Running"
    },
    {
        id: 4,
        name: "Chelsea Boots",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
        category: "Boots"
    },
    {
        id: 5,
        name: "Basketball High",
        price: 169.99,
        image: "https://images.unsplash.com/photo-1549298916-cb05f1639250?w=400&h=300&fit=crop",
        category: "Basketball"
    },
    {
        id: 6,
        name: "Loafers",
        price: 119.99,
        image: "https://images.unsplash.com/photo-1593405419493-4be1dcaeeded?w=400&h=300&fit=crop",
        category: "Formal"
    }
];

let cart = [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.getElementById('cart-total');
const searchIcon = document.getElementById('search-icon');
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');
const closeSearch = document.getElementById('close-search');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartUI();
    
    // Event listeners
    cartIcon.addEventListener('click', () => cartModal.classList.add('active'));
    closeCart.addEventListener('click', () => cartModal.classList.remove('active'));
    searchIcon.addEventListener('click', toggleSearch);
    closeSearch.addEventListener('click', toggleSearch);
    searchInput.addEventListener('input', handleSearch);
    
    // Close modal when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('active');
    });
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Toggle search bar
function toggleSearch() {
    searchBar.classList.toggle('active');
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
}

// Render products
function renderProducts(filteredProducts = products) {
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                <div class="product-badge">New</div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    renderCartItems();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    renderCartItems();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            renderCartItems();
        }
    }
}

// Update cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartTotal.textContent = calculateTotal().toFixed(2);
}

// Calculate total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Render cart items
function renderCartItems() {
    const cartItemsEl = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>';
        return;
    }
    
    cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: #dc3545; color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer;">Remove</button>
        </div>
    `).join('');
}

// Checkout
document.querySelector('.checkout-btn')?.addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert(`Thank you for your order! Total: $${calculateTotal().toFixed(2)}\n\n(Connect to Stripe/PayPal for real payments)`);
    cart = [];
    updateCartUI();
    renderCartItems();
    cartModal.classList.remove('active');
});