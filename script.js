// ===== NAVBAR MOBILE MENU TOGGLE =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close menu when a link is clicked (mobile UX)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// ===== PRODUCTS FILTER =====
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button styling
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    productCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== ORDER FORM -> WHATSAPP =====
const orderForm = document.getElementById('orderForm');

orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const item = document.getElementById('item').value.trim();
  const message = document.getElementById('message').value.trim();

  let text = `Hi MSM Clothing! I'd like to place an order.%0A%0A`;
  text += `Name: ${name}%0A`;
  text += `Phone: ${phone}%0A`;
  text += `Item: ${item}%0A`;
  if (message) {
    text += `Note: ${message}%0A`;
  }

  const whatsappURL = `https://wa.me/94715461448?text=${text}`;
  window.open(whatsappURL, '_blank');
});
// ===== SHOPPING CART =====
let cart = JSON.parse(localStorage.getItem('msmCart')) || [];
 
const cartIconBtn = document.getElementById('cartIconBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const addToCartButtons = document.querySelectorAll('.btn-add-cart');
 
function saveCart() {
  localStorage.setItem('msmCart', JSON.stringify(cart));
}
 
function openCart() {
  cartSidebar.classList.add('active');
  cartOverlay.classList.add('active');
}
 
function closeCart() {
  cartSidebar.classList.remove('active');
  cartOverlay.classList.remove('active');
}
 
function renderCart() {
  cartItemsEl.innerHTML = '';
 
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
  } else {
    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>Rs. ${item.price.toLocaleString()}</p>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">-</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
        <button class="cart-item-remove" data-action="remove" data-id="${item.id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;
      cartItemsEl.appendChild(row);
    });
  }
 
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
 
  cartCountEl.textContent = totalItems;
  cartTotalEl.textContent = `Rs. ${totalPrice.toLocaleString()}`;
 
  saveCart();
}
 
function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  renderCart();
}
 
// Add to cart button clicks
addToCartButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const { id, name, price } = btn.dataset;
    addToCart(id, name, Number(price));
 
    // Quick visual feedback
    const originalText = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('added');
    }, 1000);
 
    openCart();
  });
});
 
// Qty +/- and remove (event delegation)
cartItemsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
 
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  const item = cart.find(i => i.id === id);
  if (!item) return;
 
  if (action === 'inc') {
    item.qty += 1;
  } else if (action === 'dec') {
    item.qty -= 1;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  } else if (action === 'remove') {
    cart = cart.filter(i => i.id !== id);
  }
 
  renderCart();
});
 
// Open/close sidebar
cartIconBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
 
// Checkout via WhatsApp
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty. Add some items first!');
    return;
  }
 
  let text = `Hi MSM Clothing! I'd like to order the following items:%0A%0A`;
  cart.forEach(item => {
    text += `- ${item.name} (x${item.qty}) - Rs. ${(item.price * item.qty).toLocaleString()}%0A`;
  });
 
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  text += `%0ATotal: Rs. ${totalPrice.toLocaleString()}`;
 
  const whatsappURL = `https://wa.me/94703738985?text=${text}`;
  window.open(whatsappURL, '_blank');
});

// Initial render on page load
renderCart();
