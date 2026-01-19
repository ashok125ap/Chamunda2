// મેનૂ આઇટમ્સ ડેટા - ઝડપી લોડ થાય તેવા ફોટા
const menuItems = [
    {
        id: 1,
        name: "ચા",
        description: "ગરમ અને સ્વાદિષ્ટ ચા",
        price: 15,
        category: "drink",
        image: "https://images.unsplash.com/photo-1567337710282-00832b415979?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 2,
        name: "કોફી",
        description: "તાજા બનાવેલી કોફી",
        price: 20,
        category: "drink",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 3,
        name: "કડી",
        description: "સ્પાઇસી અને ટેસ્ટી કડી",
        price: 40,
        category: "snack",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 4,
        name: "પકોડા",
        description: "ક્રિસ્પી અને સ્વાદિષ્ટ પકોડા",
        price: 30,
        category: "snack",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 5,
        name: "પૌંઆ",
        description: "નરમ અને સ્વાદિષ્ટ પૌંઆ",
        price: 50,
        category: "snack",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 6,
        name: "દાલવાટિકા",
        description: "સ્પાઇસી દાલવાટિકા",
        price: 35,
        category: "snack",
        image: "https://images.unsplash.com/photo-1563379091339-03246963d9d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 7,
        name: "ખમણ",
        description: "ટેસ્ટી ખમણ",
        price: 45,
        category: "snack",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
];

// કાર્ટ ડેટા
let cart = JSON.parse(localStorage.getItem('chamunda_cart')) || [];

// DOM લોડ થયે
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// એપ ઇનિશિયલાઇઝ
function initializeApp() {
    preloadImages();
    displayMenuItems();
    setupEventListeners();
    updateCartDisplay();
    updateCartCount();
    
    // મોબાઈલ મેનૂ ટોગલ
    setupMobileMenu();
}

// ફોટા પ્રીલોડ
function preloadImages() {
    const images = menuItems.map(item => item.image);
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// મેનૂ આઇટમ્સ ડિસ્પ્લે
function displayMenuItems(filter = 'all') {
    const menuGrid = document.querySelector('.menu-grid');
    menuGrid.innerHTML = '';

    const filteredItems = filter === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === filter);

    filteredItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.dataset.category = item.category;
        
        menuItem.innerHTML = `
            <div class="menu-item-image">
                <div class="image-loading"></div>
                <img src="${item.image}" 
                     alt="${item.name}" 
                     loading="lazy"
                     onload="this.previousElementSibling.style.display='none'; this.style.opacity='1'"
                     style="opacity: 0; transition: opacity 0.3s ease;">
                <div class="image-fallback">${item.name}</div>
            </div>
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3>${item.name}</h3>
                    <span class="price">₹${item.price}</span>
                </div>
                <span class="category">${item.category === 'drink' ? 'પીણાં' : 'નાસ્તો'}</span>
                <p>${item.description}</p>
                <button class="add-to-cart" onclick="addToCart(${item.id})" data-item-id="${item.id}">
                    <i class="fas fa-cart-plus"></i> કાર્ટમાં ઍડ કરો
                </button>
            </div>
        `;
        
        menuGrid.appendChild(menuItem);
    });
}

// ઇવેન્ટ લિસ્નર્સ
function setupEventListeners() {
    // ફિલ્ટર બટન્સ
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            displayMenuItems(this.dataset.filter);
        });
    });

    // કાર્ટ ખાલી કરો
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    
    // WhatsApp ઓર્ડર
    document.getElementById('orderWhatsAppBtn').addEventListener('click', placeWhatsAppOrder);
    
    // સ્મૂથ સ્ક્રોલિંગ
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // મોબાઈલ મેનૂ બંધ
                if(window.innerWidth <= 768) {
                    document.querySelector('.nav-links').classList.remove('active');
                }
            }
        });
    });
}

// મોબાઈલ મેનૂ
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // મેનૂ બંધ કરવા બહાર ક્લિક કરવા
    document.addEventListener('click', function(event) {
        if(!event.target.closest('.nav-links') && !event.target.closest('.menu-toggle')) {
            navLinks.classList.remove('active');
        }
    });
}

