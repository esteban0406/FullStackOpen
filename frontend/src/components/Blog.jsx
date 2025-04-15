import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async (blog) => {
    {console.log(blog)}
    console.log('Blog ID:', blog.id)
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
  
    try {
      const response = await blogService.update(blog.id, updatedBlog)
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }
  
  return (
    <div style={blogStyle}> 
      {blog.title} <br></br>
      {blog.author}<br></br>
      {visible ? (
        <>
          {blog.user.username}<br></br>
          Likes {blog.likes} 
          <button onClick={()=>{handleLike(blog)}}>Like</button><br></br>
          <button
            onClick={() => {
              setVisible(false)
            }}
          >
            Hide
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            setVisible(true)
          }}
        >
          View
        </button>
      )}
    </div>
  )
}

export default Blog
