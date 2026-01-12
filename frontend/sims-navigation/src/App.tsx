import { useState } from 'react'
import { HealthStatus } from "./components/HealthStatus"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p> this is the frontend </p>
       <HealthStatus />
    </>
  )
}

export default App
