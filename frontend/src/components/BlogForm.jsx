import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    }
    createBlog({
        content:blogObject,
        important:true
    })
    setNewBlog({ title: '', author: '', url: '' }) // Reset form fields
  }

  return (
    <div>
      <h2>New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input
            name="title"
            value={newBlog.title}
            onChange={handleBlogChange}
          />
        </div>
        <div>
          Author:
          <input
            name="author"
            value={newBlog.author}
            onChange={handleBlogChange}
          />
        </div>
        <div>
          URL:
          <input name="url" value={newBlog.url} onChange={handleBlogChange} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm