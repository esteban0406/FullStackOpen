import React, { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, updateBlog, deleteBlog, loggedInUser }) => {
  const [visible, setVisible] = useState(false);

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    await updateBlog(updatedBlog);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    );
    if (confirmDelete) {
      try {
        await deleteBlog(blog.id); // Call the deleteBlog function only after confirmation
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  return (
    <div
      style={{
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5,
      }}
    >
      <div className="blog">
        {visible ? (
          <div className="blog-expanded">
            {blog.title} <button onClick={() => setVisible(false)}>Hide</button>
            <br />
            {blog.author} <br />
            {blog.user.username}
            <br />
            Likes {blog.likes}
            <button onClick={handleLike}>Like</button>
            <br />
            {loggedInUser && blog.user.username === loggedInUser.username && (
              <button onClick={handleDelete}>remove</button>
            )}
          </div>
        ) : (
          <div className="blog-default">
            <span>{blog.title}</span>
            <br />
            <span>{blog.author}</span>
            <br />
            <button onClick={() => setVisible(true)}>View</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;