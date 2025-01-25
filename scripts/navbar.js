document.addEventListener("DOMContentLoaded", () => {
  const userSection = document.getElementById("user-section");
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  if (currentUser) {
    userSection.innerHTML = `
      <div id="profile-menu" class="profile-menu">
        <img src="${currentUser.avatar}" alt="Profil Resmi" class="profile-avatar" />
        <div class="profile-dropdown hidden">
          <p class="profile-name">${currentUser.name} ${currentUser.surname}</p>
          <a href="profile.html" class="profile-link">Profilim</a>
          <a href="#" class="logout">Çıkış Yap</a>
        </div>
      </div>
    `;

    const profileMenu = document.getElementById("profile-menu");
    const dropdown = document.querySelector(".profile-dropdown");

    profileMenu.addEventListener("click", () => {
      dropdown.classList.toggle("hidden");
    });

    document.querySelector(".logout").addEventListener("click", () => {
      sessionStorage.removeItem("currentUser");
      window.location.href = "index.html";
    });

    document.addEventListener("click", (e) => {
      if (!profileMenu.contains(e.target)) {
        dropdown.classList.add("hidden");
      }
    });
  }
});
