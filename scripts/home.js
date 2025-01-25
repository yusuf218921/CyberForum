document.addEventListener("DOMContentLoaded", async () => {
  const postsContainer = document.querySelector(".container");
  const postsKey = "posts";
  const categoriesKey = "categories";
  const seedPostsFile = "./seed/posts.seed.json";
  const seedCategoriesFile = "./seed/categories.seed.json";

  const initializeData = async () => {
    // Kategorileri localStorage'a ekle
    if (!localStorage.getItem(categoriesKey)) {
      try {
        const response = await fetch(seedCategoriesFile);
        if (!response.ok) throw new Error("Kategori verileri yüklenemedi.");
        const categoriesData = await response.json();
        localStorage.setItem(categoriesKey, JSON.stringify(categoriesData));
      } catch (error) {
        console.error("Kategori verileri yüklenirken hata oluştu:", error);
      }
    }

    // Postları localStorage'a ekle
    if (!localStorage.getItem(postsKey)) {
      try {
        const response = await fetch(seedPostsFile);
        if (!response.ok) throw new Error("Post verileri yüklenemedi.");
        const postsData = await response.json();
        localStorage.setItem(postsKey, JSON.stringify(postsData));
      } catch (error) {
        console.error("Post verileri yüklenirken hata oluştu:", error);
      }
    }
  };

  await initializeData();

  const posts = JSON.parse(localStorage.getItem(postsKey)) || [];
  const categories = JSON.parse(localStorage.getItem(categoriesKey)) || [];

  const renderPosts = () => {
    // Postları tarihe göre sıralayıp son 5 postu al
    const sortedPosts = posts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    postsContainer.innerHTML = `
      <div class="create-post-container">
        <a href="add-post.html" class="button">Gönderi Oluştur</a>
      </div>
      <h2 class="header-title">Son Gönderiler</h2>
    `;

    if (sortedPosts.length === 0) {
      postsContainer.innerHTML += `<p>Gösterilecek gönderi bulunamadı.</p>`;
      return;
    }

    sortedPosts.forEach((post) => {
      const postCard = document.createElement("div");
      postCard.classList.add("post-card");
      postCard.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <p class="details">Kategori: ${getCategoryName(post.categoryId)} • ${
        post.commentCount
      } Yorum • ${formatDate(post.date)}</p>
        <a href="post.html?id=${post.id}" class="button">Gönderiye Git</a>
      `;
      postsContainer.appendChild(postCard);
    });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.categoryName : "Diğer";
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("tr-TR", options);
  };

  renderPosts();
});
