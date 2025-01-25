document.addEventListener("DOMContentLoaded", async () => {
  const usersKey = "users";
  const seedFile = "./seed/users.seed.json";
  const initializeUsers = async () => {
    if (!localStorage.getItem(usersKey)) {
      try {
        const response = await fetch(seedFile);
        if (!response.ok) throw new Error("JSON dosyası yüklenemedi.");
        const usersData = await response.json();
        localStorage.setItem(usersKey, JSON.stringify(usersData));
      } catch (error) {
        console.error("Kullanıcı verileri yüklenirken hata oluştu:", error);
      }
    }
  };
  await initializeUsers();
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (currentUser) {
    window.location.href = "home.html";
    return;
  }
  const formContainer = document.querySelector(".form-container");
  const usernameInput = document.querySelector(
    'input[placeholder="Kullanıcı Adı"]'
  );
  const passwordInput = document.querySelector('input[placeholder="Şifre"]');
  const loginButton = document.querySelector("#login-button");

  const createAlert = (message, type) => {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} mt-3`;
    alert.textContent = message;
    formContainer.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 3000);
  };

  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      createAlert("Kullanıcı adı ve şifre alanlarını doldurunuz.", "danger");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem(usersKey)) || [];
    const user = storedUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      window.location.href = "home.html";
    } else {
      createAlert("Kullanıcı adı veya şifre hatalı.", "danger");
    }
  });
});
