document.addEventListener("DOMContentLoaded", async () => {
  const postContainer = document.querySelector(".post-container");
  const postsKey = "posts";
  const commentsKey = "comments";
  const usersKey = "users";
  const seedCommentsFile = "./seed/comments.seed.json";
  const urlParams = new URLSearchParams(window.location.search);
  const postId = parseInt(urlParams.get("id"));
  const initializeComments = async () => {
    if (!localStorage.getItem(commentsKey)) {
      try {
        const response = await fetch(seedCommentsFile);
        if (!response.ok) throw new Error("Yorum verileri yüklenemedi.");
        const commentsData = await response.json();
        localStorage.setItem(commentsKey, JSON.stringify(commentsData));
      } catch (error) {
        console.error("Yorum verileri yüklenirken hata oluştu:", error);
      }
    }
  };
  await initializeComments();
  const posts = JSON.parse(localStorage.getItem(postsKey)) || [];
  const comments = JSON.parse(localStorage.getItem(commentsKey)) || [];
  const users = JSON.parse(localStorage.getItem(usersKey)) || [];
  const currentPost = posts.find((post) => post.id === postId);
  if (!currentPost) {
    postContainer.innerHTML = `<p>Gönderi bulunamadı.</p>`;
    return;
  }
  const renderPost = () => {
    postContainer.innerHTML = `
      <h2 class="post-title">${currentPost.title}</h2>
      <p class="post-details">
        Kategori: ${getCategoryName(
          currentPost.categoryId
        )} • Gönderi Tarihi: ${formatDate(currentPost.date)} • ${
      currentPost.commentCount
    } Yorum
      </p>
      <div class="post-content">${currentPost.content}</div>
      <h3>Yorumlar</h3>
    `;
    const postComments = comments.filter(
      (comment) => comment.postId === postId
    );
    if (postComments.length === 0) {
      postContainer.innerHTML += `<p>Henüz yorum yapılmamış.</p>`;
    } else {
      postComments.forEach((comment) => {
        const user = users.find((user) => user.id === comment.userId);
        const username = user ? user.username : "Bilinmeyen Kullanıcı";

        postContainer.innerHTML += `
          <div class="comment-card">
            <div class="comment-user">${username}</div>
            <div class="comment-date">${formatDate(comment.date)}</div>
            <div class="comment-text">${comment.comment}</div>
          </div>
        `;
      });
    }
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (currentUser) {
      postContainer.innerHTML += `
        <div class="add-comment">
          <h4>Yorum Yaz</h4>
          <textarea id="new-comment" placeholder="Yorumunuzu buraya yazın..."></textarea>
          <button class="button" id="submit-comment">Gönder</button>
        </div>
      `;
      document
        .getElementById("submit-comment")
        .addEventListener("click", () => {
          const newCommentText = document
            .getElementById("new-comment")
            .value.trim();
          if (newCommentText) {
            const newComment = {
              id: comments.length + 1,
              postId: postId,
              userId: currentUser.id,
              comment: newCommentText,
              date: new Date().toISOString(),
            };
            comments.push(newComment);
            localStorage.setItem(commentsKey, JSON.stringify(comments));
            currentPost.commentCount += 1;
            const updatedPosts = posts.map((post) =>
              post.id === postId
                ? { ...post, commentCount: currentPost.commentCount }
                : post
            );
            localStorage.setItem(postsKey, JSON.stringify(updatedPosts));
            window.location.reload();
          }
        });
    } else {
      postContainer.innerHTML += `
        <div class="alert alert-warning" role="alert">
          Yorum yapabilmek için giriş yapmalısınız.
        </div>
      `;
    }
  };
  const getCategoryName = (categoryId) => {
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.categoryName : "Diğer";
  };
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("tr-TR", options);
  };
  renderPost();
});
