import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/NotificationReducer'
import Notification from './Notification'

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => {
    if (state.filter === '') {
      return state.anecdotes
    }else {
      return state.anecdotes.filter((anecdote) =>
        anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
      )
    }
  })
  const dispatch = useDispatch()
  const addVote = (id) => {
    dispatch(vote(id))
    const votedAnecdote = anecdotes.find(a => a.id === id)
    dispatch(setNotification(`you voted '${votedAnecdote.content}'`))

  }

  return (
    <div>
      <Notification/>
      { anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => addVote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
