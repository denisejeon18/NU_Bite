function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const pendingContainer = document.getElementById("ordersContainer");
  const completedContainer = document.getElementById("completedContainer");
  const dateFilter = document.getElementById("dateFilter").value;
  const searchOrder = document.getElementById("searchOrder").value.toLowerCase();

  pendingContainer.innerHTML = "";
  completedContainer.innerHTML = "";

  let filteredOrders = orders.filter(order => {
    const matchesDate = !dateFilter || order.date === dateFilter;
    const matchesSearch = !searchOrder || order.id.toLowerCase().includes(searchOrder);
    return matchesDate && matchesSearch;
  });

  const pendingOrders = filteredOrders.filter(order => order.status !== "Picked Up");
  const completedOrders = filteredOrders.filter(order => order.status === "Picked Up");

  if (pendingOrders.length === 0) {
    pendingContainer.innerHTML = "<p class='empty-message'>No pending orders found.</p>";
  }

  pendingOrders.forEach(order => {
    pendingContainer.innerHTML += orderCard(order, false);
  });

  if (completedOrders.length === 0) {
    completedContainer.innerHTML = "<p class='empty-message'>No completed orders found.</p>";
  }

  completedOrders.forEach(order => {
    completedContainer.innerHTML += orderCard(order, true);
  });
}

function orderCard(order, completed) {
  const itemsHTML = (order.items || []).map(item =>
    `<li>${item.name} x${item.quantity} - ₱${item.price * item.quantity}</li>`
  ).join("");

  return `
    <div class="order-card">
      <div class="order-top">
        <div>
          <h3>Order #${order.id}</h3>
          <p><b>Date:</b> ${order.date || "No date"}</p>
          <p><b>Time:</b> ${order.time || "No time"}</p>
        </div>

        <span class="status-pill ${statusClass(order.status)}">
          ${order.status}
        </span>
      </div>

      <p><b>Payment:</b> ${order.payment || "N/A"}</p>
      <p><b>Total:</b> ₱${order.total}</p>

      <div class="items-box">
        <b>Items Ordered:</b>
        <ul>${itemsHTML || "<li>No item details.</li>"}</ul>
      </div>

      ${completed ? "" : `
        <div class="actions">
          <button class="prep" onclick="updateStatus('${order.id}', 'Preparing')">Preparing</button>
          <button class="ready" onclick="updateStatus('${order.id}', 'Ready to Pick Up')">Ready</button>
          <button class="picked" onclick="updateStatus('${order.id}', 'Picked Up')">Picked Up</button>
        </div>
      `}
    </div>
  `;
}

function statusClass(status) {
  if (status === "Preparing") return "status-preparing";
  if (status === "Ready to Pick Up") return "status-ready";
  if (status === "Picked Up") return "status-picked";
  return "";
}

function updateStatus(orderId, status) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = orders.find(o => o.id === orderId);

  if (order) {
    order.status = status;

    if (status === "Picked Up") {
      const now = new Date();
      order.completedDate = now.toISOString().split("T")[0];
      order.completedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  }

  localStorage.setItem("orders", JSON.stringify(orders));
  loadOrders();
}

function showAdminTab(tab, button) {
  document.getElementById("pendingTab").style.display = tab === "pending" ? "block" : "none";
  document.getElementById("completedTab").style.display = tab === "completed" ? "block" : "none";

  document.querySelectorAll(".sidebar button").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
}

function clearFilters() {
  document.getElementById("dateFilter").value = "";
  document.getElementById("searchOrder").value = "";
  loadOrders();
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

loadOrders();
setInterval(loadOrders, 3000);