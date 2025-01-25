document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const usersKey = "users";

  const showMessage = (message, type) => {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.className = `alert ${
      type === "success" ? "alert-success" : "alert-danger"
    }`;
    setTimeout(() => {
      messageDiv.textContent = "";
      messageDiv.className = "";
    }, 3000);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirm-password")
      .value.trim();

    if (password !== confirmPassword) {
      showMessage("Şifreler uyuşmuyor!", "danger");
      return;
    }

    const users = JSON.parse(localStorage.getItem(usersKey)) || [];
    const userExists = users.some(
      (u) => u.username === username || u.email === email
    );

    if (userExists) {
      showMessage("Kullanıcı adı veya e-posta zaten kullanılıyor!", "danger");
      return;
    }

    const newUser = {
      id: users.length + 1,
      name,
      surname,
      email,
      username,
      password,
      avatar: "https://placehold.co/150", // Default avatar
    };

    users.push(newUser);
    localStorage.setItem(usersKey, JSON.stringify(users));
    showMessage("Kayıt başarılı!", "success");

    form.reset();
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  });
});
