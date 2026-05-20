const menu = [
  { name: "Pork Adobo", category: "Lunch", price: 75, img: "../images/pork-adobo.png" },
  { name: "Chicken Curry", category: "Lunch", price: 80, img: "../images/chicken-curry.png" },
  { name: "Pork Sinigang", category: "Lunch", price: 85, img: "../images/pork-sinigang.png" },
  { name: "Beef Caldereta", category: "Lunch", price: 90, img: "../images/beef-caldereta.png" },
  { name: "Menudo", category: "Lunch", price: 75, img: "../images/menudo.png" },
  { name: "Fried Chicken", category: "Lunch", price: 85, img: "../images/fried-chicken.png" },
  { name: "Pork Chop", category: "Lunch", price: 80, img: "../images/pork-chop.png" },
  { name: "Sisig", category: "Lunch", price: 90, img: "../images/sisig.png" },
  { name: "Chicken Tinola", category: "Lunch", price: 80, img: "../images/tinola.png" },
  { name: "Bicol Express", category: "Lunch", price: 85, img: "../images/bicol-express.png" },

  { name: "Hotdog", category: "Breakfast", price: 40, img: "../images/hotdog.png" },
  { name: "Egg", category: "Breakfast", price: 15, img: "../images/egg.png" },
  { name: "Meatloaf", category: "Breakfast", price: 50, img: "../images/meatloaf.png" },
  { name: "Tocino", category: "Breakfast", price: 70, img: "../images/tocino.png" },
  { name: "Fried Bangus", category: "Breakfast", price: 85, img: "../images/fried-bangus.png" },

  { name: "Monggo", category: "Snacks", price: 50, img: "../images/monggo.png" },
  { name: "Tortang Talong", category: "Snacks", price: 45, img: "../images/tortang-talong.png" },
  { name: "Chopsuey", category: "Snacks", price: 60, img: "../images/chopsuey.png" },
  { name: "Ginataang Gulay", category: "Snacks", price: 55, img: "../images/ginataang-gulay.png" },
  { name: "Adobong Sitaw", category: "Snacks", price: 55, img: "../images/adobong-sitaw.png" },

  { name: "Water Bottle", category: "Drinks", price: 20, img: "../images/water-bottle.png" },
  { name: "Iced Tea", category: "Drinks", price: 25, img: "../images/iced-tea.png" },
  { name: "Soft Drinks", category: "Drinks", price: 30, img: "../images/softdrinks.png" }
];

let cart = [];
let selectedCategory = "All";

function displayMenu() {
  const grid = document.getElementById("menuGrid");
  const search = document.getElementById("searchFood").value.toLowerCase();

  grid.innerHTML = "";

  menu.forEach((item, index) => {
    const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
    const searchMatch = item.name.toLowerCase().includes(search);

    if (categoryMatch && searchMatch) {
      grid.innerHTML += `
        <div class="food-card">
          <img src="${item.img}" onerror="this.src='https://via.placeholder.com/300x180?text=Food+Image'">
          <h3>${item.name}</h3>
          <p>${item.category}</p>
          <div class="food-bottom">
            <b>₱${item.price}</b>
            <button onclick="addToCart(${index})">Add to Cart</button>
          </div>
        </div>
      `;
    }
  });
}

function filterCategory(category) {
  selectedCategory = category;

  document.querySelectorAll(".category").forEach(btn => {
    btn.classList.remove("active");
  });

  event.currentTarget.classList.add("active");
  displayMenu();
}

function addToCart(index) {
  const item = menu[index];
  const existingItem = cart.find(cartItem => cartItem.name === item.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  displayCart();
}

function increaseQuantity(index) {
  cart[index].quantity += 1;
  displayCart();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  displayCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  displayCart();
}

function displayCart() {
  const cartItems = document.getElementById("cartItems");
  const totalText = document.getElementById("total");

  let total = 0;
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "No items added.";
    totalText.innerText = "₱0";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <p>₱${item.price} each</p>
          <b>Subtotal: ₱${itemTotal}</b>
        </div>

        <div class="qty-controls">
          <button onclick="decreaseQuantity(${index})">−</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${index})">+</button>
        </div>

        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  totalText.innerText = "₱" + total;
}

function checkout() {
  if (cart.length === 0) {
    alert("Add food first.");
    return;
  }

  showTab("paymentTab");
}

function payNow() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = "NU" + Math.floor(1000 + Math.random() * 9000);
  const now = new Date();

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders.push({
    id: orderId,
    role: "Guest",
    items: cart,
    total: total,
    payment: "Cash on Pickup",
    status: "Preparing",
    date: now.toISOString().split("T")[0],
    time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("latestOrderId", orderId);

  cart = [];
  displayCart();

  updateTrackingFromStorage();
  showTab("trackTab", document.querySelectorAll(".nav-btn")[1]);
}

function showTab(tabId, clickedBtn) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  document.getElementById(tabId).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  if (clickedBtn) {
    clickedBtn.classList.add("active");
  }
}

function updateTrackingFromStorage() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const trackTab = document.getElementById("trackTab");

  if (orders.length === 0) {
    trackTab.innerHTML = `
      <div class="empty-track">
        <h1>📦 No Orders Yet</h1>
        <p>You haven't placed any orders. Add food to your cart and checkout first.</p>
        <button onclick="showTab('menuTab', document.querySelectorAll('.nav-btn')[0])">
          Go to Menu
        </button>
      </div>
    `;
    return;
  }

  trackTab.innerHTML = `<div class="orders-list"></div>`;
  const ordersList = trackTab.querySelector(".orders-list");

  orders.slice().reverse().forEach(order => {
    let step3 = "";
    let step4 = "";
    let fillClass = "";

    if (order.status === "Preparing") {
      step3 = "active";
    }

    if (order.status === "Ready to Pick Up" || order.status === "Picked Up") {
      step3 = "active";
      step4 = "active";
      fillClass = "full";
    }

    const itemsHTML = (order.items || []).map(item => {
      return `<li>${item.name} x${item.quantity}</li>`;
    }).join("");

    ordersList.innerHTML += `
      <div class="track-card">
        <div class="track-header">
          <div>
            <p>ORDER <span>#${order.id}</span></p>
            <small>${order.date || ""} ${order.time || ""}</small>
          </div>

          <div>
            <p>Status</p>
            <strong>${order.status}</strong>
          </div>
        </div>

        <div class="progress-line">
          <div class="progress-fill ${fillClass}"></div>

          <div class="track-step active">
            <span>✓</span>
            <p>Order Placed</p>
          </div>

          <div class="track-step active">
            <span>✓</span>
            <p>Payment</p>
          </div>

          <div class="track-step ${step3}">
            <span>${step3 ? "✓" : "●"}</span>
            <p>Preparing</p>
          </div>

          <div class="track-step ${step4}">
            <span>${step4 ? "✓" : "●"}</span>
            <p>Ready to Pick Up</p>
          </div>
        </div>

        <div class="track-summary">
          <h2>${order.status}</h2>
          <p>Total: ₱${order.total} | Payment: ${order.payment}</p>
          <ul>${itemsHTML}</ul>
        </div>
      </div>
    `;
  });
}

function logout() {
  document.getElementById("logoutModal").style.display = "flex";
}

function closeLogoutModal() {
  document.getElementById("logoutModal").style.display = "none";
}

function confirmLogout() {
  location.href = "../login/login.html";
}

displayMenu();
updateTrackingFromStorage();
setInterval(updateTrackingFromStorage, 1000);