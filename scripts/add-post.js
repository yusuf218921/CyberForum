document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const postTitleInput = document.getElementById("post-title");
  const categorySelect = document.getElementById("category");
  const contentTextarea = document.getElementById("content");
  const postsKey = "posts";
  const categoriesKey = "categories";
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }
  const initializeCategories = () => {
    const categories = JSON.parse(localStorage.getItem(categoriesKey)) || [];
    if (categories.length === 0) {
      categorySelect.innerHTML =
        '<option value="" disabled selected>Kategori bulunamadı</option>';
      return;
    }

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.categoryName;
      categorySelect.appendChild(option);
    });
  };
  initializeCategories();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = postTitleInput.value.trim();
    const categoryId = parseInt(categorySelect.value);
    const content = contentTextarea.value.trim();
    if (!title || !categoryId || !content) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    const posts = JSON.parse(localStorage.getItem(postsKey)) || [];
    const newPost = {
      id: posts.length + 1,
      categoryId,
      userId: currentUser.id,
      title,
      content,
      date: new Date().toISOString(),
      commentCount: 0,
    };
    posts.push(newPost);
    localStorage.setItem(postsKey, JSON.stringify(posts));

    alert("Gönderi başarıyla oluşturuldu!");
    form.reset();
    window.location.href = "home.html";
  });
});
