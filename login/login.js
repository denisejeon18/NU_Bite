function loginUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "NU_student" && password === "student001") {
    window.location.href = "../student/student.html";
  } 
  else if (username === "canteen_admin" && password === "admin001") {
    window.location.href = "../admin/admin.html";
  } 
  else {
    openLoginErrorModal();
  }
}

function continueAsGuest() {
  window.location.href = "../guest/guest.html";
}

function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.getElementById("togglePasswordBtn");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.innerText = "🙈";
  } else {
    passwordInput.type = "password";
    toggleBtn.innerText = "👁️";
  }
}

function openLoginErrorModal() {
  document.getElementById("loginErrorModal").style.display = "flex";
}

function closeLoginErrorModal() {
  document.getElementById("loginErrorModal").style.display = "none";
}