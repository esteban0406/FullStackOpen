import { useDispatch } from 'react-redux'

const Filter = () => {

  const dispatch = useDispatch()

  const handleChange = (event) => {

    const filter = event.target.value
    const action = {
      type: 'SET_FILTER',
      data:  filter 
    }
    dispatch(action)
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter