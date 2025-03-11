document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('posts');

    // Fetch and display posts
    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts');
            const posts = await response.json();
            displayPosts(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Display posts in the DOM
    const displayPosts = (posts) => {
        postsContainer.innerHTML = posts.map(post => `
            <div class="post" data-id="${post.id}">
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <small>Created: ${post.createdAt}</small>
                <div class="actions">
                    <button onclick="editPost('${post.id}')">Edit</button>
                    <button onclick="deletePost('${post.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    };

    // Create new post
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        try {
            await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
            });
            postForm.reset();
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    });

    // Delete post
    window.deletePost = async (id) => {
        try {
            await fetch(`/api/posts/${id}`, {
                method: 'DELETE'
            });
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // Edit post
    window.editPost = async (id) => {
        const post = document.querySelector(`[data-id="${id}"]`);
        const title = prompt('Enter new title:', post.querySelector('h2').textContent);
        const content = prompt('Enter new content:', post.querySelector('p').textContent);

        if (title && content) {
            try {
                await fetch(`/api/posts/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, content })
                });
                fetchPosts();
            } catch (error) {
                console.error('Error updating post:', error);
            }
        }
    };

    // Initial fetch
    fetchPosts();
});