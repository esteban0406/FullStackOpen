import { useQuery } from '@apollo/client'
import { allAuthors, EDIT_AUTHOR } from '../queries'
import { useMutation } from '@apollo/client'

const Authors = (props) => {
  const result = useQuery(allAuthors)
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      console.error('Error updating author:', error)
    },
    onCompleted: () => {
      console.log('Author updated successfully')
    },
    refetchQueries: [{ query: allAuthors }],
  })
  if (!props.show) {
    return null
  }

  if (result.loading) return <div>Loading...</div>
  if (!result.data || !result.data.allAuthors) return null

  const authors = result.data.allAuthors.map((a) => ({
    name: a.name,
    born: a.born || 'unknown',
    bookCount: a.bookCount || 0,
  }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    const name = event.target[0].value
    const born = parseInt(event.target[1].value)
    editAuthor({
      variables: { name, setBornTo: born },
    })
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <select>
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input type="number" />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
