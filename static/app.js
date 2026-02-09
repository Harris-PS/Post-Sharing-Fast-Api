const API_URL = "/posts";

document.addEventListener("DOMContentLoaded", () => {
  fetchPosts();
  document
    .getElementById("createPostForm")
    .addEventListener("submit", createPost);
});

async function fetchPosts() {
  try {
    const response = await fetch(API_URL);
    const posts = await response.json();
    const container = document.getElementById("postsContainer");
    container.innerHTML = "";

    posts.forEach((post, index) => {
      const card = document.createElement("div");
      card.className = "post-card";
      card.style.animationDelay = `${index * 0.1}s`;
      card.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <button class="delete-btn" onclick="deletePost('${post.id}')" title="Delete Post">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;
      container.prepend(card); // Newest first
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

async function createPost(e) {
  e.preventDefault();
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");

  const postData = {
    title: titleInput.value,
    content: contentInput.value,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      titleInput.value = "";
      contentInput.value = "";
      fetchPosts(); // Refresh list
    } else {
      alert("Failed to create post");
    }
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

async function deletePost(id) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchPosts(); // Refresh list
    } else {
      alert("Failed to delete post");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}
