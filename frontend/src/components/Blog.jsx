import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false);

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    await updateBlog(updatedBlog);
  };

const handleDelete = async () => {
  const confirmDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`);
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
      {visible ? (
        <>
          {blog.title} <button onClick={() => setVisible(false)}>Hide</button><br></br>
          {blog.author} <br />
          {blog.user.username}
          <br />
          Likes {blog.likes}
          <button onClick={handleLike}>Like</button>
          <br />
          <button onClick={handleDelete}>remove</button>
        </>
      ) : (
        <>
          {blog.title} <br />
          {blog.author} <br />
          <button onClick={() => setVisible(true)}>View</button>
        </>
      )}
    </div>
  );
};

export default Blog;