// કાર્ટમાં ઍડ
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if(!item) return;
    
    const existingItem = cart.find(i => i.id === itemId);
    
    if(existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${item.name} કાર્ટમાં ઍડ થયું!`);
}

// કાર્ટ અપડેટ
function updateCart() {
    localStorage.setItem('chamunda_cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

// કાર્ટ ડિસ્પ્લે અપડેટ
function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const totalItemsElement = document.querySelector('.total-items strong');
    const totalPriceElement = document.querySelector('.total-price strong');
    const cartTotalPrice = document.querySelector('#cartTotalPrice');
    
    if(cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>તમારી કાર્ટ ખાલી છે</p>
                <a href="#menu" class="btn-primary">મેનૂ જુઓ</a>
            </div>
        `;
        totalItemsElement.textContent = '0';
        totalPriceElement.textContent = '₹0';
        if(cartTotalPrice) cartTotalPrice.textContent = '₹0';
        return;
    }
    
    let totalItems = 0;
    let totalPrice = 0;
    let cartItemsHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalItems += item.quantity;
        totalPrice += itemTotal;
        
        cartItemsHTML += `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price} પ્રતિ</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})" title="રીમૂવ કરો">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    // ટોટલ રો
    cartItemsHTML += `
        <div class="cart-total">
            <h4>કુલ રકમ: <span id="cartTotalPrice">₹${totalPrice}</span></h4>
        </div>
    `;
    
    cartItemsContainer.innerHTML = cartItemsHTML;
    totalItemsElement.textContent = totalItems;
    totalPriceElement.textContent = `₹${totalPrice}`;
}

// કાર્ટ કાઉન્ટ અપડેટ
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

// કાર્ટમાં ક્વાન્ટિટી અપડેટ
function updateCartQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if(item) {
        item.quantity += change;
        if(item.quantity < 1) {
            removeFromCart(itemId);
        } else {
            updateCart();
        }
    }
}

// કાર્ટમાંથી રીમૂવ
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
    showNotification('આઇટમ રીમૂવ થઈ ગઈ!');
}

// કાર્ટ ખાલી કરો
function clearCart() {
    if(cart.length === 0) {
        showNotification('કાર્ટ પહેલેથી ખાલી છે!');
        return;
    }
    
    if(confirm('શું તમે ખરેખર કાર્ટ ખાલી કરવા માંગો છો?')) {
        cart = [];
        updateCart();
        showNotification('કાર્ટ ખાલી કરવામાં આવ્યો!');
    }
}

// WhatsApp ઓર્ડર
function placeWhatsAppOrder() {
    if(cart.length === 0) {
        showNotification('કૃપા કરીને પહેલાં કાર્ટમાં કંઈક ઍડ કરો!');
        return;
    }
    
    let message = "નમસ્તે! ચામુંડા ચા નાસ્તા માંથી ઓર્ડર:\n\n";
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `• ${item.name}: ${item.quantity} × ₹${item.price} = ₹${itemTotal}\n`;
    });
    
    message += `\n• કુલ રકમ: ₹${total}\n\n`;
    message += `મારું નામ: [તમારું નામ]\n`;
    message += `સરનામું: [ડિલિવરી સરનામું]\n`;
    message += `ફોન નંબર: [તમારો નંબર]\n\n`;
    message += `કૃપા કરીને આ ઓર્ડરની પુષ્ટિ કરો. આભાર!`;
    
    const whatsappNumber = "919662787286";
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}

// નોટિફિકેશન
function showNotification(message) {
    // જૂની નોટિફિકેશન હટાવો
    const oldNotification = document.querySelector('.notification');
    if(oldNotification) oldNotification.remove();
    
    // નવી નોટિફિકેશન બનાવો
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        max-width: 300px;
        word-break: break-word;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 3 સેકન્ડ પછી હટાવો
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// CSS એનિમેશન ઍડ કરો
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { 
            transform: translateX(100%); 
            opacity: 0; 
        }
        to { 
            transform: translateX(0); 
            opacity: 1; 
        }
    }
    
    @keyframes slideOut {
        from { 
            transform: translateX(0); 
            opacity: 1; 
        }
        to { 
            transform: translateX(100%); 
            opacity: 0; 
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease;
    }
`;
document.head.appendChild(style);

// પેજ લોડ થયે ફેડ ઇન એફેક્ટ
window.addEventListener('load', function() {
    document.body.classList.add('fade-in');
});
