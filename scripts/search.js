document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.querySelector(".search-bar input");
  const filterSelect = document.querySelector(".search-bar select");
  const searchButton = document.querySelector(".search-bar button");
  const resultsContainer = document.querySelector(".search-results");
  const postsKey = "posts";
  const seedPostsFile = "./seed/posts.seed.json";
  const initializePosts = async () => {
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
  await initializePosts();
  const posts = JSON.parse(localStorage.getItem(postsKey)) || [];
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("tr-TR", options);
  };
  const renderPosts = (filteredPosts) => {
    resultsContainer.innerHTML = "";
    if (filteredPosts.length === 0) {
      resultsContainer.innerHTML = `<p>Sonuç bulunamadı.</p>`;
      return;
    }
    filteredPosts.forEach((post) => {
      resultsContainer.innerHTML += `
        <div class="result-card">
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <p class="details">Kategori: ${post.categoryId} • ${
        post.commentCount
      } Yorum • ${formatDate(post.date)}</p>
          <a href="post.html?id=${post.id}" class="button">Gönderiye Git</a>
        </div>
      `;
    });
  };
  const filterAndSortPosts = () => {
    const query = searchInput.value.trim().toLowerCase();
    const filter = filterSelect.value;
    let filteredPosts = posts;
    if (query) {
      filteredPosts = filteredPosts.filter((post) => {
        return (
          post.title.toLowerCase().includes(query) ||
          post.categoryId.toString().includes(query)
        );
      });
    }
    if (filter === "popularity") {
      filteredPosts.sort((a, b) => b.commentCount - a.commentCount);
    } else if (filter === "date") {
      filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    renderPosts(filteredPosts);
  };
  searchButton.addEventListener("click", filterAndSortPosts);
  renderPosts(posts);
});
