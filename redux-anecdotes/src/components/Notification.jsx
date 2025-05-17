import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../reducers/NotificationReducer'
import { useEffect } from 'react'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  const dispatch = useDispatch()

  useEffect(() => {
    if (notification !== '') {
      const timer = setTimeout(() => {
        dispatch(setNotification(''))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification, dispatch])

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
  }

  if (notification === '') return null

  return <div style={style}>{notification}</div>
}

export default Notification
