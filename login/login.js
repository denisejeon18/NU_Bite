function loginUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "NU_student" && password === "2024-1000316") {
    window.location.href = "../student/student.html";
  } 
  else if (username === "canteen_admin" && password === "admin001") {
    window.location.href = "../admin/admin.html";
  } 
  else {
    alert("Invalid username or password!");
  }
}

function continueAsGuest() {
  window.location.href = "../guest/guest.html";
}