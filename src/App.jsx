import { useEffect } from 'react'
import Globe from './Globe'
import UI from './UI'
import useStore from './store'

const App = () => {
  const { nextQuestion } = useStore()

  // Initialize with first question
  useEffect(() => {
    nextQuestion()
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      background: '#000'
    }}>
      <Globe />
      <UI />
    </div>
  )
}

export default App
