import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'
import { useEffect } from 'react'

const Books = (props) => {
  const { data, loading, error } = useQuery(ALL_BOOKS)
  const [genres, setGenres] = useState(null)
  const [filteredBooks, setFilteredBooks] = useState([])

  useEffect(() => {
    if (data && data.allBooks) {
      setGenres(Array.from(new Set(data.allBooks.flatMap((b) => b.genres))))
    }
  }, [data])

  if (!props.show) {
    return null
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error!</div>
  if (!data || !data.allBooks) return null

  const books = data.allBooks.map((b) => ({
    title: b.title,
    author: b.author.name,
    published: b.published,
  }))

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.length > 0
            ? filteredBooks.map((b) => (
                <tr key={b.title}>
                  <td>{b.title}</td>
                  <td>{b.author.name}</td>
                  <td>{b.published}</td>
                </tr>
              ))
            : books.map((b) => (
                <tr key={b.title}>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.published}</td>
                </tr>
              ))}
        </tbody>
      </table>
      {genres && (
        <div>
          <h3>Genres</h3>
          <ul>
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => {
                  const filtered = data.allBooks.filter((b) =>
                    b.genres.includes(g)
                  )
                  setFilteredBooks(filtered)
                }}
              >
                {g}
              </button>
            ))}
          </ul>
          <button
            onClick={() => {
              setFilteredBooks([])
            }}
          >
            All
          </button>
        </div>
      )}
    </div>
  )
}

export default Books
