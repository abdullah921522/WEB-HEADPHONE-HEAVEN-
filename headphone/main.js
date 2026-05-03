// Product Data - Professional Selection
const products = [
    {
        id: 1,
        name: "Al Hamd Signature Wireless",
        price: 18500,
        brand: "Al Hamd",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 2,
        name: "Ronin R-9 Crystal Clear",
        price: 12500,
        brand: "Ronin",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 3,
        name: "Logitech G Pro X Wireless",
        price: 55000,
        brand: "Logitech",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 4,
        name: "Al Hamd Heritage ANC",
        price: 24000,
        brand: "Al Hamd",
        image: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 5,
        name: "Ronin V8 Gaming Engine",
        price: 9500,
        brand: "Ronin",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 6,
        name: "Logitech Zone Vibe 100",
        price: 32000,
        brand: "Logitech",
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=400"
    }
];

// State
let cart = JSON.parse(localStorage.getItem('soundwave_v3_cart')) || [];
let currentSlide = 0;

// Elements
const productContainer = document.getElementById('product-container');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsList = document.getElementById('cart-items-list');
const cartTotalAmount = document.getElementById('cart-total-amount');
const cartCountElements = document.querySelectorAll('.cart-count');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

// Slider Logic
function initSlider() {
    if (!slides.length) return;
    
    setInterval(() => {
        nextSlide();
    }, 5000);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
}

function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
}

function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Product Rendering
function renderProducts() {
    if (!productContainer) return;
    
    productContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <span class="subtitle" style="font-size: 0.6rem; letter-spacing: 3px; margin-bottom: 0.5rem; opacity: 0.6;">${product.brand}</span>
                <h3>${product.name}</h3>
                <span class="price">Rs. ${product.price.toLocaleString()}</span>
                <button class="btn btn-copper btn-block add-to-cart" data-id="${product.id}">Acquire Piece</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const product = products.find(p => p.id === id);
            addToCart(product);
        });
    });
}

// Cart Logic
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });
    updateCart();
    openCartSidebar();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCart() {
    localStorage.setItem('soundwave_v3_cart', JSON.stringify(cart));
    renderCart();
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    cartCountElements.forEach(el => el.textContent = count);
}

function renderCart() {
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p style="text-align:center; padding: 2rem; opacity: 0.5;">Your selection is empty.</p>';
        cartTotalAmount.textContent = 'Rs. 0';
        return;
    }
    
    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item" style="display:flex; gap:1.5rem; padding:1.5rem 0;">
            <img src="${item.image}" style="width:70px; height:70px; object-fit:cover; background:#1A1A1A;">
            <div>
                <h4 style="font-size:0.9rem; margin-bottom:0.3rem;">${item.name}</h4>
                <div style="color:var(--accent); font-weight:600; font-size:0.85rem;">Rs. ${item.price.toLocaleString()} x ${item.quantity}</div>
                <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:0.7rem; text-decoration:underline; margin-top:0.5rem;">Remove</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    cartTotalAmount.textContent = `Rs. ${total.toLocaleString()}`;
}

// UI Toggles
function openCartSidebar() {
    document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('overlay').classList.add('active');
}

function closeCartSidebar() {
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

// Events
document.querySelector('.cart-toggle').addEventListener('click', openCartSidebar);
document.querySelector('.close-cart').addEventListener('click', closeCartSidebar);
document.getElementById('overlay').addEventListener('click', closeCartSidebar);

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
});

window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 100) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

// Intersection Observer
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Global Export
window.removeFromCart = removeFromCart;

// Init
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    renderProducts();
    updateCart();
    document.querySelectorAll('section, .product-card').forEach(el => {
        el.classList.add('reveal-init');
        revealObserver.observe(el);
    });
});
