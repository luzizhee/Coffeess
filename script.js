// ===========================
// Coffee Prices
// ===========================
const coffeePrices = {
    "Cappuccino": 3.75,
    "Espresso": 2.50,
    "Iced Americano": 3.25,
    "Latte": 4.00,
    "Iced Matcha": 4.25,
    "Caramel Macchiato": 4.50,
    "White Chocolate Mocha": 4.75,
    "Flat White": 4.25
  };
  
  // ===========================
  // Cart State
  // ===========================
  let cart = {};
  
  // ===========================
  // Cached DOM Elements
  // ===========================
  const cartList = document.getElementById('cart-list');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');
  const cartSidebar = document.getElementById('cart-sidebar');
  const checkoutOverlay = document.getElementById('checkout-overlay');
  const checkoutForm = document.getElementById('checkout-form');
  const thankYouSection = document.getElementById('thank-you');
  const orderSummary = document.getElementById('order-summary');
  
  // Rewards Sidebar Elements
  const rewardsSidebar = document.querySelector('.sidebar');
  const joinBtn = document.querySelector('.btn-join');
  const closeSidebarBtn = document.querySelector('.close-btn');
  const registerForm = document.getElementById('register-form');
  const accountInfo = document.querySelector('.account-info');
  const rewardPointsEl = document.getElementById('reward-points');
  
  // ===========================
  // Rewards Sidebar Logic
  // ===========================
  joinBtn?.addEventListener('click', () => {
    rewardsSidebar?.classList.add('open');
    accountInfo?.classList.add('hidden');
    registerForm?.classList.remove('hidden');
    registerForm?.reset();
  });
  
  closeSidebarBtn?.addEventListener('click', () => {
    rewardsSidebar?.classList.remove('open');
  });
  
  // Reward Points Animation
  function animateCountUp(element, target, duration = 1500) {
    let start = 0;
    const steps = duration / 30;
    const increment = target / steps;
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target;
        clearInterval(interval);
      } else {
        element.textContent = Math.floor(start);
      }
    }, 30);
  }
  
  // Registration Form Submission with Welcome Points
  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = registerForm.elements['name']?.value.trim();
    const email = registerForm.elements['email']?.value.trim();
  
    if (!name || !email) {
      alert('Please enter your name and email.');
      return;
    }
  
    // Hide form, show account info
    registerForm.classList.add('hidden');
    accountInfo.classList.remove('hidden');
    accountInfo.querySelector('h3').textContent = `Welcome, ${name}!`;
  
    // Animate reward points
    animateCountUp(rewardPointsEl, 50);
  
    // Show popup
    const popup = document.createElement('div');
    popup.className = 'points-popup';
    popup.textContent = '🎉 You’ve earned 50 welcome points!';
    document.body.appendChild(popup);
  
    setTimeout(() => {
      popup.remove();
    }, 4000);
  });
  
  // ===========================
  // Cart Logic
  // ===========================
  function loadCart() {
    const stored = localStorage.getItem('cart');
    if (stored) cart = JSON.parse(stored);
    updateCartUI();
  }
  
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  function addToCart(coffeeName, quantity = 1) {
    if (quantity < 1) return;
    cart[coffeeName] = (cart[coffeeName] || 0) + quantity;
    saveCart();
    updateCartUI();
    openCart();
  }
  
  function removeFromCart(coffeeName) {
    if (!cart[coffeeName]) return;
    cart[coffeeName]--;
    if (cart[coffeeName] <= 0) delete cart[coffeeName];
    saveCart();
    updateCartUI();
  }
  
  function updateCartUI() {
    cartList.innerHTML = '';
    let total = 0, itemCount = 0;
  
    for (const [coffee, qty] of Object.entries(cart)) {
      const price = coffeePrices[coffee] || 0;
      const lineTotal = price * qty;
      total += lineTotal;
      itemCount += qty;
  
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="cart-item-name" title="${coffee}">
          ${coffee} x ${qty} - $${lineTotal.toFixed(2)}
        </span>
        <div class="cart-item-controls" role="group" aria-label="Modify quantity for ${coffee}">
          <button class="qty-btn minus" aria-label="Decrease ${coffee}">−</button>
          <button class="qty-btn plus" aria-label="Increase ${coffee}">+</button>
        </div>
      `;
  
      li.querySelector('.minus').addEventListener('click', () => removeFromCart(coffee));
      li.querySelector('.plus').addEventListener('click', () => addToCart(coffee));
  
      cartList.appendChild(li);
    }
  
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = itemCount;
    checkoutBtn.disabled = itemCount === 0;
  }
  
  // ===========================
  // Cart Sidebar Toggle
  // ===========================
  function openCart() {
    cartSidebar.classList.add('open');
    cartSidebar.setAttribute('aria-hidden', 'false');
  }
  
  function closeCart() {
    cartSidebar.classList.remove('open');
    cartSidebar.setAttribute('aria-hidden', 'true');
  }
  
  // ===========================
  // Checkout Logic
  // ===========================
  function showCheckout() {
    checkoutOverlay.classList.add('active');
    checkoutOverlay.setAttribute('aria-hidden', 'false');
    renderOrderSummary();
  }
  
  function hideCheckout() {
    checkoutOverlay.classList.remove('active');
    checkoutOverlay.setAttribute('aria-hidden', 'true');
    thankYouSection.hidden = true;
    checkoutForm.style.display = 'block';
    checkoutForm.reset();
  }
  
  function renderOrderSummary() {
    orderSummary.innerHTML = '';
    let total = 0;
  
    for (const [coffee, qty] of Object.entries(cart)) {
      const price = coffeePrices[coffee] || 0;
      const lineTotal = price * qty;
      total += lineTotal;
  
      const p = document.createElement('p');
      p.textContent = `${coffee} x ${qty} = $${lineTotal.toFixed(2)}`;
      orderSummary.appendChild(p);
    }
  
    const totalP = document.createElement('p');
    totalP.textContent = `Total: $${total.toFixed(2)}`;
    totalP.style.fontWeight = 'bold';
    orderSummary.appendChild(totalP);
  }
  
  // ===========================
  // Event Listeners
  // ===========================
  document.getElementById('cart-toggle')?.addEventListener('click', () => {
    cartSidebar.classList.contains('open') ? closeCart() : openCart();
  });
  
  document.getElementById('close-cart')?.addEventListener('click', closeCart);
  
  checkoutBtn?.addEventListener('click', () => {
    closeCart();
    showCheckout();
  });
  
  document.getElementById('cancel-checkout')?.addEventListener('click', hideCheckout);
  
  checkoutForm?.addEventListener('submit', (e) => {
    e.preventDefault();
  
    // Normally, you would send form data to server here
  
    checkoutForm.style.display = 'none';
    thankYouSection.hidden = false;
  
    cart = {};
    saveCart();
    updateCartUI();
  });
  
  document.getElementById('close-thank-you')?.addEventListener('click', hideCheckout);
  
  // ===========================
  // Initialize
  // ===========================
  loadCart();