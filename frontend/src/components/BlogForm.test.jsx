import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  it('calls createBlog with correct details when form is submitted', () => {
    const mockCreateBlog = vi.fn()

    render(<BlogForm createBlog={mockCreateBlog} />)

    // Fill out form inputs
    const titleInput = screen.getByRole('textbox', { name: /title/i })
    const authorInput = screen.getByRole('textbox', { name: /author/i })
    const urlInput = screen.getByRole('textbox', { name: /url/i })

    fireEvent.change(titleInput, { target: { value: 'React Testing' } })
    fireEvent.change(authorInput, { target: { value: 'Jane Developer' } })
    fireEvent.change(urlInput, { target: { value: 'https://react.test' } })

    // Submit the form
    const createButton = screen.getByText('create')
    fireEvent.click(createButton)

    // Assert that the mock was called once with correct content
    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      content: {
        title: 'React Testing',
        author: 'Jane Developer',
        url: 'https://react.test',
      },
      important: true,
    })
  })
})
