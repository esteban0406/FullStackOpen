import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'



describe('<Blog />', () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Esteban Developer',
    url: 'https://example.com/react',
    likes: 42,
    user: { username: 'janedoe' },
  }

  test('renders title and author, but not url or likes by default', () => {
    render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} />)

    // Check visible content
    expect(screen.getByText(blog.title)).toBeDefined()
    expect(screen.getByText(blog.author)).toBeDefined()

    // Check that url and likes are not visible by default
    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(/Likes/)).toBeNull()
  })

  test('calls updateBlog twice when like button is clicked twice', async () => {
    const mockUpdateBlog = vi.fn()
    const mockDeleteBlog = vi.fn()

    render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
      />
    )

    const user = userEvent.setup()

    // Expand blog details to show the like button
    const viewButton = screen.getByText('View')
    await user.click(viewButton)

    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateBlog).toHaveBeenCalledTimes(2)
  })
})
